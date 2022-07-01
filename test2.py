#!/bin/env python
#-*- coding:utf8 -*-

import glob
import time
import Queue
import sys
import os
import random
import socket
import signal
import threading
import re
import shutil
import ConfigParser
import cx_Oracle

import Mobigen.Common.Log as Log; Log.Init()
import API.M6 as M6

queue = Queue.Queue()

SHUTDOWN	= False
LOCK	    = threading.Lock()

def handler(sigNum, frame) :
	__LOG__.Trace('Catch Signal Number = [%s]' % sigNum)
	global SHUTDOWN
	SHUTDOWN = True

signal.signal(signal.SIGTERM, handler)
signal.signal(signal.SIGINT,  handler)
signal.signal(signal.SIGHUP, signal.SIG_IGN)
signal.signal(signal.SIGPIPE, signal.SIG_IGN)


class SocketTimeoutException(Exception) :

	def __str__(self) :
		return "M6 SocketTimeoutException"



def stderr(file_name) :
	sys.stderr.write(file_name + '\n')
	sys.stderr.flush()
	__LOG__.Trace('Std ERR : %s' % file_name)



def stdout(file_name) :
	sys.stdout.write(file_name + '\n')
	sys.stdout.flush()
	__LOG__.Trace('Std OUT : %s' % file_name)



def call_shutdown() :

	__LOG__.Trace('!!! SHUTDOWN !!!')
	os._exit(1)



def file_name_chk(file_name) :

	try :
		fn = os.path.basename(file_name).split("-")

		if len(fn) != 2 :
			__LOG__.Trace("""File Format Check : split "-" to 2 sections -> (OriginalFileName)-(Key_Partition.dat)""")
			return False

		load_info = os.path.splitext(fn[1])[0].split("_")
		if len(load_info) != 2 :
			__LOG__.Trace("""File Format Check : 2 section split "_" to key, partition -> OriginalFileName-(Key)_(Partition.dat)""")
			return False

		org_file_info = fn[0].split("_")
		if len(org_file_info) != 4 and len(org_file_info[2]) < 5 :
			__LOG__.Trace("""File Format Check : 1 section split "_" to 4 sections -> (MERGE)_(CDR)_(DC604001)_(20130604161601.558.dat)-0_20130801105500.dat-Key_Partition.dat""")
			return False

	except Exception, e :
		__LOG__.Trace("Exception -> %s" % e)
		return False

	return True



def load(file_name, iris_info, iris_user, iris_pass, table, direct_flag, ctl_file, retry_cnt, field_sep, record_sep) :

	keynum, partition = os.path.splitext(os.path.basename(file_name))[0].split("-")[1].split("_")
	key = os.path.basename(file_name).split("-")[0].split("_")[2][:5] + keynum[:1]

	__LOG__.Trace("Loading Start [ Table : %s  Key : %s  Partition : %s ]" % (table, key, partition))

	for cnt in range(retry_cnt) :

		if SHUTDOWN :
			break

		try :
			th_obj = threading.Timer(310, call_shutdown)
			th_obj.setDaemon(True)
			th_obj.start()

			con = M6.Connection(iris_info, iris_user, iris_pass, Direct=direct_flag, Debug=True, LogModule='MOBIGEN')
			c   = con.cursor()

			__LOG__.Trace("IRIS M6 Connection OK : %s(%s:%s) %s/%s" % (iris_info, con.addr_info[0], con.addr_info[1], iris_user, iris_pass))

			c.SetFieldSep(field_sep)
			c.SetRecordSep(record_sep)
			c.SetTimeout(300)

			ret = c.Load(table, key, partition, ctl_file, file_name).strip()
			th_obj.cancel()
			del(th_obj)

			c.Close()
			con.close()

			__LOG__.Trace(ret)

			if "+OK SUCCESS" in ret :
				return True

			else :
				time.sleep(2)
				pass

		except M6.Socket.SocketTimeoutException, err :
			__LOG__.Trace("-SocketTimeoutException : %s" % err)
			try :
				c.Close()
				con.close()
				__LOG__.Trace("IRIS M6 Connection Close OK")
			except :
				pass
			th_obj.cancel()
			time.sleep(2)

		except Exception, err :
			__LOG__.Exception()
			try :
				c.Close()
				con.close()
				__LOG__.Trace("IRIS M6 Connection Close OK")
			except :
				pass
			th_obj.cancel()
			time.sleep(2)

		if SHUTDOWN :
			break

	return False


def Main() :
	global SHUTDOWN

	module = os.path.basename(sys.argv[0])

	if len(sys.argv) < 3 :
		print >> sys.stderr, "Usage   : %s System ConfigFile" % module
		print >> sys.stderr, "Example : %s SYS_CDR /home/eureka/ERK/conf/IRISLoader.conf" % module
		sys.exit()

	system = sys.argv[1]
	cfgFile = sys.argv[2]

	cfg = ConfigParser.ConfigParser()
	cfg.read(cfgFile)

	log_path = cfg.get('GENERAL', 'LOG_PATH')
	log_file = '%s_%s.log' % (os.path.join(log_path, module), system)
	if '-d' in sys.argv :
		Log.Init()
	else :
		Log.Init(Log.CRotatingLog(log_file, 10240000, 9))
	__LOG__.Trace('	       LOADER START...')

	iris_info       = "%s:%s" % (cfg.get("GENERAL", "IRIS_IP"), cfg.get("GENERAL", "IRIS_PORT"))
	iris_user       = cfg.get("GENERAL", "IRIS_USER")
	iris_pass       = cfg.get("GENERAL", "IRIS_PASS")
	retry_cnt       = cfg.getint("GENERAL", "RETRY_CNT")
	table			= cfg.get(system, "TABLE")
	direct_flag     = cfg.getboolean(system, "DIRECT")
	stdout_flag     = cfg.getboolean(system, "STDOUT")
	ctl_file		= cfg.get(system, "CTL_FILE")
	err_path		= cfg.get(system, "ERROR_PATH")
	try : field_sep = cfg.get(system, "FIELD_SEP")
	except : field_sep = ","
	try : record_sep = cfg.get(system, "RECORD_SEP").replace("\\n", "\n").replace("\\r", "\r")
	except : record_sep = "\n"
	try : noti_flag = cfg.getboolean(system, "NOTI_FLAG")
	except : noti_flag = False
	sys_ip			= socket.gethostbyname(socket.gethostname())

	try : os.makedirs(err_path)
	except : pass

	__LOG__.Trace("Config Info : [ iris_info : %s %s/%s  retry : %s  Direct : %s  ctl : %s ]" % (iris_info, iris_user, iris_pass, retry_cnt, direct_flag, ctl_file))

	while not SHUTDOWN :
		try :
			stdin = sys.stdin.readline().strip()
			file_name = stdin.replace("file://", "")
		except :
			continue

		noti_list = list()

		__LOG__.Trace('Std  IN : %s' % stdin)

		if file_name_chk(file_name) == False :
			__LOG__.Trace("Invalid File Naming Rule : %s" % file_name)
			stderr(stdin)
			continue

		if os.path.exists(file_name) == False :
			__LOG__.Trace("File Not Exists : %s" % file_name)
			stderr(stdin)
			continue

		total_line = int(os.popen("wc -l %s | awk '{ print $1 }'" % file_name).read().strip())
		file_size = float(os.path.getsize(file_name))/1024/1024
		
		st_time = time.time()
		try :
			result = load(file_name, iris_info, iris_user, iris_pass, table, direct_flag, ctl_file, retry_cnt, field_sep, record_sep)
		except Exception, err :
			__LOG__.Trace("-Exception : %s" % err)
			__LOG__.Exception()
			result = False
		process_time = "%.3f" % (time.time() - st_time)

		if SHUTDOWN :
			break

		if result :
			__LOG__.Trace("Complete %s [ Time : %s  Size : %.2f MB  Lines : %s ]" % (os.path.basename(file_name), process_time, file_size, total_line))
			load_line = total_line
			try : os.remove(file_name)
			except : __LOG__.Exception()
		else :
			__LOG__.Trace("Fail %s [ Time : %s  Size : %.2f MB  Lines : %s ]" % (os.path.basename(file_name), process_time, file_size, total_line))
			load_line = "0"
			try : shutil.move(file_name, err_path)
			except : __LOG__.Exception()


		stderr(stdin)

		if stdout_flag :
			stdout(stdin)

		if noti_flag :
			tmp_list = list()
			tmp_list.append(os.path.basename(file_name))	# FileName
			tmp_list.append(os.path.split(file_name)[0])	# FilePath
			tmp_list.append("LD")							# ProcessType
			tmp_list.append(str(total_line))				# TotalLine
			tmp_list.append(time.strftime("%Y%m%d%H%M%S", time.localtime(time.time())))	# LocalTime
			tmp_list.append(str(process_time))				# ProcessTime
			tmp_list.append(str(load_line))					# LoadLine
			tmp_list.append(sys_ip)							# System IP
			tmp_list.append(table)							# Loading Table

			noti_msg = "file://%s" % ("|^|".join(tmp_list))
			stdout(noti_msg)



	__LOG__.Trace('	       LOADER END... \n\n')



if __name__ == "__main__" :
	try:
		Main()
	except Exception, err:
		__LOG__.Trace("-Exception : %s" % err)
		__LOG__.Exception()

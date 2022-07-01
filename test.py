#!/bin/env python

import os
import sys
import cx_Oracle
import commands

import Mobigen.Common.Log as Log; Log.Init()


oraInfo = 'iris/iris1234@EUREKA'
portfwd = '/home/eva/util/portfwd-0.27/sbin/portfwd -c /home/eva/util/portfwd-0.27/cfg/eureka.cfg'


def chk_sqlplus() :

	cmd = """echo 'select sysdate from dual;' | sqlplus -S %s""" % oraInfo

	ret = commands.getoutput( cmd )

	if 'SYSDATE' in ret :
		return True

	__LOG__.Trace( ret )

	return False 



def chk_cxOracle() :

	try :
		con = cx_Oracle.connect( oraInfo )
		cur = con.cursor()

		cur.execute( 'select * from dual' )
		ret = cur.fetchall()

		return True

	except :
		__LOG__.Exception()
		return False



def restart_portfwd() :

	cmd = """ps -ef | grep portfwd | grep eureka"""
	ret = '\n' + commands.getoutput( cmd )
	__LOG__.Trace( ret )

	cmd = """ps -ef | grep portfwd | grep eureka | awk '{ print $2 }'"""
	ret = commands.getoutput( cmd ).split('\n')

	for pid in ret :
		try : 
			os.kill( int(pid.strip()), 9 )
			__LOG__.Trace( "kill -9 %s" % pid.strip() )
		except :
			__LOG__.Exception()
	os.system( portfwd )



def main() :
	__LOG__.Trace( '============= Check Start =============' )

	if not (chk_sqlplus() and chk_cxOracle()) :
		restart_portfwd()

	else :
		__LOG__.Trace( '+OK' )

	__LOG__.Trace( '============== Check End ==============' )

if __name__ == '__main__' :
	try : 
		main()
	except : 
		__LOG__.Exception()

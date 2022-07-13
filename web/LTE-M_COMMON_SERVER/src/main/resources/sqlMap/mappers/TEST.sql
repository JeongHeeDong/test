INSERT INTO TB_CO_RU
		  (  
			RU_NAME
		 , 
			OPR_STATUS
		 , 
			SECTOR
		 , 
			PORT_ID
		 , 
			SEQUENCE_ID
		 , 
			LATITUDE
		 , 
			LONGITUDE
		 , 
			FREQUENCY
		 , 
			CONNECT_RUTYPE
		 , 
			PLD_RU_NAME
		 , 
			BOARD_TYPE
		 , 
			DU_ID
		 , 
			CELL_NUM
		 , 
			C_UID
		 , 
			P_CUID
		 ) VALUES 
		  (  
			'-'
		 , 
			'1'
		 , 
			'0'
		 , 
			'0'
		 , 
			'0'
		 , 
			'N 000:00:00.000'
		 , 
			'E 000:00:00.000'
		 , 
			'700'
		 , 
			'16'
		 , 
			'-'
		 , 
			'58'
		 , 
			'101'
		 , 
			'0'
		 , 
			(SELECT CONCAT(IFNULL(MAX(CONVERT(RU.C_UID,UNSIGNED))+1,100000001)) FROM TB_CO_RU AS RU)
		 , 
			(SELECT DU.C_UID FROM TB_CO_DU AS DU WHERE DU.DU_ID = 101)
		 )
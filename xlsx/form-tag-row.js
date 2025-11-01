//Name	Path	Connection	PLC tag	DataType	Length	Coding	Access Method	Address	Indirect addressing	Index tag	Start value	ID tag	Display name [en-US]	Comment [en-US]	Acquisition mode	Acquisition cycle	Limit Upper 2 Type	Limit Upper 2	Limit Upper 1 Type	Limit Upper 1	Limit Lower 1 Type	Limit Lower 1	Limit Lower 2 Type	Limit Lower 2	Linear scaling	End value PLC	Start value PLC	End value HMI	Start value HMI	Gmp relevant	Confirmation Type	Mandatory Commenting
/**
 * 
 * 
 * 
 * CP10_U01TrackingDB_EQ010Ds_tobPresenceBo	CP10\CP10_U01TrackingDB	CP10	<No Value>	Bool	1	Binary	Absolute access	%DB320.DBX0.0	False	<No Value>	<No Value>	0	<No Value>	control mode of HMI	Cyclic in operation	1 s	None	<No Value>	None	<No Value>	None	<No Value>	None	<No Value>	False	10	0	100	0	False	None	False

CP10_CG01_DB_to_diagDs_distrCmdsDs	CP10\CG01_DB	CP10	<No Value>	Word	2	Binary	Absolute access	%DB20.DBW22	False	<No Value>	<No Value>	0	<No Value>	IPIDistrCommandsUDT:	Cyclic in operation	1 s	None	<No Value>	None	<No Value>	None	<No Value>	None	<No Value>	False	10	0	100	0	False	None	False


CP10_CG01_DB_st_newAlmAutoResetDs_lastTimeTm	CP10\CG01_DB	CP10	<No Value>	Time	4	Binary	Absolute access	%DB20.DBD36	False	<No Value>	<No Value>	0	<No Value>	control mode of HMI	Cyclic in operation	1 s	None	<No Value>	None	<No Value>	None	<No Value>	None	<No Value>	False	10	0	100	0	False	None	False

CP10_CG01_DB_ctrlModeHMIStFb	CP10\CG01_DB	CP10	<No Value>	String	50	Binary	Absolute access	%DB101.DBX0.0	False	<No Value>	<No Value>	0	<No Value>	control mode of HMI	Cyclic in operation	1 s	None	<No Value>	None	<No Value>	None	<No Value>	None	<No Value>	False	10	0	100	0	False	None	False

CP10_EQParametersDB_EQ030_MTfillingSPRe	CP10\CP10_EQParametersDB	CP10	<No Value>	Real	4	IEEE754	Absolute access	%DB41.DBD60	False	<No Value>	<No Value>	0	<No Value>	Metering tube filling set point (%) (NOT USED IN S200)	Cyclic in operation	1 s	None	<No Value>	None	<No Value>	None	<No Value>	None	<No Value>	False	10	0	100	0	False	None	False


CP10_HMIDB_ctrlMode_CG01_dateTimeDt	CP10\CP10_HMIDB	CP10	<No Value>	Date_And_Time	8	Binary	Absolute access	%DB101.DBX58.0	False	<No Value>	<No Value>	0	<No Value>	HMI panel date & time	Cyclic in operation	1 s	None	<No Value>	None	<No Value>	None	<No Value>	None	<No Value>	False	10	0	100	0	False	None	False

CP10_HMIDB_ctrlMode_CG01_PLCtoHMIhandshakeIt	CP10\CP10_HMIDB	CP10	<No Value>	Int	2	Binary	Absolute access	%DB101.DBW76	False	<No Value>	<No Value>	0	<No Value>	handshake PLC to HMI	Cyclic in operation	1 s	None	<No Value>	None	<No Value>	None	<No Value>	None	<No Value>	False	10	0	100	0	False	None	False


Sys_UInt	System\System	<No Value>	<No Value>	UInt	2	Binary	<No Value>	<No Value>	False	<No Value>	<No Value>	0	<No Value>	<No Value>	Cyclic in operation	1 s	None	<No Value>	None	<No Value>	None	<No Value>	None	<No Value>	False	10	0	100	0	False	None	False

 */

const HEADER = "Name	Path	Connection	PLC tag	DataType	Length	Coding	Access Method	Address	Indirect addressing	Index tag	Start value	ID tag	Display name [en-US]	Comment [en-US]	Acquisition mode	Acquisition cycle	Limit Upper 2 Type	Limit Upper 2	Limit Upper 1 Type	Limit Upper 1	Limit Lower 1 Type	Limit Lower 1	Limit Lower 2 Type	Limit Lower 2	Linear scaling	End value PLC	Start value PLC	End value HMI	Start value HMI	Gmp relevant	Confirmation Type	Mandatory Commenting"

const HEADER_ARRAY = HEADER.split("\t")

const tst_date_and_time = "CP10_HMIDB_ctrlMode_CG01_dateTimeDt	CP10\CP10_HMIDB	CP10	<No Value>	Date_And_Time	8	Binary	Absolute access	%DB101.DBX58.0	False	<No Value>	<No Value>	0	<No Value>	HMI panel date & time	Cyclic in operation	1 s	None	<No Value>	None	<No Value>	None	<No Value>	None	<No Value>	False	10	0	100	0	False	None	False".split("\t")


console.log(HEADER_ARRAY, HEADER_ARRAY.length);
console.log(tst_date_and_time, tst_date_and_time.length);
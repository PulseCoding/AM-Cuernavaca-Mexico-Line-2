// ----------------------------------------------------//
// Se crean las instancias de las librerias a utilizar //
// ----------------------------------------------------//
var fs = require('fs');
var modbus = require('jsmodbus');
var PubNub = require('pubnub');
var MonoblockWait = null,
	CntRejCapper = null,
	WaitCapper = null,
	eol = null;
var TableSuplierct = null,
	TableSuplierresults = null,
	CntInTableSuplier = null,
	CntOutTableSuplier = null,
	TableSuplieractual = 0,
	TableSupliertime = 0,
	TableSupliersec = 0,
	TableSuplierflagStopped = false,
	TableSuplierstate = 0,
	TableSuplierspeed = 0,
	TableSuplierspeedTemp = 0,
	TableSuplierflagPrint = 0,
	TableSupliersecStop = 0,
	TableSuplierdeltaRejected = null,
	TableSuplierONS = false,
	TableSupliertimeStop = 60, //NOTE: Timestop
	TableSuplierWorktime = 0.98, //NOTE: Intervalo de tiempo en minutos para actualizar el log
	TableSuplierflagRunning = false;
var Coderct = null,
	Coderresults = null,
	CntOutCoder = null,
	Coderactual = 0,
	Codertime = 0,
	Codersec = 0,
	CoderflagStopped = false,
	Coderstate = 0,
	Coderspeed = 0,
	CoderspeedTemp = 0,
	CoderflagPrint = 0,
	CodersecStop = 0,
	CoderdeltaRejected = null,
	CoderONS = false,
	CodertimeStop = 60, //NOTE: Timestop
	CoderWorktime = 0.98, //NOTE: Intervalo de tiempo en minutos para actualizar el log
	CoderflagRunning = false;
var Monoblockct = null,
	Monoblockresults = null,
	CntInMonoblock = null,
	CntOutMonoblock = null,
	Monoblockactual = 0,
	Monoblocktime = 0,
	Monoblocksec = 0,
	MonoblockflagStopped = false,
	Monoblockstate = 0,
	Monoblockspeed = 0,
	MonoblockspeedTemp = 0,
	MonoblockflagPrint = 0,
	MonoblocksecStop = 0,
	MonoblockdeltaRejected = null,
	MonoblockONS = false,
	MonoblocktimeStop = 60, //NOTE: Timestop
	MonoblockWorktime = 0.95, //NOTE: Intervalo de tiempo en minutos para actualizar el log
	MonoblockflagRunning = false,
	MonoblockRejectFlag = false,
	MonoblockReject,
	MonoblockVerify = (function() {
		try {
			MonoblockReject = fs.readFileSync('MonoblockRejected.json')
			if (MonoblockReject.toString().indexOf('}') > 0 && MonoblockReject.toString().indexOf('{\"rejected\":') != -1) {
				MonoblockReject = JSON.parse(MonoblockReject)
			} else {
				throw 12121212
			}
		} catch (err) {
			if (err.code == 'ENOENT' || err == 12121212) {
				MonoblockReject = {
					rejected: null,
					lastCPQI: null,
					lastCPQO: null
				}
			}
		}
	})();
var GasFillerct = null,
	GasFillerresults = null,
	CntInGasFiller = null,
	CntOutGasFiller = null,
	GasFilleractual = 0,
	GasFillertime = 0,
	GasFillersec = 0,
	GasFillerflagStopped = false,
	GasFillerstate = 0,
	GasFillerspeed = 0,
	GasFillerspeedTemp = 0,
	GasFillerflagPrint = 0,
	GasFillersecStop = 0,
	GasFillerdeltaRejected = null,
	GasFillerONS = false,
	GasFillertimeStop = 60, //NOTE: Timestop
	GasFillerWorktime = 0.95, //NOTE: Intervalo de tiempo en minutos para actualizar el log
	GasFillerflagRunning = false,
	GasFillerRejectFlag = false,
	GasFillerReject,
	GasFillerVerify = (function() {
		try {
			GasFillerReject = fs.readFileSync('GasFillerRejected.json')
			if (GasFillerReject.toString().indexOf('}') > 0 && GasFillerReject.toString().indexOf('{\"rejected\":') != -1) {
				GasFillerReject = JSON.parse(GasFillerReject)
			} else {
				throw 12121212
			}
		} catch (err) {
			if (err.code == 'ENOENT' || err == 12121212) {
				fs.writeFileSync('GasFillerRejected.json', '{"rejected":0}') //NOTE: Change the object to what it usually is.
				GasFillerReject = {
					rejected: 0
				}
			}
		}
	})();
var Xrayct = null,
	Xrayresults = null,
	CntInXray = null,
	CntOutXray = null,
	Xrayactual = 0,
	Xraytime = 0,
	Xraysec = 0,
	XrayflagStopped = false,
	Xraystate = 0,
	Xrayspeed = 0,
	XrayspeedTemp = 0,
	XrayflagPrint = 0,
	XraysecStop = 0,
	XraydeltaRejected = null,
	XrayONS = false,
	XraytimeStop = 60, //NOTE: Timestop
	XrayWorktime = 0.95, //NOTE: Intervalo de tiempo en minutos para actualizar el log
	XrayflagRunning = false,
	XrayRejectFlag = false,
	XrayReject,
	XrayVerify = (function() {
		try {
			XrayReject = fs.readFileSync('XrayRejected.json')
			if (XrayReject.toString().indexOf('}') > 0 && XrayReject.toString().indexOf('{\"rejected\":') != -1) {
				XrayReject = JSON.parse(XrayReject)
			} else {
				throw 12121212
			}
		} catch (err) {
			if (err.code == 'ENOENT' || err == 12121212) {
				fs.writeFileSync('XrayRejected.json', '{"rejected":0}') //NOTE: Change the object to what it usually is.
				XrayReject = {
					rejected: 0
				}
			}
		}
	})();
var TestBathct = null,
	TestBathresults = null,
	CntInTestBath = null,
	CntOutTestBath = null,
	TestBathactual = 0,
	TestBathtime = 0,
	TestBathsec = 0,
	TestBathflagStopped = false,
	TestBathstate = 0,
	TestBathspeed = 0,
	TestBathspeedTemp = 0,
	TestBathflagPrint = 0,
	TestBathsecStop = 0,
	TestBathdeltaRejected = null,
	TestBathONS = false,
	TestBathtimeStop = 60, //NOTE: Timestop
	TestBathWorktime = 0.95, //NOTE: Intervalo de tiempo en minutos para actualizar el log
	TestBathflagRunning = false,
	TestBathRejectFlag = false,
	TestBathReject,
	TestBathVerify = (function() {
		try {
			TestBathReject = fs.readFileSync('TestBathRejected.json')
			if (TestBathReject.toString().indexOf('}') > 0 && TestBathReject.toString().indexOf('{\"rejected\":') != -1) {
				TestBathReject = JSON.parse(TestBathReject)
			} else {
				throw 12121212
			}
		} catch (err) {
			if (err.code == 'ENOENT' || err == 12121212) {
				fs.writeFileSync('TestBathRejected.json', '{"rejected":0}') //NOTE: Change the object to what it usually is.
				TestBathReject = {
					rejected: 0
				}
			}
		}
	})();
var Capperct = null,
	Capperresults = null,
	CntInCapper = null,
	CntOutCapper = null,
	Capperactual = 0,
	Cappertime = 0,
	Cappersec = 0,
	CapperflagStopped = false,
	Capperstate = 0,
	Capperspeed = 0,
	CapperspeedTemp = 0,
	CapperflagPrint = 0,
	CappersecStop = 0,
	CapperdeltaRejected = null,
	CapperONS = false,
	CappertimeStop = 60, //NOTE: Timestop
	CapperWorktime = 0.98, //NOTE: Intervalo de tiempo en minutos para actualizar el log
	CapperflagRunning = false;
var Bundlerct = null,
	Bundlerresults = null,
	CntInBundler = null,
	CntOutBundler = null,
	Bundleractual = 0,
	Bundlertime = 0,
	Bundlersec = 0,
	BundlerflagStopped = false,
	Bundlerstate = 0,
	Bundlerspeed = 0,
	BundlerspeedTemp = 0,
	BundlerflagPrint = 0,
	BundlersecStop = 0,
	BundlerdeltaRejected = null,
	BundlerONS = false,
	BundlertimeStop = 60, //NOTE: Timestop
	BundlerWorktime = 0.98, //NOTE: Intervalo de tiempo en minutos para actualizar el log
	BundlerflagRunning = false;
var Dividerct = null,
	Dividerresults = null,
	CntInDivider = null,
	Divideractual = 0,
	Dividertime = 0,
	Dividersec = 0,
	DividerflagStopped = false,
	Dividerstate = 0,
	Dividerspeed = 0,
	DividerspeedTemp = 0,
	DividerflagPrint = 0,
	DividersecStop = 0,
	DividerdeltaRejected = null,
	DividerONS = false,
	DividertimeStop = 60, //NOTE: Timestop
	DividerWorktime = 0.98, //NOTE: Intervalo de tiempo en minutos para actualizar el log
	DividerflagRunning = false;
var CaseFormerct = null,
	CaseFormerresults = null,
	CntOutCaseFormer = null,
	CaseFormeractual = 0,
	CaseFormertime = 0,
	CaseFormersec = 0,
	CaseFormerflagStopped = false,
	CaseFormerstate = 0,
	CaseFormerspeed = 0,
	CaseFormerspeedTemp = 0,
	CaseFormerflagPrint = 0,
	CaseFormersecStop = 0,
	CaseFormerdeltaRejected = null,
	CaseFormerONS = false,
	CaseFormertimeStop = 60, //NOTE: Timestop
	CaseFormerWorktime = 0.98, //NOTE: Intervalo de tiempo en minutos para actualizar el log
	CaseFormerflagRunning = false;
var CasePackerct = null,
	CasePackerresults = null,
	CntOutCasePacker = null,
	CasePackeractual = 0,
	CasePackertime = 0,
	CasePackersec = 0,
	CasePackerflagStopped = false,
	CasePackerstate = 0,
	CasePackerspeed = 0,
	CasePackerspeedTemp = 0,
	CasePackerflagPrint = 0,
	CasePackersecStop = 0,
	CasePackerdeltaRejected = null,
	CasePackerONS = false,
	CasePackertimeStop = 60, //NOTE: Timestop
	CasePackerWorktime = 0.98, //NOTE: Intervalo de tiempo en minutos para actualizar el log
	CasePackerflagRunning = false;
var CaseSealerct = null,
    CaseSealerresults = null,
    CntInCaseSealer = null,
    CntOutCaseSealer = null,
    CaseSealeractual = 0,
    CaseSealertime = 0,
    CaseSealersec = 0,
    CaseSealerflagStopped = false,
    CaseSealerstate = 0,
    CaseSealerspeed = 0,
    CaseSealerspeedTemp = 0,
    CaseSealerflagPrint = 0,
    CaseSealersecStop = 0,
    CaseSealerdeltaRejected = null,
    CaseSealerONS = false,
    CaseSealertimeStop = 60, //NOTE: Timestop
    CaseSealerWorktime = 0.98, //NOTE: Intervalo de tiempo en minutos para actualizar el log
    CaseSealerflagRunning = false,
    CaseSealerRejectFlag = false;
/*var CheckWeigherct = null,
    CheckWeigherresults = null,
    CntInCheckWeigher = null,
    CntOutCheckWeigher = null,
    CheckWeigheractual = 0,
    CheckWeighertime = 0,
    CheckWeighersec = 0,
    CheckWeigherflagStopped = false,
    CheckWeigherstate = 0,
    CheckWeigherspeed = 0,
    CheckWeigherspeedTemp = 0,
    CheckWeigherflagPrint = 0,
    CheckWeighersecStop = 0,
    CheckWeigherONS = false,
    CheckWeighertimeStop = 60, //NOTE: Timestop en segundos
    CheckWeigherWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
    CheckWeigherflagRunning = false;*/

    var CheckWeigherct = null,
        CheckWeigherresults = null,
        CntInCheckWeigher = null,
        CntOutCheckWeigher = null,
        CheckWeigheractual = 0,
        CheckWeighertime = 0,
        CheckWeighersec = 0,
        CheckWeigherflagStopped = false,
        CheckWeigherstate = 0,
        CheckWeigherspeed = 0,
        CheckWeigherspeedTemp = 0,
        CheckWeigherflagPrint = 0,
        CheckWeighersecStop = 0,
        CheckWeigherdeltaRejected = null,
        CheckWeigherONS = false,
        CheckWeighertimeStop = 60, //NOTE: Timestop
        CheckWeigherWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
        CheckWeigherflagRunning = false,
        CheckWeigherRejectFlag = false,
        CheckWeigherReject,
        CheckWeigherVerify = (function(){
          try{
            CheckWeigherReject = fs.readFileSync('CheckWeigherRejected.json')
            if(CheckWeigherReject.toString().indexOf('}') > 0 && CheckWeigherReject.toString().indexOf('{\"rejected\":') != -1){
              CheckWeigherReject = JSON.parse(CheckWeigherReject)
            }else{
              throw 12121212
            }
          }catch(err){
            if(err.code == 'ENOENT' || err == 12121212){
              fs.writeFileSync('CheckWeigherRejected.json','{"rejected":0}') //NOTE: Change the object to what it usually is.
              CheckWeigherReject = {
                rejected : 0
              }
            }
          }
        })()
var cA1,
	cA2,
	cA3,
	cA4,
	cA5,
	cA6,
	cA7;
var client1 = modbus.client.tcp.complete({
	'host': "192.168.10.95",
	'port': 502,
	'autoReconnect': true,
	'timeout': 60000,
	'logEnabled': true,
	'reconnectTimeout': 30000
});
var client2 = modbus.client.tcp.complete({
	'host': "192.168.10.96",
	'port': 502,
	'autoReconnect': true,
	'timeout': 60000,
	'logEnabled': true,
	'reconnectTimeout': 30000
});
var client3 = modbus.client.tcp.complete({
	'host': "192.168.10.97",
	'port': 502,
	'autoReconnect': true,
	'timeout': 60000,
	'logEnabled': true,
	'reconnectTimeout': 30000
});
var client4 = modbus.client.tcp.complete({
	'host': "192.168.10.98",
	'port': 502,
	'autoReconnect': true,
	'timeout': 60000,
	'logEnabled': true,
	'reconnectTimeout': 30000
});
var client5 = modbus.client.tcp.complete({
	'host': "192.168.10.99",
	'port': 502,
	'autoReconnect': true,
	'timeout': 60000,
	'logEnabled': true,
	'reconnectTimeout': 30000
});
var client6 = modbus.client.tcp.complete({
	'host': "192.168.10.100",
	'port': 502,
	'autoReconnect': true,
	'timeout': 60000,
	'logEnabled': true,
	'reconnectTimeout': 30000
});
var client7 = modbus.client.tcp.complete({
	'host': "192.168.10.101",
	'port': 502,
	'autoReconnect': true,
	'timeout': 60000,
	'logEnabled': true,
	'reconnectTimeout': 30000
});
var secEOL = 0;
var secPubNub = 60 * 4 + 55;
var publishConfig;
var files = fs.readdirSync("C:/PULSE/AM_L2/L2_LOGS/"); //Leer documentos
var text2send = []; //Vector a enviar
var i = 0;
var fs = require('fs');


var pubnub = new PubNub({
	publishKey: "pub-c-8d024e5b-23bc-4ce8-ab68-b39b00347dfb",
	subscribeKey: "sub-c-c3b3aa54-b44b-11e7-895e-c6a8ff6a3d85",
	uuid: "aero2-0000-1234"
});

function idle() {
	i = 0;
	text2send = [];
	for (var k = 0; k < files.length; k++) { //Verificar los archivos
		var stats = fs.statSync("C:/PULSE/AM_L2/L2_LOGS/" + files[k]);
		var mtime = new Date(stats.mtime).getTime();
		if (mtime < (Date.now() - (8 * 60 * 1000)) && files[k].indexOf("SerialBox") == -1) {
			text2send[i] = files[k];
			i++;
		}
	}
}

function senderData() {
	pubnub.publish(publishConfig, function(status, response) {});
}

function joinWord(num1, num2) {
	var bits = "00000000000000000000000000000000";
	var bin1 = num1.toString(2),
		bin2 = num2.toString(2),
		newNum = bits.split("");

	for (i = 0; i < bin1.length; i++) {
		newNum[31 - i] = bin1[(bin1.length - 1) - i];
	}
	for (i = 0; i < bin2.length; i++) {
		newNum[15 - i] = bin2[(bin2.length - 1) - i];
	}
	bits = newNum.join("");
	return parseInt(bits, 2);
}

try {

	client1.connect();
	client2.connect();
	client3.connect();
	client4.connect();
	client5.connect();
	client6.connect();
	client7.connect();

	client1.on('connect', function(err) {

		cA1 = setInterval(function() {
			client1.readHoldingRegisters(0, 16).then(function(resp) {
				CntInCoder = joinWord(resp.register[0], resp.register[1]);
				CntOutCoder = joinWord(resp.register[2], resp.register[3]);
				CntOutTableSuplier = CntOutCoder;
				//------------------------------------------TableSuplier----------------------------------------------
				TableSuplierct = CntOutTableSuplier // NOTE: igualar al contador de salida
				if (!TableSuplierONS && TableSuplierct) {
					TableSuplierspeedTemp = TableSuplierct
					TableSupliersec = Date.now()
					TableSuplierONS = true
					TableSupliertime = Date.now()
				}
				if (TableSuplierct > TableSuplieractual) {
					if (TableSuplierflagStopped) {
						TableSuplierspeed = TableSuplierct - TableSuplierspeedTemp
						TableSuplierspeedTemp = TableSuplierct
						TableSupliersec = Date.now()
						TableSuplierdeltaRejected = null
						TableSuplierRejectFlag = false
						TableSupliertime = Date.now()
					}
					TableSupliersecStop = 0
					TableSuplierstate = 1
					TableSuplierflagStopped = false
					TableSuplierflagRunning = true
				} else if (TableSuplierct == TableSuplieractual) {
					if (TableSupliersecStop == 0) {
						TableSupliertime = Date.now()
						TableSupliersecStop = Date.now()
					}
					if ((Date.now() - (TableSupliertimeStop * 1000)) >= TableSupliersecStop) {
						TableSuplierspeed = 0
						TableSuplierstate = 2
						TableSuplierspeedTemp = TableSuplierct
						TableSuplierflagStopped = true
						TableSuplierflagRunning = false
						TableSuplierflagPrint = 1
					}
				}
				TableSuplieractual = TableSuplierct
				if (Date.now() - 60000 * TableSuplierWorktime >= TableSupliersec && TableSupliersecStop == 0) {
					if (TableSuplierflagRunning && TableSuplierct) {
						TableSuplierflagPrint = 1
						TableSupliersecStop = 0
						TableSuplierspeed = TableSuplierct - TableSuplierspeedTemp
						TableSuplierspeedTemp = TableSuplierct
						TableSupliersec = Date.now()
					}
				}
				TableSuplierresults = {
					ST: TableSuplierstate,
					CPQO: CntOutTableSuplier,
					SP: TableSuplierspeed
				}
				if (TableSuplierflagPrint == 1) {
					for (var key in TableSuplierresults) {
						if (TableSuplierresults[key] != null && !isNaN(TableSuplierresults[key]))
							//NOTE: Cambiar path
							fs.appendFileSync('C:/PULSE/AM_L2/L2_LOGS/mex_cue_TableSuplier_l2.log', 'tt=' + TableSupliertime + ',var=' + key + ',val=' + TableSuplierresults[key] + '\n')
					}
					TableSuplierflagPrint = 0
					TableSupliersecStop = 0
					TableSupliertime = Date.now()
				}
				//------------------------------------------TableSuplier----------------------------------------------
				//------------------------------------------Coder----------------------------------------------
				Coderct = CntOutCoder // NOTE: igualar al contador de salida
				if (!CoderONS && Coderct) {
					CoderspeedTemp = Coderct
					Codersec = Date.now()
					CoderONS = true
					Codertime = Date.now()
				}
				if (Coderct > Coderactual) {
					if (CoderflagStopped) {
						Coderspeed = Coderct - CoderspeedTemp
						CoderspeedTemp = Coderct
						Codersec = Date.now()
						CoderdeltaRejected = null
						CoderRejectFlag = false
						Codertime = Date.now()
					}
					CodersecStop = 0
					Coderstate = 1
					CoderflagStopped = false
					CoderflagRunning = true
				} else if (Coderct == Coderactual) {
					if (CodersecStop == 0) {
						Codertime = Date.now()
						CodersecStop = Date.now()
					}
					if ((Date.now() - (CodertimeStop * 1000)) >= CodersecStop) {
						Coderspeed = 0
						Coderstate = 2
						CoderspeedTemp = Coderct
						CoderflagStopped = true
						CoderflagRunning = false
						CoderflagPrint = 1
					}
				}
				Coderactual = Coderct
				if (Date.now() - 60000 * CoderWorktime >= Codersec && CodersecStop == 0) {
					if (CoderflagRunning && Coderct) {
						CoderflagPrint = 1
						CodersecStop = 0
						Coderspeed = Coderct - CoderspeedTemp
						CoderspeedTemp = Coderct
						Codersec = Date.now()
					}
				}
				Coderresults = {
					ST: Coderstate,
					CPQO: CntOutCoder,
					SP: Coderspeed
				}
				if (CoderflagPrint == 1) {
					for (var key in Coderresults) {
						if (Coderresults[key] != null && !isNaN(Coderresults[key]))
							//NOTE: Cambiar path
							fs.appendFileSync('C:/PULSE/AM_L2/L2_LOGS/mex_cue_Coder_l2.log', 'tt=' + Codertime + ',var=' + key + ',val=' + Coderresults[key] + '\n')
					}
					CoderflagPrint = 0
					CodersecStop = 0
					Codertime = Date.now()
				}
				//------------------------------------------Coder----------------------------------------------
			});
		}, 1000);
	});
	client1.on('error', function(err) {
		clearInterval(cA1);
	});
	client1.on('close', function() {
		clearInterval(cA1);
	});
	client2.on('connect', function(err) {

		cA2 = setInterval(function() {
			client2.readHoldingRegisters(0, 16).then(function(resp) {
				CntInMonoblock = joinWord(resp.register[0], resp.register[1]);
				CntOutMonoblock = joinWord(resp.register[2], resp.register[3]);
				MonoblockWait = joinWord(resp.register[4], resp.register[5]);
				CntInGasFiller = CntOutMonoblock;
				CntOutGasFiller = CntInXray;
			});
			//------------------------------------------Monoblock----------------------------------------------
			Monoblockct = CntOutMonoblock // NOTE: igualar al contador de salida
			if (!MonoblockONS && Monoblockct) {
				MonoblockspeedTemp = Monoblockct
				Monoblocksec = Date.now()
				MonoblockONS = true
				Monoblocktime = Date.now()
				if (MonoblockReject.rejected == null) {
					MonoblockReject.rejected = CntInMonoblock - CntOutMonoblock
					MonoblockReject.lastCPQI = CntInMonoblock
					MonoblockReject.lastCPQO = CntOutMonoblock
				fs.writeFileSync('MonoblockRejected.json', JSON.stringify(MonoblockReject))
				}
			}
			if (Monoblockct > Monoblockactual) {
				if (MonoblockflagStopped) {
					Monoblockspeed = Monoblockct - MonoblockspeedTemp
					MonoblockspeedTemp = Monoblockct
					Monoblocksec = Date.now()
					MonoblockdeltaRejected = null
					MonoblockRejectFlag = false
					Monoblocktime = Date.now()
				}
				MonoblocksecStop = 0
				Monoblockstate = 1
				MonoblockflagStopped = false
				MonoblockflagRunning = true
			} else if (Monoblockct == Monoblockactual) {
				if (MonoblocksecStop == 0) {
					Monoblocktime = Date.now()
					MonoblocksecStop = Date.now()
				}
				if ((Date.now() - (MonoblocktimeStop * 1000)) >= MonoblocksecStop) {
					Monoblockspeed = 0
					Monoblockstate = 2
					MonoblockspeedTemp = Monoblockct
					MonoblockflagStopped = true
					MonoblockflagRunning = false
					if (CntInMonoblock - CntOutMonoblock - MonoblockReject.rejected != 0 && !MonoblockRejectFlag) {
						if (MonoblockReject.lastCPQI == CntInMonoblock || MonoblockReject.lastCPQO == CntOutMonoblock) {
							MonoblockdeltaRejected = null
						} else {
							MonoblockdeltaRejected = CntInMonoblock - CntOutMonoblock - MonoblockReject.rejected
						}
            MonoblockReject.lastCPQI = CntInMonoblock
            MonoblockReject.lastCPQO = CntOutMonoblock
						MonoblockReject.rejected = CntInMonoblock - CntOutMonoblock
						fs.appendFileSync('test.log',JSON.stringify(MonoblockReject) + '\n')
						fs.writeFileSync('MonoblockRejected.json', JSON.stringify(MonoblockReject))
						MonoblockRejectFlag = true
					} else {
						MonoblockdeltaRejected = null
					}
					MonoblockflagPrint = 1
				}
			}
			Monoblockactual = Monoblockct
			if (Date.now() - 60000 * MonoblockWorktime >= Monoblocksec && MonoblocksecStop == 0) {
				if (MonoblockflagRunning && Monoblockct) {
					MonoblockflagPrint = 1
					MonoblocksecStop = 0
					Monoblockspeed = Monoblockct - MonoblockspeedTemp
					MonoblockspeedTemp = Monoblockct
					Monoblocksec = Date.now()
				}
			}
			Monoblockresults = {
				ST: Monoblockstate,
				CPQI: CntInMonoblock,
				CPQO: CntOutMonoblock,
				CPQR: MonoblockdeltaRejected,
				SP: Monoblockspeed
			}
			if (MonoblockflagPrint == 1) {
				for (var key in Monoblockresults) {
					if (Monoblockresults[key] != null && !isNaN(Monoblockresults[key]))
						//NOTE: Cambiar path
						fs.appendFileSync('C:/PULSE/AM_L2/L2_LOGS/mex_cue_Monoblock_l2.log', 'tt=' + Monoblocktime + ',var=' + key + ',val=' + Monoblockresults[key] + '\n')
				}
				MonoblockflagPrint = 0
				MonoblocksecStop = 0
				Monoblocktime = Date.now()
			}
			//------------------------------------------Monoblock----------------------------------------------
			//------------------------------------------GasFiller----------------------------------------------
			GasFillerct = CntOutGasFiller // NOTE: igualar al contador de salida
			if (!GasFillerONS && GasFillerct) {
				GasFillerspeedTemp = GasFillerct
				GasFillersec = Date.now()
				GasFillerONS = true
				GasFillertime = Date.now()
			}
			if (GasFillerct > GasFilleractual) {
				if (GasFillerflagStopped) {
					GasFillerspeed = GasFillerct - GasFillerspeedTemp
					GasFillerspeedTemp = GasFillerct
					GasFillersec = Date.now()
					GasFillerdeltaRejected = null
					GasFillerRejectFlag = false
					GasFillertime = Date.now()
				}
				GasFillersecStop = 0
				GasFillerstate = 1
				GasFillerflagStopped = false
				GasFillerflagRunning = true
			} else if (GasFillerct == GasFilleractual) {
				if (GasFillersecStop == 0) {
					GasFillertime = Date.now()
					GasFillersecStop = Date.now()
				}
				if ((Date.now() - (GasFillertimeStop * 1000)) >= GasFillersecStop) {
					GasFillerspeed = 0
					GasFillerstate = 2
					GasFillerspeedTemp = GasFillerct
					GasFillerflagStopped = true
					GasFillerflagRunning = false
					if (CntInGasFiller - CntOutGasFiller - GasFillerReject.rejected != 0 && !GasFillerRejectFlag) {
						GasFillerdeltaRejected = CntInGasFiller - CntOutGasFiller - GasFillerReject.rejected
						GasFillerReject.rejected = CntInGasFiller - CntOutGasFiller
						fs.writeFileSync('GasFillerRejected.json', '{"rejected": ' + GasFillerReject.rejected + '}')
						GasFillerRejectFlag = true
					} else {
						GasFillerdeltaRejected = null
					}
					GasFillerflagPrint = 1
				}
			}
			GasFilleractual = GasFillerct
			if (Date.now() - 60000 * GasFillerWorktime >= GasFillersec && GasFillersecStop == 0) {
				if (GasFillerflagRunning && GasFillerct) {
					GasFillerflagPrint = 1
					GasFillersecStop = 0
					GasFillerspeed = GasFillerct - GasFillerspeedTemp
					GasFillerspeedTemp = GasFillerct
					GasFillersec = Date.now()
				}
			}
			GasFillerresults = {
				ST: GasFillerstate,
				CPQI: CntInGasFiller,
				CPQO: CntOutGasFiller,
				CPQR: GasFillerdeltaRejected,
				SP: GasFillerspeed
			}
			if (GasFillerflagPrint == 1) {
				for (var key in GasFillerresults) {
					if (GasFillerresults[key] != null && !isNaN(GasFillerresults[key]))
						//NOTE: Cambiar path
						fs.appendFileSync('C:/PULSE/AM_L2/L2_LOGS/mex_cue_GasFiller_l2.log', 'tt=' + GasFillertime + ',var=' + key + ',val=' + GasFillerresults[key] + '\n')
				}
				GasFillerflagPrint = 0
				GasFillersecStop = 0
				GasFillertime = Date.now()
			}
			//------------------------------------------GasFiller----------------------------------------------
		}, 1000);

	});
	client2.on('error', function(err) {
		clearInterval(cA2);
	});
	client2.on('close', function() {
		clearInterval(cA2);
	});
	client3.on('connect', function(err) {

		cA3 = setInterval(function() {
			client3.readHoldingRegisters(0, 16).then(function(resp) {
				CntOutGasFiller = joinWord(resp.register[0], resp.register[1]);
				CntInXray = CntOutGasFiller;
				CntOutXray = joinWord(resp.register[2], resp.register[3]);
				CntInTestBath = joinWord(resp.register[4], resp.register[5]);
				CntOutTestBath = joinWord(resp.register[6], resp.register[7]);
			});
			//------------------------------------------Xray----------------------------------------------
			Xrayct = CntOutXray // NOTE: igualar al contador de salida
			if (!XrayONS && Xrayct) {
				XrayspeedTemp = Xrayct
				Xraysec = Date.now()
				XrayONS = true
				Xraytime = Date.now()
			}
			if (Xrayct > Xrayactual) {
				if (XrayflagStopped) {
					Xrayspeed = Xrayct - XrayspeedTemp
					XrayspeedTemp = Xrayct
					Xraysec = Date.now()
					XraydeltaRejected = null
					XrayRejectFlag = false
					Xraytime = Date.now()
				}
				XraysecStop = 0
				Xraystate = 1
				XrayflagStopped = false
				XrayflagRunning = true
			} else if (Xrayct == Xrayactual) {
				if (XraysecStop == 0) {
					Xraytime = Date.now()
					XraysecStop = Date.now()
				}
				if ((Date.now() - (XraytimeStop * 1000)) >= XraysecStop) {
					Xrayspeed = 0
					Xraystate = 2
					XrayspeedTemp = Xrayct
					XrayflagStopped = true
					XrayflagRunning = false
					if (CntInXray - CntOutXray - XrayReject.rejected != 0 && !XrayRejectFlag) {
						XraydeltaRejected = CntInXray - CntOutXray - XrayReject.rejected
						XrayReject.rejected = CntInXray - CntOutXray
						fs.writeFileSync('XrayRejected.json', '{"rejected": ' + XrayReject.rejected + '}')
						XrayRejectFlag = true
					} else {
						XraydeltaRejected = null
					}
					XrayflagPrint = 1
				}
			}
			Xrayactual = Xrayct
			if (Date.now() - 60000 * XrayWorktime >= Xraysec && XraysecStop == 0) {
				if (XrayflagRunning && Xrayct) {
					XrayflagPrint = 1
					XraysecStop = 0
					Xrayspeed = Xrayct - XrayspeedTemp
					XrayspeedTemp = Xrayct
					Xraysec = Date.now()
				}
			}
			Xrayresults = {
				ST: Xraystate,
				CPQI: CntInXray,
				CPQO: CntOutXray,
				CPQR: XraydeltaRejected,
				SP: Xrayspeed
			}
			if (XrayflagPrint == 1) {
				for (var key in Xrayresults) {
					if (Xrayresults[key] != null && !isNaN(Xrayresults[key]))
						//NOTE: Cambiar path
						fs.appendFileSync('C:/PULSE/AM_L2/L2_LOGS/mex_cue_Xray_l2.log', 'tt=' + Xraytime + ',var=' + key + ',val=' + Xrayresults[key] + '\n')
				}
				XrayflagPrint = 0
				XraysecStop = 0
				Xraytime = Date.now()
			}
			//------------------------------------------Xray----------------------------------------------
			//------------------------------------------TestBath----------------------------------------------
			TestBathct = CntOutTestBath // NOTE: igualar al contador de salida
			if (!TestBathONS && TestBathct) {
				TestBathspeedTemp = TestBathct
				TestBathsec = Date.now()
				TestBathONS = true
				TestBathtime = Date.now()
			}
			if (TestBathct > TestBathactual) {
				if (TestBathflagStopped) {
					TestBathspeed = TestBathct - TestBathspeedTemp
					TestBathspeedTemp = TestBathct
					TestBathsec = Date.now()
					TestBathdeltaRejected = null
					TestBathRejectFlag = false
					TestBathtime = Date.now()
				}
				TestBathsecStop = 0
				TestBathstate = 1
				TestBathflagStopped = false
				TestBathflagRunning = true
			} else if (TestBathct == TestBathactual) {
				if (TestBathsecStop == 0) {
					TestBathtime = Date.now()
					TestBathsecStop = Date.now()
				}
				if ((Date.now() - (TestBathtimeStop * 1000)) >= TestBathsecStop) {
					TestBathspeed = 0
					TestBathstate = 2
					TestBathspeedTemp = TestBathct
					TestBathflagStopped = true
					TestBathflagRunning = false
					if (CntInTestBath - CntOutTestBath - TestBathReject.rejected != 0 && !TestBathRejectFlag) {
						TestBathdeltaRejected = CntInTestBath - CntOutTestBath - TestBathReject.rejected
						TestBathReject.rejected = CntInTestBath - CntOutTestBath
						fs.writeFileSync('TestBathRejected.json', '{"rejected": ' + TestBathReject.rejected + '}')
						TestBathRejectFlag = true
					} else {
						TestBathdeltaRejected = null
					}
					TestBathflagPrint = 1
				}
			}
			TestBathactual = TestBathct
			if (Date.now() - 60000 * TestBathWorktime >= TestBathsec && TestBathsecStop == 0) {
				if (TestBathflagRunning && TestBathct) {
					TestBathflagPrint = 1
					TestBathsecStop = 0
					TestBathspeed = TestBathct - TestBathspeedTemp
					TestBathspeedTemp = TestBathct
					TestBathsec = Date.now()
				}
			}
			TestBathresults = {
				ST: TestBathstate,
				CPQI: CntInTestBath,
				CPQO: CntOutTestBath,
				CPQR: TestBathdeltaRejected,
				SP: TestBathspeed
			}
			if (TestBathflagPrint == 1) {
				for (var key in TestBathresults) {
					if (TestBathresults[key] != null && !isNaN(TestBathresults[key]))
						//NOTE: Cambiar path
						fs.appendFileSync('C:/PULSE/AM_L2/L2_LOGS/mex_cue_TestBath_l2.log', 'tt=' + TestBathtime + ',var=' + key + ',val=' + TestBathresults[key] + '\n')
				}
				TestBathflagPrint = 0
				TestBathsecStop = 0
				TestBathtime = Date.now()
			}
			//------------------------------------------TestBath----------------------------------------------
		}, 1000);
	});
	client3.on('error', function(err) {
		clearInterval(cA3);
	});
	client3.on('close', function() {
		clearInterval(cA3);
	});
	client4.on('connect', function(err) {

		cA4 = setInterval(function() {
			client4.readHoldingRegisters(0, 16).then(function(resp) {
				CntInCapper = joinWord(resp.register[0], resp.register[1]);
				CntRejCapper = joinWord(resp.register[2], resp.register[3]);
				CntOutCapper = joinWord(resp.register[4], resp.register[5]);
				WaitCapper = joinWord(resp.register[6], resp.register[7]);
			});
			//------------------------------------------Capper----------------------------------------------
			Capperct = CntOutCapper // NOTE: igualar al contador de salida
			if (!CapperONS && Capperct) {
				CapperspeedTemp = Capperct
				Cappersec = Date.now()
				CapperONS = true
				Cappertime = Date.now()
			}
			if (Capperct > Capperactual) {
				if (CapperflagStopped) {
					Capperspeed = Capperct - CapperspeedTemp
					CapperspeedTemp = Capperct
					Cappersec = Date.now()
					CapperdeltaRejected = null
					CapperRejectFlag = false
					Cappertime = Date.now()
				}
				CappersecStop = 0
				Capperstate = 1
				CapperflagStopped = false
				CapperflagRunning = true
			} else if (Capperct == Capperactual) {
				if (CappersecStop == 0) {
					Cappertime = Date.now()
					CappersecStop = Date.now()
				}
				if ((Date.now() - (CappertimeStop * 1000)) >= CappersecStop) {
					Capperspeed = 0
					Capperstate = 2
					CapperspeedTemp = Capperct
					CapperflagStopped = true
					CapperflagRunning = false
					CapperflagPrint = 1
				}
			}
			Capperactual = Capperct
			if (Date.now() - 60000 * CapperWorktime >= Cappersec && CappersecStop == 0) {
				if (CapperflagRunning && Capperct) {
					CapperflagPrint = 1
					CappersecStop = 0
					Capperspeed = Capperct - CapperspeedTemp
					CapperspeedTemp = Capperct
					Cappersec = Date.now()
				}
			}
			Capperresults = {
				ST: Capperstate,
				CPQI: CntInCapper,
				CPQO: CntOutCapper,
				CPQR: CntRejCapper,
				SP: Capperspeed
			}
			if (CapperflagPrint == 1) {
				for (var key in Capperresults) {
					if (Capperresults[key] != null && !isNaN(Capperresults[key]))
						//NOTE: Cambiar path
						fs.appendFileSync('C:/PULSE/AM_L2/L2_LOGS/mex_cue_Capper_l2.log', 'tt=' + Cappertime + ',var=' + key + ',val=' + Capperresults[key] + '\n')
				}
				CapperflagPrint = 0
				CappersecStop = 0
				Cappertime = Date.now()
			}
			//------------------------------------------Capper----------------------------------------------
		}, 1000);

	});
	client4.on('error', function(err) {
		clearInterval(cA4);
	});
	client4.on('close', function() {
		clearInterval(cA4);
	});
	client5.on('connect', function(err) {

		cA5 = setInterval(function() {
			client5.readHoldingRegisters(0, 16).then(function(resp) {
				CntOutCaseFormer = joinWord(resp.register[0], resp.register[1]);
				CntInCasePacker = joinWord(resp.register[2], resp.register[3]);
				CntInDivider = joinWord(resp.register[4], resp.register[5]);
				CntOutCasePacker = joinWord(resp.register[6], resp.register[7]);
			});
			//------------------------------------------Divider----------------------------------------------
			Dividerct = CntInDivider // NOTE: igualar al contador de salida
			if (!DividerONS && Dividerct) {
				DividerspeedTemp = Dividerct
				Dividersec = Date.now()
				DividerONS = true
				Dividertime = Date.now()
			}
			if (Dividerct > Divideractual) {
				if (DividerflagStopped) {
					Dividerspeed = Dividerct - DividerspeedTemp
					DividerspeedTemp = Dividerct
					Dividersec = Date.now()
					DividerdeltaRejected = null
					DividerRejectFlag = false
					Dividertime = Date.now()
				}
				DividersecStop = 0
				Dividerstate = 1
				DividerflagStopped = false
				DividerflagRunning = true
			} else if (Dividerct == Divideractual) {
				if (DividersecStop == 0) {
					Dividertime = Date.now()
					DividersecStop = Date.now()
				}
				if ((Date.now() - (DividertimeStop * 1000)) >= DividersecStop) {
					Dividerspeed = 0
					Dividerstate = 2
					DividerspeedTemp = Dividerct
					DividerflagStopped = true
					DividerflagRunning = false
					DividerflagPrint = 1
				}
			}
			Divideractual = Dividerct
			if (Date.now() - 60000 * DividerWorktime >= Dividersec && DividersecStop == 0) {
				if (DividerflagRunning && Dividerct) {
					DividerflagPrint = 1
					DividersecStop = 0
					Dividerspeed = Dividerct - DividerspeedTemp
					DividerspeedTemp = Dividerct
					Dividersec = Date.now()
				}
			}
			Dividerresults = {
				ST: Dividerstate,
				CPQI: CntInDivider,
				SP: Dividerspeed
			}
			if (DividerflagPrint == 1) {
				for (var key in Dividerresults) {
					if (Dividerresults[key] != null && !isNaN(Dividerresults[key]))
						//NOTE: Cambiar path
						fs.appendFileSync('C:/PULSE/AM_L2/L2_LOGS/mex_cue_Divider_l2.log', 'tt=' + Dividertime + ',var=' + key + ',val=' + Dividerresults[key] + '\n')
				}
				DividerflagPrint = 0
				DividersecStop = 0
				Dividertime = Date.now()
			}
			//------------------------------------------Divider----------------------------------------------
			//------------------------------------------CaseFormer----------------------------------------------
			CaseFormerct = CntOutCaseFormer // NOTE: igualar al contador de salida
			if (!CaseFormerONS && CaseFormerct) {
				CaseFormerspeedTemp = CaseFormerct
				CaseFormersec = Date.now()
				CaseFormerONS = true
				CaseFormertime = Date.now()
			}
			if (CaseFormerct > CaseFormeractual) {
				if (CaseFormerflagStopped) {
					CaseFormerspeed = CaseFormerct - CaseFormerspeedTemp
					CaseFormerspeedTemp = CaseFormerct
					CaseFormersec = Date.now()
					CaseFormerdeltaRejected = null
					CaseFormerRejectFlag = false
					CaseFormertime = Date.now()
				}
				CaseFormersecStop = 0
				CaseFormerstate = 1
				CaseFormerflagStopped = false
				CaseFormerflagRunning = true
			} else if (CaseFormerct == CaseFormeractual) {
				if (CaseFormersecStop == 0) {
					CaseFormertime = Date.now()
					CaseFormersecStop = Date.now()
				}
				if ((Date.now() - (CaseFormertimeStop * 1000)) >= CaseFormersecStop) {
					CaseFormerspeed = 0
					CaseFormerstate = 2
					CaseFormerspeedTemp = CaseFormerct
					CaseFormerflagStopped = true
					CaseFormerflagRunning = false
					CaseFormerflagPrint = 1
				}
			}
			CaseFormeractual = CaseFormerct
			if (Date.now() - 60000 * CaseFormerWorktime >= CaseFormersec && CaseFormersecStop == 0) {
				if (CaseFormerflagRunning && CaseFormerct) {
					CaseFormerflagPrint = 1
					CaseFormersecStop = 0
					CaseFormerspeed = CaseFormerct - CaseFormerspeedTemp
					CaseFormerspeedTemp = CaseFormerct
					CaseFormersec = Date.now()
				}
			}
			CaseFormerresults = {
				ST: CaseFormerstate,
				CPQO: CntOutCaseFormer,
				SP: CaseFormerspeed
			}
			if (CaseFormerflagPrint == 1) {
				for (var key in CaseFormerresults) {
					if (CaseFormerresults[key] != null && !isNaN(CaseFormerresults[key]))
						//NOTE: Cambiar path
						fs.appendFileSync('C:/PULSE/AM_L2/L2_LOGS/mex_cue_CaseFormer_l2.log', 'tt=' + CaseFormertime + ',var=' + key + ',val=' + CaseFormerresults[key] + '\n')
				}
				CaseFormerflagPrint = 0
				CaseFormersecStop = 0
				CaseFormertime = Date.now()
			}
			//------------------------------------------CaseFormer----------------------------------------------
			//------------------------------------------CasePacker----------------------------------------------
			CasePackerct = CntOutCasePacker // NOTE: igualar al contador de salida
			if (!CasePackerONS && CasePackerct) {
				CasePackerspeedTemp = CasePackerct
				CasePackersec = Date.now()
				CasePackerONS = true
				CasePackertime = Date.now()
			}
			if (CasePackerct > CasePackeractual) {
				if (CasePackerflagStopped) {
					CasePackerspeed = CasePackerct - CasePackerspeedTemp
					CasePackerspeedTemp = CasePackerct
					CasePackersec = Date.now()
					CasePackerdeltaRejected = null
					CasePackerRejectFlag = false
					CasePackertime = Date.now()
				}
				CasePackersecStop = 0
				CasePackerstate = 1
				CasePackerflagStopped = false
				CasePackerflagRunning = true
			} else if (CasePackerct == CasePackeractual) {
				if (CasePackersecStop == 0) {
					CasePackertime = Date.now()
					CasePackersecStop = Date.now()
				}
				if ((Date.now() - (CasePackertimeStop * 1000)) >= CasePackersecStop) {
					CasePackerspeed = 0
					CasePackerstate = 2
					CasePackerspeedTemp = CasePackerct
					CasePackerflagStopped = true
					CasePackerflagRunning = false
					CasePackerflagPrint = 1
				}
			}
			CasePackeractual = CasePackerct
			if (Date.now() - 60000 * CasePackerWorktime >= CasePackersec && CasePackersecStop == 0) {
				if (CasePackerflagRunning && CasePackerct) {
					CasePackerflagPrint = 1
					CasePackersecStop = 0
					CasePackerspeed = CasePackerct - CasePackerspeedTemp
					CasePackerspeedTemp = CasePackerct
					CasePackersec = Date.now()
				}
			}
			CasePackerresults = {
				ST: CasePackerstate,
				CPQO: CntOutCasePacker,
				SP: CasePackerspeed
			}
			if (CasePackerflagPrint == 1) {
				for (var key in CasePackerresults) {
					if (CasePackerresults[key] != null && !isNaN(CasePackerresults[key]))
						//NOTE: Cambiar path
						fs.appendFileSync('C:/PULSE/AM_L2/L2_LOGS/mex_cue_CasePacker_l2.log', 'tt=' + CasePackertime + ',var=' + key + ',val=' + CasePackerresults[key] + '\n')
				}
				CasePackerflagPrint = 0
				CasePackersecStop = 0
				CasePackertime = Date.now()
			}
			//------------------------------------------CasePacker----------------------------------------------
		}, 1000);
	});
	client5.on('error', function(err) {
		clearInterval(cA5);
	});
	client5.on('close', function() {
		clearInterval(cA5);
	});
	client6.on('connect', function(err) {

		cA6 = setInterval(function() {
			client6.readHoldingRegisters(0, 16).then(function(resp) {
				CntInBundler = (joinWord(resp.register[0], resp.register[1]) + joinWord(resp.register[2], resp.register[3])) * 6;
				CntOutBundler = joinWord(resp.register[4], resp.register[5]) + joinWord(resp.register[6], resp.register[7]) + joinWord(resp.register[8], resp.register[9]) + joinWord(resp.register[10], resp.register[11]);
			});
			//------------------------------------------Bundler----------------------------------------------
			Bundlerct = CntOutBundler // NOTE: igualar al contador de salida
			if (!BundlerONS && Bundlerct) {
				BundlerspeedTemp = Bundlerct
				Bundlersec = Date.now()
				BundlerONS = true
				Bundlertime = Date.now()
			}
			if (Bundlerct > Bundleractual) {
				if (BundlerflagStopped) {
					Bundlerspeed = Bundlerct - BundlerspeedTemp
					BundlerspeedTemp = Bundlerct
					Bundlersec = Date.now()
					BundlerdeltaRejected = null
					BundlerRejectFlag = false
					Bundlertime = Date.now()
				}
				BundlersecStop = 0
				Bundlerstate = 1
				BundlerflagStopped = false
				BundlerflagRunning = true
			} else if (Bundlerct == Bundleractual) {
				if (BundlersecStop == 0) {
					Bundlertime = Date.now()
					BundlersecStop = Date.now()
				}
				if ((Date.now() - (BundlertimeStop * 1000)) >= BundlersecStop) {
					Bundlerspeed = 0
					Bundlerstate = 2
					BundlerspeedTemp = Bundlerct
					BundlerflagStopped = true
					BundlerflagRunning = false
					BundlerflagPrint = 1
				}
			}
			Bundleractual = Bundlerct
			if (Date.now() - 60000 * BundlerWorktime >= Bundlersec && BundlersecStop == 0) {
				if (BundlerflagRunning && Bundlerct) {
					BundlerflagPrint = 1
					BundlersecStop = 0
					Bundlerspeed = Bundlerct - BundlerspeedTemp
					BundlerspeedTemp = Bundlerct
					Bundlersec = Date.now()
				}
			}
			Bundlerresults = {
				ST: Bundlerstate,
				CPQI: CntInBundler,
				CPQO: CntOutBundler,
				SP: Bundlerspeed
			}
			if (BundlerflagPrint == 1) {
				for (var key in Bundlerresults) {
					if (Bundlerresults[key] != null && !isNaN(Bundlerresults[key]))
						//NOTE: Cambiar path
						fs.appendFileSync('C:/PULSE/AM_L2/L2_LOGS/mex_cue_Bundler_l2.log', 'tt=' + Bundlertime + ',var=' + key + ',val=' + Bundlerresults[key] + '\n')
				}
				BundlerflagPrint = 0
				BundlersecStop = 0
				Bundlertime = Date.now()
			}
			//------------------------------------------Bundler----------------------------------------------
		}, 1000);
	});
	client6.on('error', function(err) {
		clearInterval(cA6);
	});
	client6.on('close', function() {
		clearInterval(cA6);
	});
	client7.on('connect', function(err) {

		cA7 = setInterval(function() {
			client7.readHoldingRegisters(0, 16).then(function(resp) {
				eol = joinWord(resp.register[0], resp.register[1]);
				//CntOutCaseSealer = joinWord(resp.register[2], resp.register[3]);
				//CntInCaseSealer = joinWord(resp.register[6], resp.register[7]);
				CntInCaseSealer = CntOutCasePacker;
				CntOutCheckWeigher = joinWord(resp.register[2], resp.register[3]);
			});
			//------------------------------------------CaseSealer----------------------------------------------
			CaseSealerct = CntInCaseSealer // NOTE: igualar al contador de salida
			if (!CaseSealerONS && CaseSealerct) {
				CaseSealerspeedTemp = CaseSealerct
				CaseSealersec = Date.now()
				CaseSealerONS = true
				CaseSealertime = Date.now()
			}
			if (CaseSealerct > CaseSealeractual) {
				if (CaseSealerflagStopped) {
					CaseSealerspeed = CaseSealerct - CaseSealerspeedTemp
					CaseSealerspeedTemp = CaseSealerct
					CaseSealersec = Date.now()
					CaseSealerdeltaRejected = null
					CaseSealerRejectFlag = false
					CaseSealertime = Date.now()
				}
				CaseSealersecStop = 0
				CaseSealerstate = 1
				CaseSealerflagStopped = false
				CaseSealerflagRunning = true
			} else if (CaseSealerct == CaseSealeractual) {
				if (CaseSealersecStop == 0) {
					CaseSealertime = Date.now()
					CaseSealersecStop = Date.now()
				}
				if ((Date.now() - (CaseSealertimeStop * 1000)) >= CaseSealersecStop) {
					CaseSealerspeed = 0
					CaseSealerstate = 2
					CaseSealerspeedTemp = CaseSealerct
					CaseSealerflagStopped = true
					CaseSealerflagRunning = false
					CaseSealerflagPrint = 1
				}
			}
			CaseSealeractual = CaseSealerct
			if (Date.now() - 60000 * CaseSealerWorktime >= CaseSealersec && CaseSealersecStop == 0) {
				if (CaseSealerflagRunning && CaseSealerct) {
					CaseSealerflagPrint = 1
					CaseSealersecStop = 0
					CaseSealerspeed = CaseSealerct - CaseSealerspeedTemp
					CaseSealerspeedTemp = CaseSealerct
					CaseSealersec = Date.now()
				}
			}
			CaseSealerresults = {
				ST: CaseSealerstate,
				CPQI: CntInCaseSealer,
				SP: CaseSealerspeed
			}
			if (CaseSealerflagPrint == 1) {
				for (var key in CaseSealerresults) {
					if (CaseSealerresults[key] != null && !isNaN(CaseSealerresults[key]))
						//NOTE: Cambiar path
						fs.appendFileSync('C:/PULSE/AM_L2/L2_LOGS/mex_cue_CaseSealer_l2.log', 'tt=' + CaseSealertime + ',var=' + key + ',val=' + CaseSealerresults[key] + '\n')
				}
				CaseSealerflagPrint = 0
				CaseSealersecStop = 0
				CaseSealertime = Date.now()
			}
			//------------------------------------------CaseSealer----------------------------------------------
	        //------------------------------------------CheckWeigher----------------------------------------------
	              CheckWeigherct = CntOutCheckWeigher // NOTE: igualar al contador de salida
	              if (!CheckWeigherONS && CheckWeigherct) {
	                CheckWeigherspeedTemp = CheckWeigherct
	                CheckWeighersec = Date.now()
	                CheckWeigherONS = true
	                CheckWeighertime = Date.now()
	              }
	              if(CheckWeigherct > CheckWeigheractual){
	                if(CheckWeigherflagStopped){
	                  CheckWeigherspeed = CheckWeigherct - CheckWeigherspeedTemp
	                  CheckWeigherspeedTemp = CheckWeigherct
	                  CheckWeighersec = Date.now()
	                  CheckWeigherdeltaRejected = null
	                  CheckWeigherRejectFlag = false
	                  CheckWeighertime = Date.now()
	                }
	                CheckWeighersecStop = 0
	                CheckWeigherstate = 1
	                CheckWeigherflagStopped = false
	                CheckWeigherflagRunning = true
	              } else if( CheckWeigherct == CheckWeigheractual ){
	                if(CheckWeighersecStop == 0){
	                  CheckWeighertime = Date.now()
	                  CheckWeighersecStop = Date.now()
	                }
	                if( ( Date.now() - ( CheckWeighertimeStop * 1000 ) ) >= CheckWeighersecStop ){
	                  CheckWeigherspeed = 0
	                  CheckWeigherstate = 2
	                  CheckWeigherspeedTemp = CheckWeigherct
	                  CheckWeigherflagStopped = true
	                  CheckWeigherflagRunning = false
	                  if(CntInCaseSealer - CntOutCheckWeigher - CheckWeigherReject.rejected != 0 && ! CheckWeigherRejectFlag){
	                    CheckWeigherdeltaRejected = CntInCaseSealer - CntOutCheckWeigher - CheckWeigherReject.rejected
	                    CheckWeigherReject.rejected = CntInCaseSealer - CntOutCheckWeigher
	                    fs.writeFileSync('CheckWeigherRejected.json','{"rejected": ' + CheckWeigherReject.rejected + '}')
	                    CheckWeigherRejectFlag = true
	                  }else{
	                    CheckWeigherdeltaRejected = null
	                  }
	                  CheckWeigherflagPrint = 1
	                }
	              }
	              CheckWeigheractual = CheckWeigherct
	              if(Date.now() - 60000 * CheckWeigherWorktime >= CheckWeighersec && CheckWeighersecStop == 0){
	                if(CheckWeigherflagRunning && CheckWeigherct){
	                  CheckWeigherflagPrint = 1
	                  CheckWeighersecStop = 0
	                  CheckWeigherspeed = CheckWeigherct - CheckWeigherspeedTemp
	                  CheckWeigherspeedTemp = CheckWeigherct
	                  CheckWeighersec = Date.now()
	                }
	              }
	              CheckWeigherresults = {
	                ST: CheckWeigherstate,
	                CPQO : CntOutCheckWeigher,
	                CPQR : CheckWeigherdeltaRejected,
	                SP: CheckWeigherspeed
	              }
	              if (CheckWeigherflagPrint == 1) {
	                for (var key in CheckWeigherresults) {
	                  if( CheckWeigherresults[key] != null && ! isNaN(CheckWeigherresults[key]) )
	                  //NOTE: Cambiar path
	                  fs.appendFileSync('C:/PULSE/AM_L2/L2_LOGS/mex_cue_CheckWeigher_l2.log', 'tt=' + CheckWeighertime + ',var=' + key + ',val=' + CheckWeigherresults[key] + '\n')
	                }
	                CheckWeigherflagPrint = 0
	                CheckWeighersecStop = 0
	                CheckWeighertime = Date.now()
	              }
	        //------------------------------------------CheckWeigher----------------------------------------------
			//------------------------------------------EOL----------------------------------------------
			if (secEOL >= 60 && eol != null) {
				fs.appendFileSync("C:/PULSE/AM_L2/L2_LOGS/mex_cue_EOL_l2.log", "tt=" + Date.now() + ",var=EOL" + ",val=" + eol + "\n");
				secEOL = 0;
			} else {
				secEOL++;
			}
			//------------------------------------------EOL----------------------------------------------
		}, 1000);
	});
client7.on('error', function(err) {
  clearInterval(cA7);
});
client7.on('close', function() {
	clearInterval(cA7);
});


	var noty = setInterval(function() {
		if (secPubNub >= 60 * 5) {
			idle();
			secPubNub = 0;
			publishConfig = {
				channel: "Cue_Aero_Monitor",
				message: {
					line: "Aero2",
					tt: Date.now(),
					machines: text2send
				}
			};
			senderData();
		} else {
			secPubNub++;
		}
	}, 1000);
} catch (err) {
	fs.appendFileSync("error.log", err + '\n');
	clearInterval(noty);
}

//------------------------------Cerrar-código------------------------------
var shutdown = function() {
	client1.close()
	client2.close()
	client3.close()
	client4.close()
	client5.close()
	client6.close()
	client7.close()
	process.exit(0)
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)
//------------------------------Cerrar-código------------------------------

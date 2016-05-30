// most basic dependencies
var express = require('express')
  , http = require('http')
  , os = require('os')
  , path = require('path');
 
// create the app
var app = express();
var data = [
  {
		"uuid": "d29a624ea1314c09bb254c008e55141e",
		"hakuOid": "haku-oid624ea9314c09bb254c008e55141e",
		"luotu": 14640728426803,
		"tila": "MENEILLAAN",
		"userOID": "MV",
		"runtime": "8h 15min",
		"hakukohteitaYhteensa": 3,
		"hakukohteitaValmiina": 0,
		"hakukohteitaKeskeytetty": 0,
		"jonosija": 0,
		"haunnimi": "Kolmas ja seuraava haku ammatilliseen opettajankoulutukseen",
		"nimi": "Varsinainen valinta",
	    "tyyppi":"HAKU",
	    "valinnanvaihe": 1,
	    "valintakoelaskenta":"true"
	},
	{
		"uuid": "baba624ea9314c09bb254c008e55141e",
		"hakuOid": "haku-oid524ea9314c09bb254c008e55141e",
		"luotu": 1464096772906,
		"tila": "MENEILLAAN",
		"userOID": "MV",
		"runtime": "8h 15min",
		"hakukohteitaYhteensa": 7,
		"hakukohteitaValmiina": 4,
		"hakukohteitaKeskeytetty": 0,
		"jonosija": 0,
		"haunnimi": "Haku ammatilliseen opettajankoulutukseen",
		"nimi": "Varsinainen valinta",
		"tyyppi":"HAKUKOHDE",
		"valinnanvaihe": 5,
		"valintakoelaskenta":"false"
	},
	{
		"uuid": "d2aa624ea9314c09bb254c008e55141e",
		"hakuOid": "haku-oid624ea9314c09bb254c008e55141e",
		"luotu": 1464180042680,
		"tila": "MENEILLAAN",
		"userOID": "MV",
		"runtime": "8h 15min",
		"hakukohteitaYhteensa": 3,
		"hakukohteitaValmiina": 3,
		"hakukohteitaKeskeytetty": 0,
		"jonosija": null,
		"haunnimi": "Seuraava haku ammatilliseen opettajankoulutukseen",
		"nimi": "Varsinainen valinta",
		"tyyppi":"VALINTARYHMA",
		"valinnanvaihe": 3,
		"valintakoelaskenta":"false"
	},
	{
		"uuid": "daaa624ea9314c09bb254c008e55141e",
		"hakuOid": "haku-oid624ea9314c09bb254c008e55141e",
		"luotu": 1464192842680,
		"tila": "MENEILLAAN",
		"userOID": "MV",
		"runtime": "8h 15min",
		"hakukohteitaYhteensa": 3,
		"hakukohteitaValmiina": 3,
		"hakukohteitaKeskeytetty": 0,
		"jonosija": null,
		"haunnimi": "Seuraava haku ammatilliseen opettajankoulutukseen",
		"nimi": "Varsinainen valinta 3",
		"tyyppi":"HAKU",
		"valintakoelaskenta":"true"
	},
	{
		"uuid": "d29a624ea9314c09bb254c008e55141e",
		"hakuOid": "haku-oid624ea9314c09bb254c008e55141e",
		"luotu": 1464172942680,
		"tila": "MENEILLAAN",
		"userOID": "MV",
		"runtime": "8h 15min",
		"hakukohteitaYhteensa": 3,
		"hakukohteitaValmiina": 3,
		"hakukohteitaKeskeytetty": 2,
		"jonosija": null,
		"haunnimi": "Seuraava haku ammatilliseen opettajankoulutukseen",
		"nimi": "Varsinainen valinta 1",
		"tyyppi":"HAKU",
		"valinnanvaihe": 2
	},
	{
		"uuid": "d29a624ea9314c09bb254c008e55141e",
		"hakuOid": "haku-oid624ea9314c09bb254c008e55141e",
		"luotu": 1463728426803,
		"tila": "MENEILLAAN",
		"userOID": "MV",
		"runtime": "8h 15min",
		"hakukohteitaYhteensa": 3,
		"hakukohteitaValmiina": 0,
		"hakukohteitaKeskeytetty": 0,
		"jonosija": 1,
		"haunnimi": "Haku ammatilliseen opettajankoulutukseen",
		"nimi": "Varsinainen valinta",
		"tyyppi":"HAKU"
	},
	{
		"uuid": "a11a624ea9314c09bb254c008e55141e",
		"hakuOid": "haku-oid624ea9314c09bb254c008e55141e",
		"luotu": 1463728426803,
		"tila": "PERUUTETTU",
		"userOID": "MV",
		"runtime": "8h 15min",
		"hakukohteitaYhteensa": 5,
		"hakukohteitaValmiina": 0,
		"hakukohteitaKeskeytetty": 12,
		"jonosija": 2,
		"haunnimi": "Haku ammatilliseen opettajankoulutukseen",
		"nimi": "Varsinainen valinta",
		"tyyppi":"HAKU",
		"valinnanvaihe": 1,
		"valintakoelaskenta":"true"
	}
];

var hen = {"id":5777299,"etunimet":"Jenni","syntymaaika":"1989-01-18","passinnumero":null,"hetu":"180189-186C","kutsumanimi":"Jenni","oidHenkilo":"1.2.246.562.24.81897278381","oppijanumero":null,"sukunimi":"Kåla","sukupuoli":"2","turvakielto":null,"henkiloTyyppi":"VIRKAILIJA","eiSuomalaistaHetua":false,"passivoitu":false,"yksiloity":false,"yksiloityVTJ":false,"yksilointiYritetty":false,"duplicate":false,"created":1463136655611,"modified":1463392189488,"kasittelijaOid":"1.2.246.562.24.95238236211","asiointiKieli":null,"aidinkieli":null,"huoltaja":null,"kayttajatiedot":{"id":5777300,"username":"KOLAJEN-cou-fi355"},"kielisyys":[],"kansalaisuus":[],"yhteystiedotRyhma":[{"id":5777305,"ryhmaKuvaus":"yhteystietotyyppi2","ryhmaAlkuperaTieto":"alkupera3","readOnly":false,"yhteystiedot":[{"id":5777306,"yhteystietoTyyppi":"YHTEYSTIETO_SAHKOPOSTI","yhteystietoArvo":"jenni.kala@centria.fi"}]},{"id":5777302,"ryhmaKuvaus":"yhteystietotyyppi2","ryhmaAlkuperaTieto":"alkupera3","readOnly":false,"yhteystiedot":[{"id":5777303,"yhteystietoTyyppi":"YHTEYSTIETO_SAHKOPOSTI","yhteystietoArvo":"jenni.kala@centria.fi"}]}]};

var serveStatic = require('serve-static')
// configure everything, just basic setup
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
app.use(serveStatic('.', {}))
 
//---------------------------------------
// mini app
//---------------------------------------
var openConnections = [];
app.get('/seuranta-service/resources/seuranta/yhteenvetokaikillelaskennoille', function(req, res) {
	res.json(data);
});

app.get('/authentication-service/resources/henkilo/:uid', function(req, res) {
  res.json(hen);
});

app.get('/configuration/configuration.js', function(req, res) {
  res.send('SEURANTA_URL_BASE = "http://localhost:3000/seuranta-service/resources";'+
           'AUTHENTICATION_HENKILO_URL_BASE = "http://localhost:3000/authentication-service";');
});

app.use('/', express.static('.'));



// simple route to register the clients
app.get('/seuranta-service/resources/seuranta/yhteenveto/:id/sse', function(req, res) {
 
    // set timeout as high as possible
    req.socket.setTimeout(10000000000);
 
    // send headers for event-stream connection
    // see spec for more information
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });
    res.write('\n');
 
    // push this res object to our global variable
    openConnections.push(res);
 
    // When the request is closed, e.g. the browser window
    // is closed. We search through the open connections
    // array and remove this connection.
    req.on("close", function() {
        var toRemove;
        for (var j =0 ; j < openConnections.length ; j++) {
            if (openConnections[j] == res) {
                toRemove =j;
                break;
            }
        }
        openConnections.splice(j,1);
        console.log(openConnections.length);
    });
});
 
var i = 0;
setInterval(function() {
    // we walk through each connection
    openConnections.forEach(function(resp) {
				var d = {
						"uuid": "bbba624ea9314c09bb254c008e55141e",
						"hakuOid": "haku-oid524ea9314c09bb254c008e55141e",
						"luotu": "2016-02-02",
						"tila": "MENEILLAAN",
						"user": "MV",
						"runtime": "8h 15min",
						"hakukohteitaYhteensa": 5,
						"hakukohteitaValmiina": i,
						"hakukohteitaKeskeytetty": 0,
						"jonosija": 0,
						"haunnimi": "Haku ammatilliseen opettajankoulutukseen",
						"nimi": "Varsinainen valinta"
				};
        resp.write('data:' + JSON.stringify(d) +   '\n\n'); // Note the extra newline
    });
 		i++;
		if (i > 5) {
			i = 0;
		}
}, 1000);
// startup everything
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
})

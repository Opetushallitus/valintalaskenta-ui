process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var https = require('https');
var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer({});
var url = require('url');
var fs = require('fs');
var kooste_server = process.env.kooste_server;
var public_server = process.env.public_server;
var sijoittelu_server = process.env.sijoittelu_server;

// Server Config
var appPort = process.env.PORT || 3000;
console.log("Mock server listening " + appPort + ", kooste_server = " + kooste_server + ", public_server = " + public_server);
app.listen(appPort);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Credentials', false);
  res.header('Access-Control-Max-Age', '86400');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, clientSubSystemCode');
  return next();
});
app.get('/kayttooikeus-service/cas/myroles', (req,res) => res.send([
    "USER_testuser", "APP_VALINTOJENTOTEUTTAMINEN", "APP_VALINTOJENTOTEUTTAMINEN_CRUD",
    "APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.00000000001",
    "APP_SIJOITTELU", "APP_SIJOITTELU_CRUD", "APP_SIJOITTELU_CRUD_1.2.246.562.10.00000000001"
  ])
);
app.options('*', (req, res) => res.sendStatus(200));
app.get('*/buildversion.txt', (req, res)=>res.sendStatus(200));
app.get('*/apply-raamit.js', (req, res)=>res.sendStatus(200));
app.get('/tarjonta-service/**', (req, res)=>proxy.web(req, res, { prependPath: true, xfwd: true, secure: false, target: public_server}));
app.get('/organisaatio-service/**', (req, res)=>proxy.web(req, res, { prependPath: true, xfwd: true, secure: false, target: public_server}));
app.get('/lokalisointi/**', (req, res)=>proxy.web(req, res, { prependPath: true, xfwd: true, secure: false, target: public_server}));
app.get('/koodisto-service/**', (req, res)=>proxy.web(req, res, { prependPath: true, xfwd: true, secure: false, target: public_server}));
app.get('/ohjausparametrit-service/**', (req, res)=>proxy.web(req, res, { prependPath: true, xfwd: true, secure: false, target: public_server}));
app.get('/valintaperusteet-service/**', (req, res)=>proxy.web(req, res, { prependPath: true, xfwd: true, secure: false, target: public_server}));
app.get('/haku-app/**', (req, res)=>proxy.web(req, res, { prependPath: true, xfwd: true, secure: false, target: public_server}));

var publicdir = __dirname + '/static';
app.use((req, res, next) => {
  fs.exists(publicdir + req.path + '.json', (exists) => {
    if (exists) {
      res.setHeader("Content-Type", "application/json");
      req.url += '.json';
    }
      next();
  });
});
app.use(express.static(publicdir));
app.get('/valintalaskentakoostepalvelu/resources/parametrit/:any', (req,res)=>res.send({
  "pistesyotto": true,
  "hakeneet": true,
  "harkinnanvaraiset": true,
  "valintakoekutsut": true,
  "valintalaskenta": true,
  "valinnanhallinta": true,
  "hakijaryhmat": true,
  "koetulostentallennus": true,
  "koekutsujenmuodostaminen": true,
  "harkinnanvarainenpaatostallennus": true
}));
app.get('/sijoittelu-service/**', (req, res)=>proxy.web(req, res, { prependPath: true, xfwd: true, secure: false, target: sijoittelu_server}));
app.get('/valintalaskentakoostepalvelu/**', (req, res)=>proxy.web(req, res, { prependPath: true, xfwd: true, secure: false, target: kooste_server}));
app.get('/mock/v1/haku/**', (req,res)=> {
  res.send({
    "result": {
      "kohdejoukkoUri": "haunkohdejoukko_11#1"
    }
  })
});
app.get('/mock/v1/rest/parametri/**', (req,res)=> {
  res.send({
    "PH_HKP": {
      "date" : new Date().getTime() + 24 * 60 * 60 * 1000
    }
  })
});

app.get('/mock/v1/**', (req,res)=> {
  console.log(req)
  res.send({
    "result": {
      "kohdejoukkoUri": "haunkohdejoukko_11#1"
    }
  })
});

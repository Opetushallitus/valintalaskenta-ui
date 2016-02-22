

Testing Valintalaskenta-UI

Run NodeAndJettyTestRunner with flags -Dnode_server=http://localhost:3000 -Dkooste_server=http://localhost:8090 -Dpublic_server=https://itest-virkailija.oph.ware.fi

Run ValintalaskentakoostepalveluJetty with flags -Dport=8090 -Dsijoittelu_server=http://localhost:9000 -Dvts_server=http://localhost:8097

Run SijoitteluServiceJetty with flags -Dport=9000 -DsijoitteluMongoUri=mongodb://localhost:10000 -DvalintalaskentaMongoUri=mongodb://localhost:10000

Run JettyLauncher with flags -Dvalintatulos.profile=it -DmongoPort=10000


open page http://localhost:8080/valintalaskenta-ui/app/index.html#/haku/1.2.246.562.29.90697286251/hakukohde/1.2.246.562.20.62713048965/sijoitteluntulos
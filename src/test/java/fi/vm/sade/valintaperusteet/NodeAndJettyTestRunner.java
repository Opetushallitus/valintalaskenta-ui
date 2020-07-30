package fi.vm.sade.valintaperusteet;

/**
 * -Dnode_server=http://localhost:3000 -Dkooste_server=http://localhost:8090
 * -Dpublic_server=https://itest-virkailija.oph.ware.fi
 */
public class NodeAndJettyTestRunner {

  public static void main(String[] args) throws Exception {
    NodeTestRunner.startNodeJs();
    JettyTestRunner.main(args);
  }
}

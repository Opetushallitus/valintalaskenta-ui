## Running valintalaskenta-ui locally

### Background

The following describes a setup where valintalaskenta-ui is run locally against hahtuva, so that cas auth works and some
services it connects to (in this example sijoittelu-service) can also be run locally.

The solution is based on the following approach:

1. Fix local build by building in docker that emulates the github build environment (e.g. amd64 emulation on macos)
2. Direct all virkailija.hahtuvaopintopolku.fi browser traffic to an nginx running on docker (ignoring cert errors)
3. Proxy valintalaskenta-ui and sijoittelu to local services running on host
4. Proxy other services to actual hahtuva services

For 2. the obvious solution would be to use the hosts file. The problem with this approach would be that this would also
affect the locally running sijoittelu-service. Connections to other services would fail as our nginx does not have a
valid certificate and sijoittelu-service would thus refuse to connect. To solve this, we only override dns settings for
browser by specifying a custom DoH (dns over https) server.

### Steps

1. Build valintalaskenta-ui locally by running

``` shell
docker-compose up build
```

2. Enable host networking for Docker Desktop (you need to have at least version 4.29.0 for this) by going to Settings ->
Features in Development and enabling "Host Networking". This is not needed if you're running Docker (not Docker Desktop) on Linux.
Host networking is needed so that nginx can proxy traffic back to services running on host.


3. Start dns and nginx servers by running

``` shell
docker-compose up nginx dns
```

4. Start your Chrome or Chromium (running Chromium just for this is recommended so that it is clear which browser is insecure)

``` shell
<path to chrome> --ignore-certificate-errors --user-data-dir=<some data dir>
```

This way chrome will ignore certificate errors, and store any settings and data in a separate folder so that it won't affect
normal browsing.

5. Configure custom DoH server for Chrome (Chromium) by going to Settings -> Privacy and Security. Enable "Use Secure DNS"
and under "Select DNS Provider" choose "Add custom DNS service provider". In the address field, type: https://localhost:5443.

6. Start valintalaskenta-ui and sijoittelu-service locally.

Now all browser traffic should go through nginx with cas working as expected, while sijoittelu-service is still connecting to hahtuva
services directly. Proxying can be controlled by adjusting the nginx/localhost.conf file.
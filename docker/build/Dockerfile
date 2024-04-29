FROM ubuntu:latest@sha256:aa772c98400ef833586d1d517d3e8de670f7e712bf581ce6053165081773259d

RUN adduser --disabled-password --gecos "" --uid 1000 build; \
    apt-get update; \
    apt-get install -y curl chromium-browser git sudo

USER build

RUN  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash;
RUN export NVM_DIR="$HOME/.nvm"; \
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"; \
    nvm install 10;

CMD /bin/bash -c "/app/build.sh"
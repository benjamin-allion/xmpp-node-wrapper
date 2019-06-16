FROM debian:buster

RUN apt update && apt install -y gnupg curl apt-listchanges gcc build-essential wget
RUN echo "deb http://packages.prosody.im/debian stable main" >> /etc/apt/sources.list
RUN curl -Ls "https://prosody.im/files/prosody-debian-packages.key" | apt-key add -
RUN apt update && \
	apt install -y \
	lua-dbi-mysql \
        lua-event \
        prosody && \
    rm -rf /var/lib/apt/lists/*

RUN mkdir -p /usr/lib/prosody/prosody-modules
RUN mkdir -p /usr/lib/prosody/http_upload
RUN mkdir -p /etc/prosody/certs
RUN mkdir -p /var/run/prosody && \
    chown -Rfv prosody:prosody /etc/prosody /var/log/prosody /var/lib/prosody /usr/lib/prosody/prosody-modules /usr/lib/prosody/http_upload /etc/prosody/certs /var/run/prosody

EXPOSE  80 \
        443
# XMPP client2server, server2server
EXPOSE  5222 \
        5269
# XMPP BOSH websocket (HTTP/HTTPS)
EXPOSE  5280 \
        5281
# XMPP external components
EXPOSE  5347

VOLUME /etc/prosody \
       /var/log/prosody \
       /var/lib/prosody \
       /usr/lib/prosody/prosody-modules

USER prosody
ENV __FLUSH_LOG yes
CMD ["prosody"]

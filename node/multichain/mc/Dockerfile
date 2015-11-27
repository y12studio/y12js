FROM phusion/baseimage:0.9.17

# Use baseimage-docker's init system.
CMD ["/sbin/my_init"]

RUN apt-get update -y
RUN apt-get install -y wget
RUN wget -qO- http://www.multichain.com/download/multichain-1.0-alpha-12.tar.gz | tar xvz -C /tmp
RUN mv /tmp//multichain-1.0-alpha-12 /mc
WORKDIR /mc
ENV PATH "/mc:$PATH"

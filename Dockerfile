FROM ubuntu:14.04

MAINTAINER Teo Fleming <mokolodi1@gmail.com>

# Do basic updates

# language-pack-en: install this thing so that mongo can run
# https://github.com/meteor/meteor/issues/4019
RUN apt-get update -q && apt-get clean && \
    apt-get install --yes --force-yes \
    language-pack-en \
    curl

# Install Meteor
ADD ./install_meteor.sh /tmp/
RUN sh /tmp/install_meteor.sh

# create ubuntu user so we can do Meteor stuff without --allow-superuser
RUN useradd -ms /bin/bash ubuntu

# change the default passwords
RUN echo "root:password" | chpasswd
RUN echo "ubuntu:password" | chpasswd

# change to ubuntu before we start doing meteor stuff
USER ubuntu

# download the Meteor distribution, because apparently that's a thing
RUN meteor --version

# Expose some ports
EXPOSE 3000

# Add the code in
ADD . /code

# get to work!
WORKDIR /code/webapp/

# Install the npm stuff
USER root
RUN meteor npm install
USER ubuntu

# Start meteor when the container starts
CMD meteor

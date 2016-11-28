#!/bin/bash

# Make sure only root can run
if [[ $EUID -ne 0 ]]; then
	echo "This script must be run as root" 1>&2
	exit 1
fi

# Set the timezone to be right
timedatectl set-timezone America/New_York

# Other useful stuff
yum install -y htop zsh

# firefox
yum install -y firefox

# rofi
pushd /tmp
wget https://github.com/DaveDavenport/rofi/releases/download/1.2.0/rofi-1.2.0.tar.gz
tar -xzf rofi-1.2.0.tar.gz
pushd rofi-1.2.0
./configure
make
make install
popd
popd

# alsa (audio) and set volume 100
yum install -y alsa-utils
amixer sset Master 100%
amixer sset PCM 100%

# Fancy i3 lock screen
yum install -y giblib giblib-devel ImageMagick
pushd /tmp
wget http://scrot.sourcearchive.com/downloads/0.8/scrot_0.8.orig.tar.gz
tar -xzf scrot_0.8.orig.tar.gz
pushd scrot-0.8
./configure
make
make install
popd
popd

# Sublime text 3
pushd /tmp
wget https://download.sublimetext.com/sublime_text_3_build_3126_x64.tar.bz2
tar -xjf sublime_text_3_build_3126_x64.tar.bz2
mv sublime_text_3 /opt/
ln -s /opt/sublime_text_3/sublime_text /usr/bin/sublime
ln -s /usr/bin/sublime /usr/bin/subl
popd


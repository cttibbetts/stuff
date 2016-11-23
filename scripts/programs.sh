#!/bin/bash

# Make sure only root can run
if [[ $EUID -ne 0 ]]; then
	echo "This script must be run as root" 1>&2
	exit 1
fi

# Set the timezone to be right
timedatectl set-timezone America/New_York

# Other useful stuff
yum install -y htop

# firefox
yum install -y firefox

# rofi
pushd /tmp
wget https://github.com/DaveDavenport/rofi/releases/download/0.15.12/rofi-0.15.12.tar.gz
tar -xzf rofi-0.15.12.tar.gz
pushd rofi-0.15.12
./configure
make
make install
popd
popd

# alsa (audio) and set volume 100
yum install -y alsa-utils
amixer sset Master 100%
amixer sset PCM 100%

# update gocode and godef
pushd /home/vagrant/go/src/github.com/nsf/gocode
git reset --hard
sudo -u vagrant go get -u github.com/nsf/gocode
popd
pushd /home/vagrant/go/src/github.com/rogpeppe/godef
git reset --hard
sudo -u vagrant go get -u github.com/rogpeppe/godef
popd

# apm packages
sudo -u vagrant apm install minimap minimap-cursorline minimap-git-diff minimap-highlight-selected minimap-selection \
	atom-material-syntax atom-material-ui file-icons folder-treasure-boxes fonts \
	vim-mode ex-mode go-plus project-view tree-view-git-status

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


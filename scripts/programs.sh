#!/bin/bash

# Make sure only root can run
if [[ $EUID -ne 0 ]]; then
	echo "This script must be run as root" 1>&2
	exit 1
fi

# firefox
yum install -y firefox

# rofi
pushd /tmp
git clone https://github.com/DaveDavenport/rofi.git rofi
pushd rofi
./configure
make
make install
popd
popd

# vundle
git clone https://github.com/VundleVim/Vundle.vim.git /home/vagrant/.vim/bundle/Vundle.vim

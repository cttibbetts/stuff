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

# alsa (audio)
yum install -y alsa-utils

# atom
pushd /tmp
wget https://atom.io/download/rpm -O atom.x86_64.rpm
yum install -y atom.x86_64.rpm
popd

# update gocode and godef
pushd /home/vagrant/go/src/github.com/nsf/gocode
git reset --hard
go get -u github.com/nsf/gocode
popd
pushd /home/vagrant/go/src/github.com/rogpeppe/godef
git reset --hard
go get -u github.com/rogpeppe/godef
popd

# apm packages
apm install minimap minimap-cursorline minimap-git-diff minimap-highlight-selected minimap-selection \
	atom-material-syntax atom-material-ui file-icons folder-treasure-boxes fonts \
	vim-mode ex-mode go-plus project-view tree-view-git-status


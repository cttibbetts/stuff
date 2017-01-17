#!/bin/bash

# Make sure only root can run
if [[ $EUID -ne 0 ]]; then
	echo "This script must be run as root" 1>&2
	exit 1
fi

# yum-utils (for yum-config-manager)
yum install -y yum-utils

# Set the timezone to be right
timedatectl set-timezone America/New_York

# Other useful stuff
yum install -y htop zsh

# firefox
yum install -y firefox

# chrome
yum-config-manager --add-repo https://dl.google.com/linux/rpm/stable/x86_64
rpm --import https://dl-ssl.google.com/linux/linux_signing_key.pub
yum install -y google-chrome-stable
# Dejavu-sans fonts (chrome's default font)
yum install -y dejavu-sans-fonts
yum install -y dejavu-sans-mono-fonts

# Zathura document reader (and pdf plugin)
yum install -y zathura zathura-pdf-poppler

# neofetch (system information display)
yum-config-manager --add-repo https://copr.fedorainfracloud.org/coprs/konimex/neofetch/repo/epel-7/konimex-neofetch-epel-7.repo
yum install -y neofetch

# Sublime text 3
pushd /tmp
wget https://download.sublimetext.com/sublime_text_3_build_3126_x64.tar.bz2
tar -xjf sublime_text_3_build_3126_x64.tar.bz2
mv sublime_text_3 /opt/
ln -s /opt/sublime_text_3/sublime_text /usr/bin/sublime
ln -s /usr/bin/sublime /usr/bin/subl
popd

# github.com/clvv/fasd
pushd /tmp
wget https://github.com/clvv/fasd/archive/1.0.1.tar.gz
tar -xzf 1.0.1.tar.gz
pushd fasd-1.0.1/
make install
popd
popd

# TODO google-play-music-desktop-player
pushd /tmp
wget https://github.com/MarshallOfSound/Google-Play-Music-Desktop-Player-UNOFFICIAL-/releases/download/v4.0.5/google-play-music-desktop-player-4.0.5.x86_64.rpm
rpm -i google-play-music-desktop-player-4.0.5.x86_64.rpm
popd


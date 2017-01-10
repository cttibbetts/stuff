#!/bin/bash
# Install script for i3-gaps on gaps-next branch

# Make sure only root can run
if [[ $EUID -ne 0 ]]; then
    echo "This script must be run as root" 1>&2
    exit 1
fi

yum groupinstall -y "X Window System"

# Install i3 dependencies available with yum
yum install -y \
    libev-devel \
    startup-notification-devel \
    xcb-util-devel \
    xcb-util-cursor-devel \
    xcb-util-keysyms-devel \
    xcb-util-wm-devel \
    yajl-devel \
    pango-devel \
    libxkbcommon-devel \
    libxkbcommon-x11-devel

# Compile xcb-xrm (xcb-util-xrm)
yum install -y xorg-x11-util-macros
pushd /tmp
git clone https://github.com/Airblader/xcb-util-xrm
pushd xcb-util-xrm
git submodule update --init
./autogen.sh --libdir=/usr/lib64
make
make install
popd
popd

# Compile cairo
# TODO reduce dependencies instead of installing old cairo version
yum install -y cairo-devel
#    -sub: expat-devel fontconfig-devel gl-manpages libXdamage-devel libXfixes-devel libXrender-devel
#          libXxf86vm-devel libdrm-devel libpng-devel libxshmfence-devel mesa-libEGL-devel mesa-libGL-devel
#          pixman-devel
pushd /tmp
git clone git://anongit.freedesktop.org/git/cairo
pushd cairo
./autogen.sh --libdir=/usr/lib64
make
make install
popd
popd

# Compile i3 gaps
pushd /tmp
git clone https://github.com/Airblader/i3
pushd i3
autoreconf --force --install
rm -rf build
mkdir -p build
pushd build
../configure --libdir=/usr/lib64 --sysconfdir=/etc
make
make install

 

#!/bin/bash
# Install script for i3-gaps on gaps-next branch

# Make sure only root can run
if [[ $EUID -ne 0 ]]; then
    echo "This script must be run as root" 1>&2
    exit 1
fi

# Install X
yum groupinstall -y "X Window System"

# Install audio drivers
yum install -y dbus-x11 alsa-utils
amixer sset Master 100%
amixer sset PCM 100%

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
popd
popd
popd

########################################
# Install programs used by my i3 config
########################################
yum install -y i3status i3lock rxvt-unicode-256color

# Compile i3 blocks
pushd /tmp
git clone https://github.com/Airblader/i3blocks-gaps
pushd i3blocks-gaps
make clean all
make install
popd
popd

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

# feh
yum install -y libXinerama-devel imlib2-devel libXt-devel
pushd /tmp
git clone git://git.finalrewind.org/feh
pushd feh
make
make install
popd
popd

# Compton
yum install -y libXcomposite-devel libXrandr-devel libconfig-devel dbus-devel asciidoc
pushd /tmp
git clone https://github.com/chjj/compton
pushd compton
make
make install
popd
popd

# playerctl (controlling and reading audio info from dbux)
yum install -y gtk-doc glib2-devel gobject-introspection-devel
pushd /tmp
git clone https://github.com/acrisci/playerctl
pushd playerctl
./autogen.sh --prefix=/usr
make
make install
cp /usr/lib/libplayerctl* /lib64/
popd
popd


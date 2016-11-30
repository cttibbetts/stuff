# Make sure only root can run our script
if [[ $EUID -ne 0 ]]; then
   echo "This script must be run as root" 1>&2
   exit 1
fi

# Install the X window system group
yum -y groupinstall "X window system"

# Install repos
yum -y install yum-utils epel-release
# For various i3 packages
yum-config-manager --add-repo https://copr.fedorainfracloud.org/coprs/admiralnemo/i3wm-el7/repo/epel-7/admiralnemo-i3wm-el7-epel-7.repo
# For compton
yum-config-manager --add-repo http://download.opensuse.org/repositories/X11:QtDesktop/CentOS_7/X11:QtDesktop.repo
# For rofi
yum-config-manager --add-repo http://copr.fedorainfracloud.org/coprs/azmo/rofi/repo/epel-7/azmo-rofi-epel-7.repo

# the libxkb x11 modules aren't available in centos,
# so they were downloaded from
# https://copr-be.cloud.fedoraproject.org/results/jmliger/gnome316-backports/epel-7-x86_64/libxkbcommon-0.5.0-1.el7.centos.1/
rpm -i ../rpms/libxkbcommon-0.5.0-1.el7.centos.1.x86_64.rpm
rpm -i ../rpms/libxkbcommon-devel-0.5.0-1.el7.centos.1.x86_64.rpm
rpm -i ../rpms/libxkbcommon-x11-0.5.0-1.el7.centos.1.x86_64.rpm
rpm -i ../rpms/libxkbcommon-x11-devel-0.5.0-1.el7.centos.1.x86_64.rpm

# install i3
yum install -y i3

# install programs used by my i3 config
yum install -y i3status feh compton i3lock rofi rxvt-unicode-256color

# install audio drivers
yum install -y dbus-x11 # pulseaudio

# fancy i3 lock screen
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

# i3blocks
pushd /tmp
git clone https://github.com/vivien/i3blocks
pushd i3blocks
make clean all
make install
popd
popd


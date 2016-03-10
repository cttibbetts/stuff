# Make sure only root can run our script
if [[ $EUID -ne 0 ]]; then
   echo "This script must be run as root" 1>&2
   exit 1
fi

# Install the X window system group
yum -y groupinstall "X window system"

# Install repos
yum-config-manager --add-repo http://download.opensuse.org/repositories/X11:QtDesktop/CentOS_7/X11:QtDesktop.repo
yum-config-manager --add-repo https://copr.fedorainfracloud.org/coprs/admiralnemo/i3wm-el7/repo/epel-7/admiralnemo-i3wm-el7-epel-7.repo

# install i3 gaps dependencies
sudo yum install -y \
  gcc \
  libxcb-devel \
  xcb-util-keysyms-devel \
  xcb-util-devel \
  xcb-util-wm-devel \
  yajl-devel \
  libXrandr-devel \
  startup-notification-devel \
  libev-devel \
  xcb-util-cursor-devel \
  libXinerama-devel \
  pcre-devel \
  pango-devel \
  dmenu \
  rxvt-unicode \
  terminus-fonts \
  perl-Data-Dumper \
  xorg-x11-apps \
  xorg-x11-fonts-misc \
  dzen2

# the libxkb x11 modules aren't available in centos,
# so they were downloaded from
# https://copr-be.cloud.fedoraproject.org/results/jmliger/gnome316-backports/epel-7-x86_64/libxkbcommon-0.5.0-1.el7.centos.1/
rpm -i ../rpms/libxkbcommon-0.5.0-1.el7.centos.1.x86_64.rpm
rpm -i ../rpms/libxkbcommon-devel-0.5.0-1.el7.centos.1.x86_64.rpm
rpm -i ../rpms/libxkbcommon-x11-0.5.0-1.el7.centos.1.x86_64.rpm
rpm -i ../rpms/libxkbcommon-x11-devel-0.5.0-1.el7.centos.1.x86_64.rpm

# Install i3 gaps
pushd /tmp
git clone http://github.com/Airblader/i3
pushd i3
git checkout gaps
make && make install
popd
popd

# install feh, compton, i3status, i3lock
yum install -y i3status feh compton
pushd /tmp
git clone http://github.com/i3/i3lock.git
pushd i3lock
yum install -y pam-devel
make
make install
popd
popd

# install audio drivers
yum install -y dbus-x11 # pulseaudio

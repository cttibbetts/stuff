#!/bin/bash
# Update git to latest version

# Make sure only root can run
if [[ $EUID -ne 0 ]]; then
    echo "This script must be run as root" 1>&2
    exit 1
fi

yum install -y \
    make \
    autoconf \
    curl-devel \
    expat-devel \
    gettext-devel \
    openssl-devel \
    perl-devel \
    zlib-devel

pushd /tmp
git clone git://git.kernel.org/pub/scm/git/git.git
pushd git
make configure
./configure --prefix=/usr
make all
make install
popd
popd

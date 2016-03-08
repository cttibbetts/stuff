#!/bin/bash

# configure git
cp /vagrant/custom/config/.gitconfig ~/

# Set up bash it profile
git clone --depth=1 https://github.com/Bash-it/bash-it.git ~/.bash_it
cp /vagrant/custom/config/.bashrc ~/.bashrc
mkdir ~/.bash_it/themes/siriustuck-custom
cp siriustuck-custom.theme.bash ~/.bash_it/themes/siriustuck-custom/.

# configure tmux
cp /vagrant/custom/config/.tmux.conf ~/

# Copy lysa bashrc into my custom bashrc
cat /vagrant/provisioning/roles/dev/files/bashrc >> ~/.bashrc

. ~/.bashrc

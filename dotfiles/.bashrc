# .bashrc

# Source global definitions
if [ -f /etc/bashrc ]; then
	. /etc/bashrc
fi

# Uncomment the following line if you don't like systemctl's auto-paging feature:
# export SYSTEMD_PAGER=

# User specific aliases and functions
export PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:/root/bin:/vagrant/bin:/usr/local/go/bin:/home/vagrant/go/bin
export GOPATH=/home/vagrant/go
export CDPATH=.:/home/vagrant/go/src/github.com/Novetta:~

export LYSA_DB_PASSWORD=lysapass

# Helpers

# Print the id of the docker container - searched by first argument
dockerid() {
  docker ps | grep $1 | awk '{print $1}'
}

# pull all git directories below the current directory
pull-all() {
	for x in $(find . -type d -name .git -print | xargs dirname)
	do
	    echo "Retrieving from [$x]"
	    pushd $(pwd)
	    cd $x
	    git pull
	    popd
	done
}

single() {
	xrandr --output VGA-0 --auto --primary \
		--output VGA-1 --off \
		--output VGA-2 --off 
}

dual() {
	xrandr --output VGA-0 --auto --primary \
		--output VGA-1 --auto --right-of VGA-0 \
		--output VGA-2 --off
}

tri() {
	xrandr --output VGA-0 --auto --primary \
		--output VGA-1 --auto --right-of VGA-0 \
		--output VGA-2 --auto --right-of VGA-1
}

# .bashrc

# Source global definitions
if [ -f /etc/bashrc ]; then
	. /etc/bashrc
fi

# User specific aliases and functions

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


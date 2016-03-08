#!/bin/bash

if [ -f ~/.Xresources ] ; then
	xrdb ~/.Xresources
fi

exec i3

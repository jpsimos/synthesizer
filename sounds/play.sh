#!/bin/zsh

#Testing out the wav files
#using this script

#Author jacob psimos 2017

set -u
cd './piano'
list=$(ls | sort)

while read line; do
	echo "$line"
	afplay -t 1 $line &
	sleep 0.8
done <<< "$list"

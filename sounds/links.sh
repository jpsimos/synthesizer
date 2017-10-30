#!/bin/bash

#Used to generate the javascript code for initializing the keys and the associated wav files
#No way will I type out all of those lines. -jp

#Author Jacob psimos

set -u
i=1

while [[ $i -le 88 ]]; do
    echo "<audio id=\"piano_$i\" src=\"sounds/jobro/piano_$i.wav\" preload=\"true\"></audio>"
    i=$((i + 1))
done


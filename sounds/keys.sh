#!/bin/bash

set -u

keys=$(cat keys.txt | tr -d '\r' | sed -e 's/\s\+/ /g' | sed -e 's/[(][^)]*[)]//g' | sort -k 1,2n)

while read line; do
	keyIndex=$(echo -n "$line" | cut -d ' ' -f 1)
	keyName=$(echo -n "$line" | cut -d ' ' -f 2)
	keyFreq=$(echo -n "$line" | cut -d ' ' -f 4)
	
	if [[ $keyIndex -le 64 ]]; then
		printf "this.keyNames.push(\"%s\");\n" "$keyName"
		printf "this.keyFrequencies.push(%f);\n" "$keyFreq"
		
		if [[ $? -eq 1 ]]; then
			break;
		fi
	fi
done <<< "$keys"

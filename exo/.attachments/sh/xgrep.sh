#!/bin/sh
LF=$(printf '\\\n_')
LF=${LF%_}
this=$(dirname $0)
CGINAME="$this/../../../skeleton/cgi-name"
NAMEREAD="$this/../../../skeleton/nameread"
QUERY="$(printf "%s" $1 | ${CGINAME} | ${NAMEREAD} q -)"
cd $this/../../../exo 
grep $QUERY ./* | sed 's/$/<br\/>/'
exit 0

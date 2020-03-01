#!/bin/sh
LF=$(printf '\\\n_')
LF=${LF%_}
this=$(dirname $0)
CGINAME="$this/../../../skeleton/cgi-name"
NAMEREAD="$this/../../../skeleton/nameread"
SKMD="$this/../../../skeleton/skmd"
FDPATH="$(printf "%s" $1 | ${CGINAME} | ${NAMEREAD} path -)"
FD=$(printf "%s" $FDPATH | sed "s:^/:$this/../../../exo/:") 
if   [ -f "$FD" ]; then
  { echo $FD | grep '\.comments-' >/dev/null;} && {
    cat $FD                                        |
    ${SKMD} -                                      |
    grep -v '.attachments/img'                     |
    grep -v '^<meta '                              |
    grep -Ev '(comments.js|mokuji.js)'             |
    awk '/<header/,/<\/header>/{next}{print}'      |
    awk '/<footer/,/<\/footer>/{next}{print}'    ; }
  { echo $FD | grep -v '\.comments-' | grep 'md$'  >/dev/null; } && { 
    cat $FD                                        | 
    awk '/^# /,/^!--$/'                            | 
    ${SKMD} -                                      |
    awk '/<footer/,/<\/footer>/{next}{print}'      |
    grep -v '.attachments/img'                     |
    grep -v '^<meta '                              |
    grep -Ev '(comments.js|stub.js|prism.js|mokuji.js)'      |
    grep -v 'prism.css'                            |
    awk '/<header/,/<\/header>/{next}{print}'      |
    sed 's:</body>:<a class=\"button radius secondary\" href=\"'"$FDPATH"'\" target=\"_top\">go</a>'"$LF"'&:' ; }
  { echo $FD | grep 'html$' >/dev/null; } && { 
    cat $FD                                        |
    awk '/^<!DOCTYPE html>/, /^<!--/'              |
    sed 's:</body>:<a class=\"button radius secondary\" href=\"'"$FDPATH"'\" target=\"_top\">go</a>'"$LF"'&:' ; }
elif [ -d "$FD" ]; then
  cat ${FD}.memo.md | ${SKMD} -                    | 
  awk '/<footer/,/<\/footer>/{next}{print}'        |
  grep -v '.attachments/img'                       |
  grep -v '^<meta '                                |
  grep -Ev '(comments.js|stub.js|prism.js|mokuji.js)'        |
  grep -v 'prism.css'                              |
  awk '/<header/,/<\/header>/{next}{print}'        |
  sed 's:</body>:<a class=\"button radius secondary\" href=\"'"$FDPATH"'\" target=\"_top\">go</a>'"$LF"'&:' ;
fi
exit 0

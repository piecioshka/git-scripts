#!/usr/bin/env bash

# https://colors.sh/
NO_FORMAT="\033[0m"
C_GREY46="\033[38;5;243m"

function print {
  echo -e "\n${C_GREY46}$1${NO_FORMAT}\n"
}

function printCommand {
  print "[x] Run: $1"
}

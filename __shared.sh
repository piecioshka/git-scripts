#!/usr/bin/env bash

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$script_dir/__colors.sh"

function __print_title {
  echo -e "${__COLOR_BLUE_LIGHT}==> ${1}${__COLOR_RESET}"
}

function __print_action {
  echo -e "${__COLOR_BLUE_LIGHT}==> ${__COLOR_GREEN}[x]${__COLOR_BLUE} # ${__COLOR_RESET}${1}"
}

function __print_command {
  command="${1}"
  current_dir="${2:-$(pwd)}"

  if [ -z "$command" ]; then
    echo "Usage: __print_command <command> [current_dir=$(pwd)]"
    exit 1
  fi

  folder_name=$(basename $current_dir)
  echo -e "${__COLOR_BLUE_LIGHT}==> ${__COLOR_GREEN}${folder_name}${__COLOR_BLUE} > ${__COLOR_RESET}$command"
}

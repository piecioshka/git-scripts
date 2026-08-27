#!/usr/bin/env bash

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=shared/__colors.sh
source "$script_dir/__colors.sh"

function __print_info {
  echo -e "${__COLOR_CYAN}${1}${__COLOR_RESET}"
}

function __print_debug {
  echo -e "${__COLOR_BLUE}${1}${__COLOR_RESET}"
}

function __print_warning {
  echo -e "${__COLOR_YELLOW}${1}${__COLOR_RESET}"
}

function __print_error {
  echo -e "${__COLOR_RED}${1}${__COLOR_RESET}"
}

function __print_title {
  echo -e "${__COLOR_BLUE_LIGHT}==> ${1}${__COLOR_RESET}"
}

function __print_action {
  echo -e "${__COLOR_BLUE_LIGHT}==> ${__COLOR_GREEN}[x]${__COLOR_BLUE} # ${__COLOR_RESET}${1}"
}

function __print_command {
  local cmd="${1}"
  local current_dir="${2:-$(pwd)}"

  if [ -z "$cmd" ]; then
    echo "Usage: __print_command <command> [current_dir=\$(pwd)]" >&2
    return 1
  fi

  local folder_name
  folder_name=$(basename "$current_dir")
  echo -e "${__COLOR_BLUE_LIGHT}==> ${__COLOR_GREEN}${folder_name}${__COLOR_BLUE} > ${__COLOR_RESET}$cmd"
}

# Prints and runs a command.
#
#   __print_command_and_eval "git status -s"        # one argument: evaluated by the shell
#   __print_command_and_eval git commit -m "$msg"   # argument list: executed as is
#
# Pass an argument list whenever the command contains user input, so that
# quotes and spaces in the input cannot break or change the command.
function __print_command_and_eval {
  if [ "$#" -eq 1 ]; then
    __print_command "${1}"
    eval "${1}"
  else
    __print_command "$*"
    "$@"
  fi
  echo ""
}

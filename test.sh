#!/usr/bin/env bash

set -e

cd "$(dirname "${BASH_SOURCE[0]}")"

npm run --silent lint
npm run --silent test
npm run --silent format:check

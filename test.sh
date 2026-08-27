#!/usr/bin/env bash

set -e

node shared/__cli.test.js
node --test shared/__git.test.js

#!/usr/bin/env sh

args=("$@")

npx eslint \
  --ignore-path .gitignore \
  ${args[*]}

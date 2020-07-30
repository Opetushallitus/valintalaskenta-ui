#!/usr/bin/env sh

npx eslint \
  --ignore-path .eslintignore \
  './src/main' \
  './src/test' \
  --ext 'js,jsx,ts,tsx'

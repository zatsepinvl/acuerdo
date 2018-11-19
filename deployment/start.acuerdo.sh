#!/usr/bin/env bash
set -e

#build all
./build.acuerdo.sh

#start all
docker-compose up -d --build


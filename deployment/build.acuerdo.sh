#!/usr/bin/env bash
set -e

#build smart contract
cd ../smart-contract
npm install
./migrate.sh

#build service
cd ../server
./web3/generate.sh
./gradlew build

#build webapp
cd ../dapp
npm install
npm run build


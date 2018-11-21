#!/usr/bin/env bash
set -e
dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )" #script directory
targetPath=${dir}/../src/main/resources/contracts
buildDir=${1:-contracts}
contracts="Channels.json"
mkdir -p ${targetPath}
for contract in ${contracts}
do
   cp  ${buildDir}/${contract} ${targetPath}
   ${dir}/web3j-3.6.0/bin/web3j truffle generate ${targetPath}/${contract} \
                        -o ${dir}/../src/main/java \
                        -p com.acuerdo.web3.contract
done
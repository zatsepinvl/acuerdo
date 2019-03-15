#!/usr/bin/env bash
set -e
dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )" #script directory
resourcesPath=${1:-${dir}/../build/generated-resources/contracts}
sourcesPath=${2:-${dir}/../build/generated-sources}
contracts=${3}
network=${4:-testrpc}
mkdir -p ${resourcesPath}
for contract in ${contracts}
do
   cp  ${dir}/../../smart-contract/builds/${network}/${contract} ${resourcesPath}
   ${dir}/web3j-3.6.0/bin/web3j truffle generate ${resourcesPath}/${contract} \
                        -o ${sourcesPath} \
                        -p com.acuerdo.web3.contract
done
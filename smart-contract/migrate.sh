set -e
network=${1:-testrpc}
reset=${2}
mkdir -p builds/${network}
rm -rf build
mkdir -p build/contracts
cp -a builds/${network}/. build/contracts/
truffle --network ${network} migrate ${reset}
cp -a build/contracts/. builds/${network}/
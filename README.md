<img src="./docs/images/logo-colored.png" width=400/>

_Ethereum Payment DApp on Payment Channels_

## About
Acuerdo is a DApp based on Payment Channels for Ethereum users 
to proceed micro-payments within channel and 
to commit channel state to blockchain.
Acuerdo provides fast and cheap way to pay for services or goods.

### Acuerdo Smart Contract
[Channels.sol](./smart-contract/contracts/Channels.sol)

### Main process

![High-level overview](./docs/images/acuerdo-high-level-process.png)

### Payout and sign 

![Payout and sign](./docs/images/acuerdo-payout-and-sign.png)

## Architecture

![Architecture](./docs/images/acuerdo-architecture.png)


## Build and Run

### Requirements
* docker
* docker-compose
* npm

### Start
* cd deployment
* ./install.global.sh
* ./start.testrpc.sh
* go to another terminal window
* ./start.acuerdo.sh
    * test ethereum node http://localhost:8545
    * server http://localhost:8080
    * webapp http://localhost



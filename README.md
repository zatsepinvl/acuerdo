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
To build and run Acuerdo all you need is `docker` and `docker-compose`. 
This is made by [docker multi-stage builds](https://docs.docker.com/develop/develop-images/multistage-build/).

### Requirements
* docker 18+
* docker-compose 1.20+

### Start
* `cd deployment`
* `cp template.env .env`
* For Windows docker-tool-box set ETH_NODE_URL=http://<DOCKER_HOST>:8545 in .env
* `docker-compose up -d testrpc` (run local test Ethereum network)
* `docker-compose up --build -d`

Components:
* testrpc `http://<DOCKER_HOST>:8545`
* server `http://<DOCKER_HOST>:8080`
* webapp `http://<DOCKER_HOST>:80`


FROM node:11 as smart-contract-builder
RUN npm install -g truffle
COPY package.json .
RUN npm install

ARG ETH_NODE_URL=http://localhost:8545
ARG ETH_NETWORK=testrpc
COPY . .
RUN touch truffle.env && echo 'ETH_NODE_URL='${ETH_NODE_URL} > truffle.env
RUN ./migrate.sh ${ETH_NETWORK}
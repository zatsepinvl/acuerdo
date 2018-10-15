package com.acuerdo.web3.core

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties("web3")
class Web3Props {
    lateinit var nodeUrl: String
}

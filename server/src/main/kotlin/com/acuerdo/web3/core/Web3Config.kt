package com.acuerdo.web3.core

import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.web3j.protocol.Web3j
import org.web3j.protocol.Web3jService
import org.web3j.protocol.http.HttpService
import org.web3j.protocol.websocket.WebSocketService

@Configuration
@EnableConfigurationProperties(Web3Props::class)
class Web3Config {

    @Bean
    fun web3j(web3jService: Web3jService): Web3j {
        return Web3j.build(web3jService)
    }

    @Bean
    fun web3jService(web3Props: Web3Props): Web3jService {
        val nodeUrl = web3Props.nodeUrl
        return when {
            nodeUrl.startsWith("http") -> HttpService(nodeUrl, false)
            nodeUrl.startsWith("ws") -> WebSocketService(nodeUrl, false)
                    .apply { connect() }
            else -> throw IllegalArgumentException("Unsupported protocol $nodeUrl")
        }
    }

    @Bean
    fun web3ConfigProps(web3j: Web3j, web3Props: Web3Props): Web3Settings {
        val nodeUrl = web3Props.nodeUrl
        val netId = web3j.netVersion().send().netVersion
        val clientVersion = web3j.web3ClientVersion().send().web3ClientVersion
        return Web3Settings(nodeUrl, netId, clientVersion)
    }
}


data class Web3Settings(
        val nodeUrl: String,
        val netId: String,
        val clientVersion: String
)

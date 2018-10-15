package com.acuerdo.web3.core

import com.acuerdo.web3.contract.Channels
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.web3j.protocol.Web3j
import org.web3j.tx.ReadonlyTransactionManager


@Configuration
class ContractConfig {

    @Bean
    fun channels(web3j: Web3j, web3Settings: Web3Settings): Channels {
        val netId = web3Settings.netId
        val address = Channels.getPreviouslyDeployedAddress(netId)
                ?: throw IllegalArgumentException("Unable to find Channel address in $netId network")
        val transactionManager = ReadonlyTransactionManager(web3j, null)
        return Channels.load(address, web3j, transactionManager, null)
    }
}
package com.acuerdo.web3.core.log

import org.springframework.stereotype.Service
import org.web3j.protocol.core.methods.response.TransactionReceipt

@Service
interface TransactionHandler {
    fun address(): String
    fun handleTransactionReceipt(txReceipt: TransactionReceipt) {}
}
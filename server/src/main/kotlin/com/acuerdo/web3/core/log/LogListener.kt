package com.acuerdo.web3.core.log

import com.acuerdo.web3.contract.Channels
import com.acuerdo.web3.core.Web3Settings
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import org.web3j.protocol.Web3j
import org.web3j.protocol.core.DefaultBlockParameter
import org.web3j.protocol.core.methods.request.EthFilter
import org.web3j.protocol.core.methods.response.EthLog
import java.math.BigInteger.ONE
import java.util.logging.Logger

@Service
class LogListener(
        val logger: Logger,
        val web3j: Web3j,
        val channels: Channels,
        val web3Settings: Web3Settings,
        val listenerDataRepository: ListenerDataRepository,
        val transactionHandlers: List<TransactionHandler>
) {
    @Scheduled(fixedDelayString = "\${web3.log.listener.delay}")
    fun listen() {
        val netId = web3Settings.netId
        val currentBlock = web3j.ethBlockNumber().send().blockNumber
        val listenerData = listenerDataRepository.findById(netId)
                .orElseGet({
                    val data = ListenerData(netId, currentBlock)
                    listenerDataRepository.save(data)
                })
        val lastBlock = listenerData.lastBlock
        if (lastBlock <= currentBlock) {
            val fromBlock = DefaultBlockParameter.valueOf(lastBlock)
            val toBlock = DefaultBlockParameter.valueOf(currentBlock)
            transactionHandlers.forEach {
                val filter = EthFilter(fromBlock, toBlock, it.address())
                web3j.ethGetLogs(filter).send().logs
                        .map { it as EthLog.LogObject }
                        .filter { !it.isRemoved }
                        .map(EthLog.LogObject::getTransactionHash)
                        .map { web3j.ethGetTransactionReceipt(it).send().result }
                        .forEach(it::handleTransactionReceipt)
                logger.info("[LOG LISTENER] Blocks handles from $lastBlock to $currentBlock")
                listenerDataRepository.save(ListenerData(listenerData.id, currentBlock.add(ONE)))
            }
        }
    }
}
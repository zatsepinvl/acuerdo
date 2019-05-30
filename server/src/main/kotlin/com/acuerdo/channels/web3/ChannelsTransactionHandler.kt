package com.acuerdo.channels.web3

import com.acuerdo.channels.core.event.ChannelEvent
import com.acuerdo.channels.core.event.ChannelEventDispatcher
import com.acuerdo.channels.core.event.EventType
import com.acuerdo.channels.core.event.EventType.CHANNEL_OPENED
import com.acuerdo.channels.core.model.*
import com.acuerdo.web3.contract.Channels
import com.acuerdo.web3.contract.Channels.ChannelClosedEventResponse
import com.acuerdo.web3.contract.Channels.ChannelOpenedEventResponse
import com.acuerdo.web3.core.log.TransactionHandler
import org.springframework.stereotype.Service
import org.web3j.protocol.Web3j
import org.web3j.protocol.core.methods.response.TransactionReceipt
import org.web3j.utils.Numeric
import java.time.Instant
import java.util.logging.Logger

@Service
class ChannelsTransactionHandler(
        val channels: Channels,
        val web3j: Web3j,
        val channelEventDispatcher: ChannelEventDispatcher,
        val channelRepository: ChannelRepository,
        val transactionRepository: TransactionRepository,
        val logger: Logger
) : TransactionHandler {

    override fun address() = channels.contractAddress!!

    override fun handleTransactionReceipt(txReceipt: TransactionReceipt) {
        channels.getChannelOpenedEvents(txReceipt).forEach(this::handleChanelOpenedEvent)
        channels.getChannelClosedEvents(txReceipt).forEach(this::handleChanelClosedEvent)
    }

    private fun handleChanelOpenedEvent(event: ChannelOpenedEventResponse) {
        val block = web3j.ethGetBlockByHash(event.log.blockHash, false).send().block
        val timestamp = Instant.ofEpochSecond(block.timestamp.longValueExact())
        val ethTx = web3j.ethGetTransactionByHash(event.log.transactionHash).send().result
        val channelId = Numeric.toHexString(event.channelId)
        val existingChannel = channelRepository.findById(channelId).orElse(null)
        val channel = Channel(
                channelId = channelId,
                sender = event.sender,
                recipient = event.recipient,
                value = event.value,
                dueDate = Instant.ofEpochSecond(event.dueDate.longValueExact()),
                createdAt = timestamp,
                status = ChannelStatus.OPENED,
                submittedAt = existingChannel?.submittedAt ?: Instant.now(),
                channelName = existingChannel.channelName
        )
        val transaction = Transaction(
                hash = ethTx.hash,
                channelId = channel.channelId,
                from = ethTx.from,
                to = ethTx.to,
                status = TransactionStatus.CONFIRMED,
                confirmedAt = timestamp,
                event = TransactionEvent.OPEN_CHANNEL
        )
        channelRepository.save(channel)
        transactionRepository.save(transaction)
        channelEventDispatcher.dispatch(ChannelEvent(channel, transaction, CHANNEL_OPENED))
    }

    private fun handleChanelClosedEvent(event: ChannelClosedEventResponse) {
        val channelId = Numeric.toHexString(event.channelId)
        val channel = channelRepository.getById(channelId)
        val block = web3j.ethGetBlockByHash(event.log.blockHash, false).send().block
        val timestamp = Instant.ofEpochSecond(block.timestamp.longValueExact())
        val ethTx = web3j.ethGetTransactionByHash(event.log.transactionHash).send().result
        channel.status = ChannelStatus.CLOSED
        channel.refundToSender = event.refundToSender
        channel.releaseToRecipient = event.releasedToRecipient
        val transaction = Transaction(
                hash = ethTx.hash,
                channelId = channel.channelId,
                from = ethTx.from,
                to = ethTx.to,
                status = TransactionStatus.CONFIRMED,
                confirmedAt = timestamp,
                event = TransactionEvent.CLOSE_CHANNEL
        )
        channelRepository.save(channel)
        transactionRepository.save(transaction)
        channelEventDispatcher.dispatch(ChannelEvent(channel, transaction, EventType.CHANNEL_CLOSED))
    }
}
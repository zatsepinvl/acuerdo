package com.acuerdo.web3.core.log

import com.acuerdo.channels.core.event.ChannelEvent
import com.acuerdo.channels.core.event.ChannelEventDispatcher
import com.acuerdo.channels.core.event.EventType.CHANNEL_OPENED
import com.acuerdo.channels.core.model.*
import com.acuerdo.web3.contract.Channels
import com.acuerdo.web3.contract.Channels.ChannelClosedEventResponse
import com.acuerdo.web3.contract.Channels.ChannelOpenedEventResponse
import org.springframework.stereotype.Service
import org.web3j.protocol.Web3j
import org.web3j.protocol.core.methods.response.TransactionReceipt
import org.web3j.utils.Numeric
import java.time.Instant

@Service
class ChannelsTransactionHandler(
        val channels: Channels,
        val web3j: Web3j,
        val channelEventDispatcher: ChannelEventDispatcher,
        val channelRepository: ChannelRepository,
        val transactionRepository: TransactionRepository
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
                canCanceledBefore = Instant.ofEpochSecond(event.canCanceledAt.longValueExact()),
                createdAt = timestamp,
                status = ChannelStatus.OPENED,
                submittedAt = existingChannel?.submittedAt ?: Instant.now()
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
        /* val channelId = Numeric.toHexString(event.channelId)
         val channel = channelRepository.getById(channelId)
         channel.status = ChannelStatus.CLOSED
         channel.refundToSender = event.refundToSender
         channel.releaseToRecipient = event.releasedToRecipient
         channelRepository.save(channel)
         channelEventDispatcher.dispatch(ChannelEvent(channel, CHANNEL_CLOSED))*/
    }
}
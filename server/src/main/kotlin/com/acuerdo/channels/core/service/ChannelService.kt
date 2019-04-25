package com.acuerdo.channels.core.service

import com.acuerdo.channels.core.ChannelData
import com.acuerdo.channels.core.ChannelPaymentStatus
import com.acuerdo.channels.core.model.*
import com.acuerdo.common.service.ResourceNotFoundException
import org.springframework.stereotype.Service
import java.math.BigInteger

interface ChannelService {
    fun getChannelDataById(channelId: String): ChannelData
    fun checkChannelExists(channelId: String)
    fun saveChannel(channel: Channel, transaction: Transaction)
    fun closeChannel(channelId: String, transaction: Transaction)
}

@Service
class ChannelServiceImpl(
        private val channelRepository: ChannelRepository,
        private val transactionRepository: TransactionRepository,
        private val paymentRepository: PaymentRepository
) : ChannelService {

    override fun getChannelDataById(channelId: String): ChannelData {
        val channel = channelRepository.getById(channelId)
        val payments = paymentRepository.findAllByChannelId(channelId)
        val transactions = transactionRepository.findAllByChannelId(channelId)
        val paymentStatus = payments
                .map { it.value }
                .fold(BigInteger.ZERO) { acc, bigInteger -> acc.add(bigInteger) }
                .let {
                    ChannelPaymentStatus(channel.value.subtract(it), it)
                }
        return ChannelData(channel, payments, transactions, paymentStatus)
    }

    override fun saveChannel(channel: Channel, transaction: Transaction) {
        val channelId = channel.channelId
        if (channelRepository.existsById(channelId)) {
            throw IllegalStateException("Channel with id $channelId exists ")
        }
        channelRepository.save(channel)
        transactionRepository.save(transaction)
    }

    override fun closeChannel(channelId: String, transaction: Transaction) {
        checkChannelExists(channelId)
        if (transaction.event != TransactionEvent.CLOSE_CHANNEL) {
            throw IllegalArgumentException("Transaction event must be ${TransactionEvent.CLOSE_CHANNEL}")
        }
        transactionRepository.save(transaction)
    }

    override fun checkChannelExists(channelId: String) {
        if (!channelRepository.existsById(channelId)) {
            throw ResourceNotFoundException("Channel with paymentId $channelId doesn't exist")
        }
    }
}
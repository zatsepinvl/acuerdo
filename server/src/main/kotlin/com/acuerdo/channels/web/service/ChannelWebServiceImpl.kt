package com.acuerdo.channels.web.service

import com.acuerdo.channels.core.model.ChannelRepository
import com.acuerdo.channels.core.model.PaymentRepository
import com.acuerdo.channels.core.model.TransactionRepository
import com.acuerdo.channels.core.model.getById
import com.acuerdo.channels.web.ChannelPaymentStatus
import com.acuerdo.channels.web.ChannelResponse
import org.springframework.stereotype.Service
import java.math.BigInteger

@Service
class ChannelWebServiceImpl(
        private val channelRepository: ChannelRepository,
        private val paymentRepository: PaymentRepository,
        private val transactionRepository: TransactionRepository
) : ChannelWebService {
    override fun getChannelById(channelId: String): ChannelResponse {
        val channel = channelRepository.getById(channelId)
        val payments = paymentRepository.findAllByChannelId(channelId)
        val transactions = transactionRepository.findAllByChannelId(channelId)
        val paymentStatus = payments
                .map { it.value }
                .fold(BigInteger.ZERO) { acc, bigInteger -> acc.add(bigInteger) }
                .let {
                    ChannelPaymentStatus(channel.value.subtract(it), it)
                }
        return ChannelResponse(channel, payments, transactions, paymentStatus)
    }


}
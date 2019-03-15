package com.acuerdo.channels.web

import com.acuerdo.channels.core.model.Channel
import com.acuerdo.channels.core.model.Payment
import com.acuerdo.channels.core.model.Transaction
import com.fasterxml.jackson.annotation.JsonUnwrapped
import java.math.BigInteger

data class ChannelSaveRequest(
        val channel: Channel,
        val transaction: Transaction
)

data class ChannelCloseRequest(
        val channelId: String,
        val transaction: Transaction
)

data class ChannelPaymentStatus(
        var refundToSender: BigInteger,
        var releaseToRecipient: BigInteger
)

data class ChannelResponse(
        @JsonUnwrapped val channel: Channel,
        val payments: List<Payment>,
        val transactions: List<Transaction>,
        val paymentStatus: ChannelPaymentStatus
)

data class PaymentSignature(
        val signature: String
)

data class Login(
        val account: String,
        val signature: String,
        val signedMessage: String
)
package com.acuerdo.channels.core

import com.acuerdo.channels.core.model.Channel
import com.acuerdo.channels.core.model.Payment
import com.acuerdo.channels.core.model.Transaction
import com.fasterxml.jackson.annotation.JsonUnwrapped
import java.math.BigInteger

data class ChannelSaveData(
        val channel: Channel,
        val transaction: Transaction
)

data class ChannelPaymentStatus(
        var refundToSender: BigInteger,
        var releaseToRecipient: BigInteger
)

data class ChannelData(
        @JsonUnwrapped val channel: Channel,
        val payments: List<Payment>,
        val transactions: List<Transaction>,
        val paymentStatus: ChannelPaymentStatus
)

data class PaymentSignature(
        val signature: String
)
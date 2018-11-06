package com.acuerdo.channels.web

import com.acuerdo.channels.core.model.Channel
import com.acuerdo.channels.core.model.Payment
import com.acuerdo.channels.core.model.Transaction
import com.fasterxml.jackson.annotation.JsonUnwrapped

data class ChannelSaveRequest(
        val channel: Channel,
        val transaction: Transaction
)

data class ChannelCloseRequest(
        val channelId: String,
        val transaction: Transaction
)

data class ChannelResponse(
        @JsonUnwrapped val channel: Channel,
        val payments: List<Payment>,
        val transactions: List<Transaction>
)

data class PaymentSignature(
        val signature: String
)

data class Login(
        val account: String,
        val signature: String,
        val signedMessage: String
)
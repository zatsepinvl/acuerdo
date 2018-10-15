package com.acuerdo.channels.web

import com.acuerdo.channels.core.model.Channel
import com.acuerdo.channels.core.model.Payment
import com.acuerdo.channels.core.model.Transaction
import com.fasterxml.jackson.annotation.JsonUnwrapped

class ChannelSaveRequest(
        val channel: Channel,
        val transaction: Transaction
)

class ChannelResponse(
        @JsonUnwrapped val channel: Channel,
        val payments: List<Payment>,
        val transactions: List<Transaction>
)
package com.acuerdo.channels.core.event

import com.acuerdo.channels.core.model.Channel
import com.acuerdo.channels.core.model.Transaction

data class ChannelEvent(
        val channel: Channel,
        val transaction: Transaction,
        val type: EventType
)

enum class EventType {
    CHANNEL_OPENED,
    CHANNEL_CLOSED,
    CHANNEL_NEW_PAYMENT
}
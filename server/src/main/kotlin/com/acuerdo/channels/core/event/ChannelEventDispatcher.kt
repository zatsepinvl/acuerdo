package com.acuerdo.channels.core.event

import org.springframework.stereotype.Service
import java.util.logging.Logger

interface ChannelEventDispatcher {
    fun dispatch(channelEvent: ChannelEvent)
}

@Service
class ChannelEventDispatcherImpl(
        val logger: Logger,
        val eventHandlers: List<ChannelEventHandler>
) : ChannelEventDispatcher {

    override fun dispatch(channelEvent: ChannelEvent) {
        logger.info("[ChannelEvent] $channelEvent")
        eventHandlers.forEach { it.onChannelChanged(channelEvent) }
    }

}
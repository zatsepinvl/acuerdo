package com.acuerdo.channels.web.ws

import com.acuerdo.channels.core.event.ChannelEvent
import com.acuerdo.channels.core.event.ChannelEventHandler
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.stereotype.Service

@Service
class WsChannelEventHandler(
        val messagingTemplate: SimpMessagingTemplate
) : ChannelEventHandler {
    override fun onChannelChanged(channelEvent: ChannelEvent) {
        messagingTemplate.convertAndSend(
                "/channels/${channelEvent.channel.channelId}",
                channelEvent
        )
    }
}
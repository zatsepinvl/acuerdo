package com.acuerdo.channels.web.ws

import com.acuerdo.channels.core.event.ChannelEvent
import com.acuerdo.channels.core.event.ChannelEventHandler
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.stereotype.Service

@Service
class WsChannelEventHandler(
        val messagingTemplate: SimpMessagingTemplate
) : ChannelEventHandler {
    override fun onChannelChanged(event: ChannelEvent) {
        sendUserChannelEvent(event.channel.sender, event)
        sendUserChannelEvent(event.channel.recipient, event)
    }

    private fun sendUserChannelEvent(to: String, event: ChannelEvent) {
        messagingTemplate.convertAndSend("/topic/user/$to/channels", event)
    }
}
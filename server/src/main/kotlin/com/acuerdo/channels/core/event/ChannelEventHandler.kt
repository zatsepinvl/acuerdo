package com.acuerdo.channels.core.event

interface ChannelEventHandler {
    fun onChannelChanged(channelEvent: ChannelEvent)
}
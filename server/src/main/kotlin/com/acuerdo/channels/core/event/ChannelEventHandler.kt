package com.acuerdo.channels.core.event

interface ChannelEventHandler {
    fun onChannelChanged(event: ChannelEvent)
}
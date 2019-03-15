package com.acuerdo.channels.web.service

import com.acuerdo.channels.web.ChannelResponse


interface ChannelWebService {
    fun getChannelById(channelId: String): ChannelResponse;
}
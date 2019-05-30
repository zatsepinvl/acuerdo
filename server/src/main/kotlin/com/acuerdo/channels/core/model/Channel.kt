package com.acuerdo.channels.core.model

import org.springframework.data.annotation.Id
import org.springframework.data.domain.Sort
import org.springframework.data.mongodb.repository.MongoRepository
import java.math.BigInteger
import java.time.Instant

data class Channel(
        @Id
        val channelId: String,
        val sender: String,
        val recipient: String,
        val value: BigInteger,
        var dueDate: Instant? = null,
        var createdAt: Instant? = null,
        val submittedAt: Instant = Instant.now(),
        var status: ChannelStatus = ChannelStatus.DRAFT,
        var refundToSender: BigInteger? = null,
        var releaseToRecipient: BigInteger? = null,
        var channelName: String?
)

enum class ChannelStatus {
    DRAFT,
    PENDING,
    OPENED,
    CLOSED,
    CANCELED
}

interface ChannelRepository : MongoRepository<Channel, String> {
    fun findAllBySenderOrRecipient(sender: String?, recipient: String?, sort: Sort): List<Channel>
}

fun ChannelRepository.getById(channelId: String): Channel {
    return this.findById(channelId).orElse(null)
            ?: throw IllegalArgumentException("Unable to find channel by id $channelId")
}


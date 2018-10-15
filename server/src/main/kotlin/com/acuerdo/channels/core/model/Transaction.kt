package com.acuerdo.channels.core.model

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.repository.MongoRepository
import java.time.Instant

data class Transaction(
        @Id
        val hash: String,
        val channelId: String,
        val from: String,
        val to: String,
        val event: TransactionEvent,
        var confirmedAt: Instant? = null,
        var status: TransactionStatus = TransactionStatus.SUBMITTED
)

enum class TransactionEvent {
    OPEN_CHANNEL,
    CLOSE_CHANNEL
}

enum class TransactionStatus {
    SUBMITTED,
    CONFIRMED,
}

interface TransactionRepository : MongoRepository<Transaction, String> {
    fun findAllByChannelId(channelId: String): List<Transaction>
}
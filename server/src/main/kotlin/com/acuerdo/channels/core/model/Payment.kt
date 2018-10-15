package com.acuerdo.channels.core.model

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.repository.MongoRepository
import java.math.BigInteger
import java.time.Instant

data class Payment(
        @Id
        val id: String,
        val channelId: String,
        val value: BigInteger,
        val createdAt: Instant = Instant.now(),
        val signature: String
)

interface PaymentRepository : MongoRepository<Payment, String> {
    fun findAllByChannelId(channelId: String): List<Payment>
}


package com.acuerdo.channels.web.controller

import com.acuerdo.channels.core.model.*
import com.acuerdo.channels.web.ChannelResponse
import com.acuerdo.channels.web.ChannelSaveRequest
import org.springframework.data.domain.Sort
import org.springframework.data.domain.Sort.by
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/channels")
class ChannelController(
        val channelRepository: ChannelRepository,
        val paymentRepository: PaymentRepository,
        val transactionRepository: TransactionRepository
) {

    @GetMapping("/{channelId}")
    fun getChannel(@PathVariable channelId: String): ChannelResponse {
        val channel = channelRepository.getById(channelId)
        val payments = paymentRepository.findAllByChannelId(channelId)
        val transactions = transactionRepository.findAllByChannelId(channelId)
        return ChannelResponse(channel, payments, transactions)
    }

    @GetMapping("/users/{username}")
    fun getChannels(@PathVariable username: String): List<Channel> {
        val sort = by(Sort.Direction.DESC, "submittedAt")
        return channelRepository.findAllBySenderOrRecipient(username, username, sort)
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun saveChannel(@RequestBody request: ChannelSaveRequest) {
        channelRepository.save(request.channel)
        transactionRepository.save(request.transaction)
    }

    @PostMapping("/{channelId}/payments")
    @ResponseStatus(HttpStatus.CREATED)
    fun savePayment(@PathVariable channelId: String, @RequestBody payment: Payment) {
        val channel = channelRepository.getById(channelId)
        paymentRepository.save(payment)
    }
}
package com.acuerdo.channels.web.controller

import com.acuerdo.channels.core.ChannelData
import com.acuerdo.channels.core.ChannelSaveData
import com.acuerdo.channels.core.PaymentSignature
import com.acuerdo.channels.core.model.Channel
import com.acuerdo.channels.core.model.ChannelRepository
import com.acuerdo.channels.core.model.Payment
import com.acuerdo.channels.core.model.Transaction
import com.acuerdo.channels.core.service.ChannelService
import com.acuerdo.channels.core.service.PaymentService
import org.springframework.data.domain.Sort
import org.springframework.data.domain.Sort.by
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/channels")
class ChannelController(
        val channelRepository: ChannelRepository,
        val channelService: ChannelService,
        val paymentService: PaymentService
) {

    @GetMapping("/{channelId}")
    fun getChannel(@PathVariable channelId: String): ChannelData {
        return channelService.getChannelDataById(channelId)
    }

    @GetMapping("/users/{username}")
    fun getChannels(@PathVariable username: String): List<Channel> {
        val sort = by(Sort.Direction.DESC, "submittedAt")
        return channelRepository.findAllBySenderOrRecipient(username, username, sort)
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun saveChannel(@RequestBody request: ChannelSaveData) {
        val (channel, transaction) = request
        channelService.saveChannel(channel, transaction)
    }

    @PutMapping("/{channelId}")
    fun closeChannel(@PathVariable channelId: String, @RequestBody transaction: Transaction) {
        channelService.closeChannel(channelId, transaction)
    }

    @PostMapping("/{channelId}/payments")
    @ResponseStatus(HttpStatus.CREATED)
    fun savePayment(@PathVariable channelId: String, @RequestBody payment: Payment): Payment {
        channelService.checkChannelExists(channelId)
        return paymentService.savePayment(payment)
    }

    @PutMapping("/{channelId}/payments/{paymentId}")
    fun signPayment(
            @PathVariable channelId: String,
            @PathVariable paymentId: String,
            @RequestBody paymentSignature: PaymentSignature
    ) {
        channelService.checkChannelExists(channelId)
        paymentService.signPaymentByRecipient(paymentId, paymentSignature)
    }
}
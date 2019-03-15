package com.acuerdo.channels.web.controller

import com.acuerdo.channels.core.model.*
import com.acuerdo.channels.core.service.PaymentService
import com.acuerdo.channels.web.ChannelResponse
import com.acuerdo.channels.web.ChannelSaveRequest
import com.acuerdo.channels.web.PaymentSignature
import com.acuerdo.channels.web.service.ChannelWebService
import com.acuerdo.common.web.BadRequestException
import com.acuerdo.common.web.ConflictException
import com.acuerdo.common.web.NotFoundException
import org.springframework.data.domain.Sort
import org.springframework.data.domain.Sort.by
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/channels")
class ChannelController(
        val channelRepository: ChannelRepository,
        val paymentRepository: PaymentRepository,
        val transactionRepository: TransactionRepository,
        val paymentService: PaymentService,
        val channelWebService: ChannelWebService
) {

    @GetMapping("/{channelId}")
    fun getChannel(@PathVariable channelId: String): ChannelResponse {
        return channelWebService.getChannelById(channelId)
    }

    @GetMapping("/users/{username}")
    fun getChannels(@PathVariable username: String): List<Channel> {
        val sort = by(Sort.Direction.DESC, "submittedAt")
        return channelRepository.findAllBySenderOrRecipient(username, username, sort)
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun saveChannel(@RequestBody request: ChannelSaveRequest) {
        val channelId = request.channel.channelId
        if (channelRepository.existsById(channelId)) {
            throw ConflictException("Channel with id $channelId exists ")
        }
        channelRepository.save(request.channel)
        transactionRepository.save(request.transaction)
    }

    @PutMapping("/{channelId}")
    fun closeChannel(@PathVariable channelId: String, @RequestBody transaction: Transaction) {
        checkChannelExists(channelId)
        if (transaction.event != TransactionEvent.CLOSE_CHANNEL) {
            throw BadRequestException("Transaction event must be ${TransactionEvent.CLOSE_CHANNEL}")
        }
        transactionRepository.save(transaction)
    }

    @PostMapping("/{channelId}/payments")
    @ResponseStatus(HttpStatus.CREATED)
    fun savePayment(@PathVariable channelId: String, @RequestBody payment: Payment): Payment {
        checkChannelExists(channelId)
        return paymentService.savePayment(payment)
    }

    @PutMapping("/{channelId}/payments/{paymentId}")
    fun signPayment(
            @PathVariable channelId: String,
            @PathVariable paymentId: String,
            @RequestBody paymentSignature: PaymentSignature
    ) {
        checkChannelExists(channelId)
        val payment = paymentRepository.findById(paymentId)
                .orElse(null) ?: throw NotFoundException("Unable to find payment with paymentId $paymentId")
        paymentService.addRecipientSignature(payment, paymentSignature.signature)
    }

    private fun checkChannelExists(channelId: String) {
        if (!channelRepository.existsById(channelId)) {
            throw BadRequestException("Channel with paymentId $channelId doesn't exist")
        }
    }

    private fun checkPaymentExists(channelId: String) {
        if (!channelRepository.existsById(channelId)) {
            throw BadRequestException("Channel with paymentId $channelId doesn't exist")
        }
    }
}
package com.acuerdo.channels.core.service

import com.acuerdo.channels.core.InvalidSignerException
import com.acuerdo.channels.core.PaymentSignature
import com.acuerdo.channels.core.model.ChannelRepository
import com.acuerdo.channels.core.model.Payment
import com.acuerdo.channels.core.model.PaymentRepository
import com.acuerdo.channels.core.model.getById
import com.acuerdo.common.service.ResourceNotFoundException
import com.acuerdo.web3.contract.Channels
import com.acuerdo.web3.core.EthSignatureService
import org.springframework.stereotype.Service
import org.web3j.utils.Numeric

interface PaymentService {
    fun savePayment(payment: Payment): Payment
    fun signPaymentByRecipient(paymentId: String, paymentSignature: PaymentSignature)
}

@Service
class PaymentServiceImpl(
        private val ethSignatureService: EthSignatureService,
        private val paymentRepository: PaymentRepository,
        private val channelRepository: ChannelRepository,
        private val channels: Channels
) : PaymentService {

    override fun savePayment(payment: Payment): Payment {
        val paymentId = channels.getPaymentId(
                Numeric.hexStringToByteArray(payment.channelId),
                payment.value
        ).send().let(Numeric::toHexString)
        if (!paymentId.equals(payment.paymentId, true)) {
            throw IllegalArgumentException("Payment paymentId must be hash of channelId||value")
        }
        val signer = ethSignatureService.getHashSigner(paymentId, payment.senderSignature)
        val channel = channelRepository.getById(payment.channelId)
        if (!signer.equals(channel.sender, true)) {
            throw InvalidSignerException("Signer must be sender ${channel.sender}, but was $signer.")
        }
        return paymentRepository.save(payment)
    }

    override fun signPaymentByRecipient(paymentId: String, paymentSignature: PaymentSignature) {
        val payment = paymentRepository.findById(paymentId)
                .orElse(null) ?: throw ResourceNotFoundException("Unable to find payment with paymentId $paymentId")
        addRecipientSignature(payment, paymentSignature.signature)
    }

    private fun addRecipientSignature(payment: Payment, signature: String) {
        val signer = ethSignatureService.getHashSigner(payment.paymentId, signature)
        val channel = channelRepository.getById(payment.channelId)
        if (!signer.equals(channel.recipient, true)) {
            throw InvalidSignerException("Signer must be recipient ${channel.recipient}, but was $signer.")
        }
        payment.recipientSignature = signature
        paymentRepository.save(payment)
    }
}
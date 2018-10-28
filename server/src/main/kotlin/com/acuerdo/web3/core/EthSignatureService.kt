package com.acuerdo.web3.core

import org.springframework.stereotype.Service
import org.web3j.crypto.Keys
import org.web3j.crypto.Sign
import org.web3j.utils.Numeric
import org.web3j.utils.Numeric.cleanHexPrefix
import org.web3j.utils.Numeric.hexStringToByteArray
import java.nio.charset.StandardCharsets.UTF_8

interface EthSignatureService {
    fun getMessageSigner(text: String, signature: String): String
    fun getHashSigner(hash: String, signature: String): String
}

private const val SIGNED_TEXT_TEMPLATE = "\u0019Ethereum Signed Message:\n%s"

@Service
class EthSignatureServiceImpl : EthSignatureService {
    override fun getMessageSigner(text: String, signature: String): String {
        val textBytes = String.format(SIGNED_TEXT_TEMPLATE, "${text.length}$text")
                .toByteArray(UTF_8)
        return getSigner(textBytes, signature)
    }

    override fun getHashSigner(hash: String, signature: String): String {
        val textBytes = String.format(SIGNED_TEXT_TEMPLATE, "32")
                .toByteArray(UTF_8) + hexStringToByteArray(hash)
        return getSigner(textBytes, signature)
    }

    private fun getSigner(textBytes: ByteArray, signature: String): String {
        val cleanSignature = cleanHexPrefix(signature)
        val r = hexStringToByteArray(cleanSignature.substring(0, 64))
        val s = hexStringToByteArray(cleanSignature.substring(64, 128))
        val v = hexStringToByteArray(cleanSignature.substring(128, 130))
        val vDecimal = Numeric.toBigInt(v).byteValueExact()
        val signatureData = Sign.SignatureData(vDecimal, r, s)
        val publicKey = Sign.signedMessageToKey(textBytes, signatureData)
                .toString(16)
        return "0x" + Keys.getAddress(publicKey)
    }
}
package com.acuerdo.security

import com.acuerdo.common.service.KeyValueTtlStorage
import com.acuerdo.utils.RandomStringUtils.randomString
import com.acuerdo.web3.core.EthSignatureService
import org.springframework.stereotype.Service
import java.time.Duration

private const val SIGNED_MESSAGE_PREFIX = "Acuerdo_"
private const val REQUEST_KEY_LENGHT = 16
private val REQUEST_DURATION = Duration.ofMinutes(30)

@Service
class AuthRequestServiceImpl(
        private val ethSignatureService: EthSignatureService,
        private val keyValueTtlStorage: KeyValueTtlStorage
) : AuthRequestService {


    override fun requestLogin(): LoginRequest {
        val signedMessage = SIGNED_MESSAGE_PREFIX + randomString(REQUEST_KEY_LENGHT)
        val requestId = keyValueTtlStorage.save(signedMessage, REQUEST_DURATION)
        return LoginRequest(signedMessage, requestId)
    }

    override fun login(login: Login) {
        val text = keyValueTtlStorage.get(login.requestId)
                ?: throw AuthenticationException("Request is wrong or expired.")
        if (ethSignatureService.getMessageSigner(text, login.signature) != login.account) {
            throw AuthenticationException("Sender address doesn't match signature address.")
        }
    }
}
package com.acuerdo.channels.web.security

import com.acuerdo.channels.web.AuthenticationException
import com.acuerdo.channels.web.Login
import com.acuerdo.web3.core.EthSignatureService
import org.springframework.stereotype.Service

@Service
class AuthRequestServiceImpl(
        private val ethSignatureService: EthSignatureService
) : AuthRequestService {
    override fun login(login: Login) {
        if (ethSignatureService.getMessageSigner(login.signedMessage, login.signature) != login.account) {
            throw AuthenticationException("Sender address doesn't match signature address.")
        }
    }
}
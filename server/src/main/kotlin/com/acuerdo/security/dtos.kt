package com.acuerdo.security

data class Login(
        val account: String,
        val signature: String,
        val signedMessage: String,
        val requestId: String
)

data class LoginRequest(
        val signedMessage: String,
        val requestId: String
)
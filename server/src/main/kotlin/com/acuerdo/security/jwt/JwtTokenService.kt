package com.acuerdo.security.jwt

import io.jsonwebtoken.Claims
import java.util.*
import javax.servlet.http.Cookie

interface JwtTokenService {
    fun <T> getClaim(token: String, claimsResolver: (Claims) -> T): T

    fun generateToken(username: String): String

    fun generateTokenCookie(token: String): Cookie

    fun generateTokenCookieFromUsername(username: String): Cookie {
        return generateTokenCookie(generateToken(username))
    }

    fun getUsername(token: String): String {
        return getClaim(token, Claims::getSubject)
    }

    fun getIssuedAtDate(token: String): Date {
        return getClaim(token, Claims::getIssuedAt)
    }

    fun getExpirationDate(token: String): Date {
        return getClaim(token, Claims::getExpiration)
    }

    fun canTokenBeRefreshed(token: String, lastPasswordReset: Date): Boolean

    fun refreshToken(token: String): String

    fun validateToken(token: String): Boolean
}
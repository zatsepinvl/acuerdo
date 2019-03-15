package com.acuerdo.channels.web.security.jwt

import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.util.*
import javax.servlet.http.Cookie

private val SIGNATURE_ALGORITHM = SignatureAlgorithm.HS512

@Service
class JwtTokenServiceImpl(
        @Value("\${security.jwt.secret}") private val secret: String,
        @Value("\${security.jwt.expiration}") private val expiration: Long
) : JwtTokenService {

    override fun <T> getClaim(token: String, claimsResolver: (Claims) -> T): T {
        val claims = getAllClaimsFromToken(token)
        return claimsResolver(claims)
    }

    override fun generateToken(username: String): String {
        val claims = HashMap<String, Any>()
        return doGenerateToken(claims, username)
    }

    override fun generateTokenCookie(token: String): Cookie {
        return Cookie(JWT_TOKEN_COOKIE_NAME, token)
                .apply {
                    isHttpOnly = true
                    maxAge = (expiration / 1000).toInt()
                    path = "/"
                }
    }

    private fun doGenerateToken(claims: Map<String, Any>, subject: String): String {
        val createdDate = Date()
        val expirationDate = calculateExpirationDate(createdDate)

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(createdDate)
                .setExpiration(expirationDate)
                .signWith(SIGNATURE_ALGORITHM, secret)
                .compact()
    }

    override fun canTokenBeRefreshed(token: String, lastPasswordReset: Date): Boolean {
        val created = getIssuedAtDate(token)
        return !isCreatedBeforeLastPasswordReset(created, lastPasswordReset) && (!isTokenExpired(token) || ignoreTokenExpiration(token))
    }

    override fun refreshToken(token: String): String {
        val createdDate = Date()
        val expirationDate = calculateExpirationDate(createdDate)

        val claims = getAllClaimsFromToken(token)
        claims.issuedAt = createdDate
        claims.expiration = expirationDate

        return Jwts.builder()
                .setClaims(claims)
                .signWith(SIGNATURE_ALGORITHM, secret)
                .compact()
    }

    override fun validateToken(token: String): Boolean {
        Jwts.parser().setSigningKey(secret).parseClaimsJws(token)
        return true
    }

    private fun getAllClaimsFromToken(token: String): Claims {
        return Jwts.parser()
                .setSigningKey(secret)
                .parseClaimsJws(token)
                .body
    }

    private fun isTokenExpired(token: String): Boolean {
        val expiration = getExpirationDate(token)
        return expiration.before(Date())
    }

    private fun isCreatedBeforeLastPasswordReset(created: Date, lastPasswordReset: Date?): Boolean {
        return lastPasswordReset != null && created.before(lastPasswordReset)
    }

    private fun ignoreTokenExpiration(token: String): Boolean {
        // here you specify tokens, for that the expiration is ignored
        return false
    }

    private fun calculateExpirationDate(createdDate: Date): Date {
        return Date(createdDate.time + expiration)
    }
}
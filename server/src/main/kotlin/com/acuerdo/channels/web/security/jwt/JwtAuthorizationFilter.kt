package com.acuerdo.channels.web.security.jwt

import com.acuerdo.channels.web.security.clearCookies
import io.jsonwebtoken.ExpiredJwtException
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.web.filter.OncePerRequestFilter
import javax.servlet.FilterChain
import javax.servlet.http.Cookie
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

class JwtAuthorizationFilter(
        private val jwtTokenService: JwtTokenService,
        private val userDetailsService: UserDetailsService
) : OncePerRequestFilter() {

    override fun doFilterInternal(
            request: HttpServletRequest,
            response: HttpServletResponse,
            chain: FilterChain
    ) {
        val authToken = (request.cookies ?: arrayOf()).toList()
                .filter { cookie -> cookie.name == JWT_TOKEN_COOKIE_NAME }
                .map(Cookie::getValue)
                .firstOrNull()
        var username: String? = null
        if (authToken != null) {
            try {
                username = jwtTokenService.getUsername(authToken)
            } catch (e: IllegalArgumentException) {
                logger.error("An error occurred during getting username from token.", e)
            } catch (e: ExpiredJwtException) {
                logger.warn("The JWT token is expired and not valid anymore.", e)
            }

        }
        if (username != null) {
            val authentication: Authentication
            try {
                val userDetails = userDetailsService.loadUserByUsername(username)
                authentication = UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.authorities
                )
            } catch (ex: UsernameNotFoundException) {
                SecurityContextHolder.clearContext()
                clearCookies(response, JWT_TOKEN_COOKIE_NAME)
                chain.doFilter(request, response)
                return
            }

            SecurityContextHolder.getContext().authentication = authentication
        }
        chain.doFilter(request, response)
    }


}

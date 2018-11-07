package com.acuerdo.channels.web.security

import com.acuerdo.channels.web.security.jwt.JwtAuthorizationFilter
import com.acuerdo.channels.web.security.jwt.JwtTokenService
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter
import org.springframework.security.config.http.SessionCreationPolicy.STATELESS
import org.springframework.security.web.AuthenticationEntryPoint
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import javax.servlet.http.HttpServletResponse.SC_UNAUTHORIZED

@Configuration
class SecurityConfig(
        jwtTokenService: JwtTokenService
) : WebSecurityConfigurerAdapter() {
    private val jwtTokenFilter: JwtAuthorizationFilter

    init {
        val userDetailsService = StatelessUserDetailsService()
        this.jwtTokenFilter = JwtAuthorizationFilter(jwtTokenService, userDetailsService)
    }

    @Throws(Exception::class)
    override fun configure(http: HttpSecurity) {
        http.requestMatchers()
                /**/.antMatchers("/channels/**", "/auth/me", "/ws/**")
                .and().addFilterBefore(jwtTokenFilter, UsernamePasswordAuthenticationFilter::class.java)
                .authorizeRequests().anyRequest().authenticated()
                .and().exceptionHandling().authenticationEntryPoint(createAuthenticationEntryPoint())
                .and().sessionManagement().sessionCreationPolicy(STATELESS)
                .and().csrf().disable()
    }

    private fun createAuthenticationEntryPoint(): AuthenticationEntryPoint {
        return AuthenticationEntryPoint { _, response, _ -> response.sendError(SC_UNAUTHORIZED, "Unauthorized") }
    }
}
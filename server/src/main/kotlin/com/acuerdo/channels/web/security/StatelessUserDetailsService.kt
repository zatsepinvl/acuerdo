package com.acuerdo.channels.web.security

import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.stereotype.Service

@Service
class StatelessUserDetailsService : UserDetailsService {

    override fun loadUserByUsername(username: String): UserDetails {
        return User(username.toLowerCase(), "", listOf(SimpleGrantedAuthority("USER")))
    }

}

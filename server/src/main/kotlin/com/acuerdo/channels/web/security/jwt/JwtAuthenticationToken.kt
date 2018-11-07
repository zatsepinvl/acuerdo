package com.acuerdo.channels.web.security.jwt

import org.springframework.security.authentication.AbstractAuthenticationToken
import org.springframework.security.core.GrantedAuthority

class JwtAuthenticationToken(authorities: MutableCollection<out GrantedAuthority>?) : AbstractAuthenticationToken(authorities) {
    override fun getCredentials(): Any {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }

    override fun getPrincipal(): Any {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }

}
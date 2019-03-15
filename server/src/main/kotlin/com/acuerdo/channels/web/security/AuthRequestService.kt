package com.acuerdo.channels.web.security

import com.acuerdo.channels.web.Login

interface AuthRequestService {
    fun login(login: Login)
}

package com.acuerdo.channels.web.service

import com.acuerdo.channels.web.Login

interface AuthRequestService {
    fun login(login: Login)
}

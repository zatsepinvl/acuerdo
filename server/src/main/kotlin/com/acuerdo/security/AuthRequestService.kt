package com.acuerdo.security


interface AuthRequestService {
    fun requestLogin(): LoginRequest
    fun login(login: Login)
}

package com.acuerdo.security

import org.springframework.util.StringUtils
import java.util.*
import javax.servlet.http.Cookie
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse


fun clearCookies(request: HttpServletRequest, response: HttpServletResponse, vararg cookies: String) {
    var cookiePath = request.contextPath
    if (!StringUtils.hasLength(cookiePath)) {
        cookiePath = "/"
    }
    clearCookies(cookiePath, response, *cookies)
}

fun clearCookies(response: HttpServletResponse, vararg cookies: String) {
    Arrays.stream(cookies)
            .map({ cookieName ->
                val cookie = Cookie(cookieName, null)
                cookie.path = "/"
                cookie.maxAge = 0
                cookie
            })
            .forEach(response::addCookie)
}

fun clearCookies(cookiePath: String, response: HttpServletResponse, vararg cookies: String) {
    Arrays.stream(cookies)
            .map({ cookieName ->
                val cookie = Cookie(cookieName, null)
                cookie.path = cookiePath
                cookie.maxAge = 0
                cookie
            })
            .forEach(response::addCookie)
}
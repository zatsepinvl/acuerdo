package com.acuerdo.security

import com.acuerdo.security.jwt.JWT_TOKEN_COOKIE_NAME
import com.acuerdo.security.jwt.JwtTokenService
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.User
import org.springframework.web.bind.annotation.*
import java.io.IOException
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse
import javax.validation.Valid


@RestController
@RequestMapping("/auth")
class AuthController(
        private val requestManger: AuthRequestService,
        private val jwtTokenService: JwtTokenService
) {

    @GetMapping("/login")
    fun loginRequest(): LoginRequest {
        return requestManger.requestLogin()
    }

    @PostMapping("/login")
    fun login(@Valid @RequestBody login: Login, response: HttpServletResponse) {
        requestManger.login(login)
        addJwtToCookie(response, login.account)
    }

    @PostMapping("/logout")
    fun logout(request: HttpServletRequest, response: HttpServletResponse) {
        SecurityContextHolder.clearContext()
        clearCookies(request, response, JWT_TOKEN_COOKIE_NAME)
    }

    @GetMapping("/me")
    fun me(@AuthenticationPrincipal user: User?): User? {
        return user
    }

    @ExceptionHandler(AuthenticationException::class)
    @Throws(IOException::class)
    fun handleAuthenticationException(response: HttpServletResponse) {
        response.sendError(HttpServletResponse.SC_UNAUTHORIZED)
    }

    private fun addJwtToCookie(response: HttpServletResponse, username: String) {
        val cookie = jwtTokenService.generateTokenCookieFromUsername(username)
        response.addCookie(cookie)
    }
}
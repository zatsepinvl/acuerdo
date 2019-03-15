package com.acuerdo.utils

import java.security.SecureRandom


object RandomStringUtils {

    private const val AB = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    private var random = SecureRandom()

    fun randomString(len: Int): String {
        val sb = StringBuilder(len)
        for (i in 1..len) {
            val nextInt = random.nextInt(AB.length)
            sb.append(AB[nextInt])
        }
        return sb.toString()
    }
}
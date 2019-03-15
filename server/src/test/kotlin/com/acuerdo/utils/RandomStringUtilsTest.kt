package com.acuerdo.utils

import org.junit.Assert.assertEquals
import org.junit.Test


internal class RandomStringUtilsTest {
    @Test
    fun random_string_exact_length() {
        val length = 6
        val resultStr = RandomStringUtils.randomString(length)
        assertEquals(length, resultStr.length)
    }
}
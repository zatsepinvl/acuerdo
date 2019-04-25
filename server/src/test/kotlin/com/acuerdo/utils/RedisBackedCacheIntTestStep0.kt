package com.acuerdo.utils

import org.junit.Before


class RedisBackedCacheIntTestStep0 {
    private var underTest: RedisBackedCache? = null

    @Before
    fun setUp() {
        // Assume that we have Redis running locally?
        underTest = RedisBackedCache("localhost", 6379)
    }

    @Test
    fun testSimplePutAndGet() {
        underTest!!.put("test", "example")

        val retrieved = underTest!!.get("test")
        assertEquals("example", retrieved)
    }
}
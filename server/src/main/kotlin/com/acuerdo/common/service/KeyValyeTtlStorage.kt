package com.acuerdo.common.service

import java.time.Duration


interface KeyValueTtlStorage {
    fun save(value: String, duration: Duration): String
    fun get(key: String): String?
}
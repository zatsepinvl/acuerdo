package com.acuerdo.common.service

import com.acuerdo.utils.RandomStringUtils
import org.springframework.data.redis.core.StringRedisTemplate
import org.springframework.stereotype.Service
import java.time.Duration
import java.util.concurrent.TimeUnit

private const val KEY_LENGTH = 16

@Service
class RedisKeyValueTtlStorage(
        val redis: StringRedisTemplate
) : KeyValueTtlStorage {
    override fun save(value: String, duration: Duration): String {
        val key = RandomStringUtils.randomString(KEY_LENGTH)
        redis.opsForValue().set(key, value, duration.toMillis(), TimeUnit.MILLISECONDS)
        return key
    }

    override fun get(key: String): String? {
        return redis.opsForValue().get(key)
    }
}
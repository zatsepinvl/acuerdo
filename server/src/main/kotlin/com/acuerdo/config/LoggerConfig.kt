package com.acuerdo.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import java.util.logging.Logger

@Configuration
class LoggerConfig {
    @Bean
    fun logger(): Logger {
        return Logger.getLogger("com.acuerdo")
    }
}
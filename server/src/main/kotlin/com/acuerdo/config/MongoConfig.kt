package com.acuerdo.config

import com.acuerdo.web3.core.Web3Settings
import com.mongodb.MongoClient
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.data.mongodb.MongoDbFactory
import org.springframework.data.mongodb.core.MongoTemplate


@Configuration
class MongoConfig {
    @Bean
    fun mongoTemplate(mongoClient: MongoClient, mongoDbName: String): MongoTemplate {
        return MongoTemplate(mongoClient, mongoDbName)
    }

    @Bean
    fun mongoDbName(mongoDbFactory: MongoDbFactory, web3Settings: Web3Settings): String {
        return mongoDbFactory.db.name + "_" + web3Settings.netId
    }
}
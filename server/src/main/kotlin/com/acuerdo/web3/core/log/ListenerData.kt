package com.acuerdo.web3.core.log

import org.springframework.data.mongodb.repository.MongoRepository
import java.math.BigInteger

data class ListenerData(
        val id: String,
        val lastBlock: BigInteger
)

interface ListenerDataRepository : MongoRepository<ListenerData, String>
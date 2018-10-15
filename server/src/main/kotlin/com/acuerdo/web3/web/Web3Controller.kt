package com.acuerdo.web3.web

import com.acuerdo.common.web.NotFoundException
import com.acuerdo.web3.contract.Channels
import com.acuerdo.web3.core.Web3Settings
import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.cache.annotation.Cacheable
import org.springframework.core.io.ResourceLoader
import org.springframework.http.CacheControl
import org.springframework.http.MediaType.APPLICATION_JSON
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController


@RestController
@RequestMapping("/web3")
class Web3Controller(
        private val resourceLoader: ResourceLoader,
        private val web3Settings: Web3Settings,
        private val addresses: MutableMap<String, String> = mutableMapOf()
) {

    @Autowired
    fun init(channels: Channels) {
        addresses["channels"] = channels.contractAddress
    }

    @GetMapping("/settings")
    fun getWeb3Settings(): Web3Settings {
        return web3Settings
    }

    @GetMapping("/contracts/{contractName}")
    @Cacheable(value = ["contractByName"])
    fun getContractByName(@PathVariable contractName: String): ResponseEntity<Contract> {
        val contractPath = "classpath:contracts/$contractName.json"
        val contractResource = resourceLoader.getResource(contractPath)
        if (!contractResource.exists()) {
            throw NotFoundException("Unable to find contract JSON by name: $contractName")
        }
        val contractJson = ObjectMapper().readValue(contractResource.inputStream, Map::class.java)
        val abi = contractJson["abi"]
                ?: throw IllegalStateException("Unable to get abi from contractJson json $contractPath")
        val address = addresses[contractName] ?: throw IllegalStateException("Contract address is not set")
        val contract = Contract(abi, address)
        return buildResponse(contract)
    }

    private fun buildResponse(contractInfo: Contract): ResponseEntity<Contract> {
        return ResponseEntity.ok()
                .contentType(APPLICATION_JSON)
                .cacheControl(CacheControl.noCache())
                .eTag(contractInfo.address)
                .body(contractInfo)
    }

}

data class Contract(
        val abi: Any,
        val address: String
)
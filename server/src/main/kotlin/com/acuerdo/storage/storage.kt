package com.acuerdo.storage

import com.mongodb.BasicDBObject
import org.bson.Document
import org.springframework.data.mongodb.core.ReactiveMongoTemplate
import org.springframework.stereotype.Service
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Flux
import reactor.core.publisher.toFlux

@RestController
class StorageController(val storageService: StorageService) {
    @GetMapping("/{collection}")
    fun getData(
            @PathVariable collection: String,
            @RequestParam(required = false) query: String?
    ): Flux<out Any> {
        return storageService.getData(collection, query)
    }

    @PostMapping("/{collection}")
    fun saveData(
            @PathVariable collection: String,
            @RequestBody data: List<Document>
    ): Flux<out Any> {
        return storageService.saveData(collection, data)
    }
}

@Service
class StorageService(val mongo: ReactiveMongoTemplate){
    fun getData(collection: String, query: String?): Flux<out Any> {
        val filter =
                if (query != null) BasicDBObject.parse(query)
                else BasicDBObject()
        return mongo.getCollection(collection).find(filter).toFlux()
                .doOnNext { it["id"] = it["_id"].toString(); it.remove("_id") }
    }

    fun saveData(collection: String, data: List<Document>): Flux<out Any> {
        return mongo.getCollection(collection).insertMany(data).toFlux()
    }
}
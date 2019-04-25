package com.acuerdo.common.web

import com.acuerdo.common.service.ResourceNotFoundException
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler

@ControllerAdvice
class CommonExceptionHandler {

    @ExceptionHandler(IllegalStateException::class)
    fun conflict(exception: IllegalStateException) {
        throw ConflictWebException(exception)
    }

    @ExceptionHandler(ResourceNotFoundException::class)
    fun notFound(exception: ResourceNotFoundException) {
        throw NotFoundWebException(exception)
    }

    @ExceptionHandler(IllegalArgumentException::class)
    fun notFound(exception: IllegalArgumentException) {
        throw ConflictWebException(exception)
    }

}
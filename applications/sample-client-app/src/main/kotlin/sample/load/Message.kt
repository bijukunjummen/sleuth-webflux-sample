package sample.load

import com.fasterxml.jackson.annotation.JsonProperty
import java.util.UUID

data class Message(
        val id: String = UUID.randomUUID().toString(),
        val payload: String,
        val delay: Long,
        @field:JsonProperty("throw_exception") val throwException: Boolean = false
)
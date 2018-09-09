package sample.load

import com.fasterxml.jackson.annotation.JsonProperty

data class MessageAck(val id: String, 
                      val received: String, 
                      val ack: String,
                      @field:JsonProperty("error_message") val errorMessage: String? = null)
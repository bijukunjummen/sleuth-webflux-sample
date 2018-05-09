package sample.load

import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.web.reactive.function.BodyInserters.fromObject
import org.springframework.web.reactive.function.client.ClientResponse
import org.springframework.web.reactive.function.client.WebClient
import org.springframework.web.reactive.function.client.bodyToMono
import org.springframework.web.reactive.function.server.ServerRequest
import org.springframework.web.reactive.function.server.ServerResponse
import org.springframework.web.reactive.function.server.bodyToMono
import reactor.core.publisher.Mono

class PassThroughHandler(private val webClient: WebClient) {

    private val logger: Logger = LoggerFactory.getLogger(PassThroughHandler::class.java)
    
    fun handle(serverRequest: ServerRequest): Mono<ServerResponse> {
        val messageMono = serverRequest.bodyToMono<Message>()
        return messageMono.flatMap { message ->
            logger.info("handling message: {}", message)
            
            passThrough(message)
                    .flatMap { messageAck ->
                        ServerResponse.ok().body(fromObject(messageAck))
                    }
        }
    }

    fun passThrough(message: Message): Mono<MessageAck> {
        return webClient.post()
                .uri("/messages")
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                .body(fromObject(message))
                .exchange()
                .flatMap { response: ClientResponse ->
                    response.bodyToMono<MessageAck>()
                }
    }
}
package sample.load

import io.micrometer.core.instrument.Metrics
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.web.reactive.function.BodyInserters.fromObject
import org.springframework.web.reactive.function.server.ServerRequest
import org.springframework.web.reactive.function.server.ServerResponse
import org.springframework.web.reactive.function.server.bodyToMono
import reactor.core.publisher.Mono
import java.time.Duration

@Service
class MessageHandler {

    private val logger: Logger = LoggerFactory.getLogger(MessageHandler::class.java)
    
    private val counter = Metrics.counter("handler.calls", "uri", "/messages")

    fun handleMessage(req: ServerRequest): Mono<ServerResponse> {
        return req.bodyToMono<Message>().flatMap { m ->
            logger.info("Handling message: {}", m)
            counter.increment()
            Mono
                    .fromCallable { MessageAck(id = m.id, received = m.payload, ack = "ack") }
                    .delayElement(Duration.ofMillis(m.delay))
                    .flatMap { messageAck ->
                        ServerResponse
                                .status(HttpStatus.OK)
                                .body(fromObject(messageAck))
                    }
        }
    }

}
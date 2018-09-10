package sample.load

import com.github.tomakehurst.wiremock.WireMockServer
import com.github.tomakehurst.wiremock.client.WireMock.aResponse
import com.github.tomakehurst.wiremock.client.WireMock.equalTo
import com.github.tomakehurst.wiremock.client.WireMock.matching
import com.github.tomakehurst.wiremock.client.WireMock.post
import com.github.tomakehurst.wiremock.client.WireMock.postRequestedFor
import com.github.tomakehurst.wiremock.client.WireMock.urlEqualTo
import com.github.tomakehurst.wiremock.client.WireMock.urlMatching
import com.github.tomakehurst.wiremock.core.WireMockConfiguration
import org.junit.jupiter.api.AfterAll
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.util.TestPropertyValues
import org.springframework.context.ApplicationContextInitializer
import org.springframework.context.ConfigurableApplicationContext
import org.springframework.http.HttpStatus
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.context.junit.jupiter.SpringExtension
import org.springframework.test.web.reactive.server.WebTestClient
import org.springframework.web.reactive.function.BodyInserters.fromObject


@ExtendWith(SpringExtension::class)
@SpringBootTest
@ContextConfiguration(initializers = [PassThroughMessageHandlerTest.Initializer::class])
@AutoConfigureWebTestClient
class PassThroughMessageHandlerTest {

    @Autowired
    private lateinit var webTestClient: WebTestClient

    companion object {
        val wiremockServer = WireMockServer(WireMockConfiguration.wireMockConfig().dynamicPort());

        @BeforeAll
        @JvmStatic
        fun before() {
            wiremockServer.start()
        }

        @AfterAll
        @JvmStatic
        fun after() {
            wiremockServer.stop()
        }

    }

    @Test
    @DisplayName("test a passthrough call")
    fun testPassThroughCall() {

        wiremockServer.stubFor(post(urlEqualTo("/messages"))
                .withHeader("Accept", equalTo("application/json"))
                .willReturn(aResponse()
                        .withStatus(200)
                        .withHeader("Content-Type", "application/json")
                        .withBody(""" 
                         | {
                         |   "id": "1",
                         |   "received": "one",
                         |   "ack": "ack"
                         | }
                        """.trimMargin())))

        webTestClient.post()
                .uri("/passthrough/messages")
                .body(fromObject(Message("1", "one", 0)))
                .exchange()
                .expectStatus().isOk
                .expectBody()
                .json(""" 
                    | {
                    |   "id": "1",
                    |   "received": "one",
                    |   "ack": "ack"
                    | }
                """.trimMargin())

        wiremockServer.verify(postRequestedFor(urlMatching("/messages"))
                .withRequestBody(matching(".*one.*"))
                .withHeader("Content-Type", matching("application/json")))
    }

    @Test
    @DisplayName("test a passthrough call with backend error")
    fun testWithException() {

        wiremockServer.stubFor(post(urlEqualTo("/messages"))
                .withHeader("Accept", equalTo("application/json"))
                .willReturn(aResponse()
                        .withStatus(HttpStatus.INTERNAL_SERVER_ERROR.value())
                        .withHeader("Content-Type", "text/plain")
                        .withBody("Something is wrong!!")))


        webTestClient.post()
                .uri("/passthrough/messages")
                .body(fromObject(Message("1", "one", 0)))
                .exchange()
                .expectStatus().is2xxSuccessful
                .expectBody()
                .json(""" 
                    | {
                    |   "id": "1",
                    |   "received": "one",
                    |   "ack": "",
                    |   "error_message": "500: Something is wrong!!"
                    | }
                """.trimMargin())

        wiremockServer.verify(postRequestedFor(urlMatching("/messages"))
                .withRequestBody(matching(".*one.*"))
                .withHeader("Content-Type", matching("application/json")))
    }

    @Test
    @DisplayName("test with no backend and connection refused errors")
    fun testWithNoBackend() {
        wiremockServer.stop()
        webTestClient.post()
                .uri("/passthrough/messages")
                .body(fromObject(Message("1", "one", 0)))
                .exchange()
                .expectStatus().is5xxServerError
                

    }

    internal class Initializer : ApplicationContextInitializer<ConfigurableApplicationContext> {
        override fun initialize(configurableApplicationContext: ConfigurableApplicationContext) {
            TestPropertyValues.of(
                    "loadtarget.url=" + "http://localhost:" + wiremockServer.port()
            ).applyTo(configurableApplicationContext.environment)
        }
    }
}
package sample.load.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.io.Resource
import org.springframework.web.reactive.function.server.ServerResponse.ok
import org.springframework.web.reactive.function.server.router
import sample.load.PassThroughHandler

@Configuration
class RoutesConfig {
    @Value("classpath:/static/index.html")
    private lateinit var indexHtml: Resource

    @Bean
    fun apis(passThroughHandler: PassThroughHandler) = router {
        POST("/passthrough/messages", passThroughHandler::handle)
        GET("/", {ok().syncBody(indexHtml)})
    }
    
}

package org.bk.samples

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Bean

@SpringBootApplication
class HostRewriteGatewayApplication {
    @Bean
    fun rewriteProperties() = RewriteProperties()
}

fun main(args: Array<String>) {
    runApplication<HostRewriteGatewayApplication>(*args)
}

package org.bk.samples

import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder
import org.springframework.cloud.gateway.route.builder.filters
import org.springframework.cloud.gateway.route.builder.routes
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class RouteConfig(val rewriteProperties: RewriteProperties) {

    @Bean
    fun gatewayRoutes(builder: RouteLocatorBuilder) = builder.routes {
        route { 
            filters { 
                addRequestHeader("Host", rewriteProperties.upstreamHostHeader)
            }
            uri(rewriteProperties.upstreamUri)
        }    
    }
        
}
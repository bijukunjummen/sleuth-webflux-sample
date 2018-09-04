package org.bk.samples

import org.springframework.boot.context.properties.ConfigurationProperties


@ConfigurationProperties(prefix = "rewrite")
class RewriteProperties {
    lateinit var upstreamUri: String
    lateinit var upstreamHostHeader: String
}
package org.bk.samples

import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.junit.jupiter.SpringExtension

@ExtendWith(SpringExtension::class)
@SpringBootTest(properties = [
    "rewrite.upstreamUri=http://someuri",
    "rewrite.upstreamHostHeader=someheader"])
class ApplicationTests {

    @Test
    fun contextLoads() {
    }
    
    
}

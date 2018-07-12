package simulations

import java.util.UUID

import io.gatling.core.Predef._
import io.gatling.http.Predef._

import scala.concurrent.duration._
import scala.util.Random

class BootLoadSimulation extends Simulation {

  val baseUrl = System.getProperty("TARGET_URL")
  val sim_users = System.getProperty("SIM_USERS").toInt

  val httpConf = http.baseURL(baseUrl)
  
  private val rnd: Random = new Random()

  val headers = Map("Accept" -> """application/json""")

  val passThroughPage = repeat(500) {
    exec(http("passthrough-messages")
      .post("/passthrough/messages")
        .header("Content-Type", "application/json" )
      .body(StringBody("""{"id": "${randomId}", "payload": "test payload", "delay": ${randomDelay}}""")))
      .pause(100 millis, 200 millis)
  }

  val randomFeed = Iterator.continually(Map("randomId" -> UUID.randomUUID(), "randomDelay" -> rnd.nextInt(1001)))

  val scn = scenario("Passthrough Page")
    .feed(randomFeed)
    .exec(passThroughPage)

  setUp(scn.inject(atOnceUsers(sim_users)).protocols(httpConf))
}

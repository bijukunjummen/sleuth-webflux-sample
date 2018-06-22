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

  val passThroughPage = repeat(10) {
    exec(http("passthrough-messages")
      .post("/passthrough/messages")
        .header("Content-Type", "application/json" )
      .body(StringBody(
        s"""
           | {
           |   "id": "${UUID.randomUUID().toString}",
           |   "payload": "test payload",
           |   "delay": ${rnd.nextInt(1001)} 
           | }
        """.stripMargin)))
      .pause(1 second, 2 seconds)
  }

  val scn = scenario("Passthrough Page")
    .exec(passThroughPage)

  setUp(scn.inject(rampUsers(sim_users).over(2 minutes)).protocols(httpConf))
}

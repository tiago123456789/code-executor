require("dotenv").config({ path: ".env" })
require("./BuildDocikerImageCompletedConsumer")
require("./CollectExecutionsOutputConsumer")

console.log("Loaded consumers!!!")
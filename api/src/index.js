require("dotenv").config({ path: ".env" })
const express = require("express");
const app = express();
const buildDockerImageQueue = require("./config/Queue")("build_docker_image")

const clientDB = require("./config/Database")

app.use(express.json())

app.get("/scripts", async (req, res) => {
    const scripts = await clientDB("scripts")
    res.json({
        data: scripts,
    })
})


app.get("/scripts/:id/exections", async (req, res) => {
    const scripts = await clientDB("executions")
            .where("script_id", req.params.id)
            .orderBy("id", "desc")
            .limit(10)
    res.json({
        data: scripts,
    })
})

app.post("/scripts", async (req, res) => {
    const data = req.body;
    data.last_execution = new Date()

    if (data.intervalToRun < 60) {
        return res.status(400).json({
            message: ["The field intervalToRun needs value more than 60."]
        })
    }

    const scriptCreated = await clientDB("scripts").insert({
        code: Buffer.from(data.code, "base64").toString("utf-8"),
        last_execution: data.last_execution,
        interval_to_run: data.intervalToRun
    }).returning("*")

    await buildDockerImageQueue.add({
        code: data.code,
        id: scriptCreated[0].id
    }, {
        attempts: 2,
        removeOnComplete: true
    })
    res.sendStatus(201)
})

app.listen(3000, () => console.log(`Server is running at http://localhost:3000`))
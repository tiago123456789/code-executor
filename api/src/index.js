require("dotenv").config({ path: ".env" })
const express = require("express");
const cors = require("cors")
const app = express();
const buildDockerImageQueue = require("./config/Queue")("build_docker_image")
const scriptRunQueue = require("./config/Queue")("scripts_run")
const tryOutCodeQueue = require("./config/Queue")("try_out_code")

const { randomUUID } = require("crypto")
const clientDB = require("./config/Database");
const { TYPE_TRIGGER } = require("./utils/type");

app.use(express.json())
app.use(cors("*"))

app.post("/try-out-scripts", async (req, res) => {
    try {
        const body = req.body;

        const job = await tryOutCodeQueue.add({
            code: body.code,
            sessionId: body.sessionId,
            loadEnvs: body.loadEnvs,
            token: body.token
        }, {
            attempts: 1,
            removeOnComplete: true,
        });
    
        const data = await job.finished();
        res.json(data.result);
    } catch(error) {
        res.status(500).json({ error: "Yout script take more than or equal 5 seconds" })
    }

})

app.get("/scripts", async (req, res) => {
    const scripts = await clientDB("scripts")
    res.json({
        data: scripts,
    })
})


app.get("/scripts/:id/executions", async (req, res) => {
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
        interval_to_run: data.intervalToRun,
        trigger: data.trigger,
        secret_manager_token: data.token
    }).returning("*")

    await buildDockerImageQueue.add({
        code: data.code,
        id: scriptCreated[0].id,
        secret_manager_token: data.token || null
    }, {
        attempts: 2,
        removeOnComplete: true
    });

    const isHttpTrigger = data.trigger === TYPE_TRIGGER.HTTP
    if (isHttpTrigger) {
        const httpUrl = await clientDB("http_urls_trigger_scripts").insert({
            code_id: scriptCreated[0].id,
            key: randomUUID(),
        }).returning("*")
        return res.status(201).json({
            urlTrigger: `${process.env.URL_TRIGGER_CRONJOB_VIA_HTTP}${httpUrl[0].id}?key=${httpUrl[0].key}`
        })
    }


    return res.sendStatus(201)
})

app.post("/scripts-triggers/:hash", async (req, res) => {
    const query = req.query
    const params = req.params
    const body = req.body

    let httpTrigger = await clientDB("http_urls_trigger_scripts")
        .where("id", params.hash)
        .limit(1)

    httpTrigger = httpTrigger[0];

    if (!httpTrigger) {
        return res.json({
            message: "Link is invalid!"
        })
    }

    if (httpTrigger && query.key !== httpTrigger.key) {
        return res.json({
            message: "Invalid request!"
        })
    }

    let scriptCreated = await clientDB("scripts")
        .where("id", httpTrigger.code_id)
        .limit(1)

    scriptCreated = scriptCreated[0]
    if (!scriptCreated.enabled) {
        return res.json({
            message: "Script is not ready!"
        })
    }

    await scriptRunQueue.add({
        id: scriptCreated.id,
        secret_manager_token: scriptCreated.secret_manager_token,
        event: body
    }, {
        attempts: 2,
        removeOnComplete: true
    });

    res.sendStatus(200)
})

app.listen(3000, () => console.log(`Server is running at http://localhost:3000`))
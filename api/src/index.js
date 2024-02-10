require("dotenv").config({ path: ".env" })
const express = require("express");
const cors = require("cors")
const app = express();
const yup = require("yup")
const generateUrlTriggerScript = require("./utils/GenerateUrlTriggerScript")
const { QUEUE_TRY_OUT_CODE, QUEUE_BUILD_DOCKER_IMAGE, QUEUE_SCRIPT_RUN } = require("./constants/Queue");
const buildDockerImageQueue = require("./config/Queue")(QUEUE_BUILD_DOCKER_IMAGE)
const tryOutCodeQueue = require("./config/Queue")(QUEUE_TRY_OUT_CODE)
const scriptRunQueue = require("./config/Queue")(QUEUE_SCRIPT_RUN)
const { randomUUID } = require("crypto")
const { TYPE_TRIGGER } = require("./utils/type");
const codeUtil = require("./utils/Code")
const ScriptRepository = require("./repositories/ScriptRepository");

app.use(express.json())
app.use(cors("*"))

const scriptRepository = new ScriptRepository()

app.post("/try-out-scripts", async (req, res) => {
    try {
        const body = req.body;

        const code = Buffer.from(body.code, "base64").toString("utf-8");
        if (!codeUtil.hasFunctionStart(code)) {
            return res.status(400).json({ data: ["You need declare funtion call 'start' to continue."] })
        }

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
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

app.get("/scripts", async (req, res) => {
    const scripts = await scriptRepository.getAll()
    res.json({
        data: scripts,
    })
})

app.get("/scripts/:id/executions", async (req, res) => {
    const scripts = await scriptRepository.getLast10ExectuionsByScriptId(
        req.params.id
    )
    res.json({
        data: scripts,
    })
})

app.post("/scripts", async (req, res) => {
    const data = req.body;
    data.last_execution = new Date()

    const scriptSchema = yup.object().shape({
        code: yup.string().required(),
        trigger: yup.string().oneOf([TYPE_TRIGGER.CRON, TYPE_TRIGGER.HTTP]),
        intervalToRun: yup.number().min(60, "The field intervalToRun needs value more than 60.").required()
    })


    try {
        await scriptSchema.validate(data, { abortEarly: true })
    } catch (error) {
        return res.status(400).json({ data: error.errors })
    }

    const code = Buffer.from(data.code, "base64").toString("utf-8");
    if (!codeUtil.hasFunctionStart(code)) {
        return res.status(400).json({ data: ["You need declare funtion call 'start' to continue."] })
    }

    const scriptCreated = await scriptRepository.create({
        code,
        last_execution: data.last_execution,
        interval_to_run: data.intervalToRun,
        trigger: data.trigger,
        secret_manager_token: data.token
    })

    await buildDockerImageQueue.add({
        code: data.code,
        id: scriptCreated.id,
        secret_manager_token: data.token || null
    }, {
        attempts: 2,
        removeOnComplete: true
    });

    const isHttpTrigger = data.trigger === TYPE_TRIGGER.HTTP
    if (isHttpTrigger) {
        const httpUrl = await scriptRepository.createHttpUrlTriggerScript({
            code_id: scriptCreated.id,
            key: randomUUID(),
        })
        return res.status(201).json({
            urlTriggerCode: generateUrlTriggerScript.generate(httpUrl)
        })
    }

    return res.sendStatus(201)
})

app.post("/scripts-triggers/:hash", async (req, res) => {
    const query = req.query
    const params = req.params
    const body = req.body

    let httpTrigger = await scriptRepository.getHttpUrlTriggerById(params.hash)
    if (!httpTrigger) {
        return res.status(400).json({
            message: "Link is invalid!"
        })
    }

    const isInvalidKey = httpTrigger && query.key !== httpTrigger.key
    if (isInvalidKey) {
        return res.status(400).json({
            message: "Invalid request!"
        })
    }

    let scriptCreated = await scriptRepository.getScriptById(httpTrigger.code_id)
    if (!scriptCreated.enabled) {
        return res.status(400).json({
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

    res.sendStatus(202)
})

app.listen(3000, () => console.log(`Server is running at http://localhost:3000`))
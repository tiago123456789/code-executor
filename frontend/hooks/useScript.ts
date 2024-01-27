import ScriptService from "@/services/Script";
import { useState } from "react";
import * as uuid from "uuid"

const DEFAULT_CODE = `function start(event, logger) {  }`
const DEFAULT_CRONJOB = 'CRON'
const DEFAULT_INTERVAL = "60"
const TIMEOUT_REMOVE_URLTRIGGER_CODE = 20000

const scriptService = new ScriptService()

export default function useScript() {
    const [interval, setInterval] = useState(DEFAULT_INTERVAL)
    const [code, setCode] = useState(DEFAULT_CODE);
    const [trigger, setTrigger] = useState(DEFAULT_CRONJOB);
    const [output, setOutput] = useState(null)
    const [sessionId, setSessionId] = useState(uuid.v4())
    const [isExecuteCode, setIsExecuteCode] = useState(false)
    const [loadEnvs, setLoadEnvs] = useState('0')
    const [token, setToken] = useState<string | null>(null)
    const [urlToTriggerCode, setUrlToTriggerCode] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [scripts, setScripts] = useState([])
    const [executions, setExecutions] = useState([])

    const getExecutions = async (id: String) => {
        const data = await scriptService.getLast10ExectuionsByScriptId(id)
        setExecutions(data)
    }

    const getScripts = async () => {
        const data = await scriptService.getAll()
        setScripts(data)
    }

    const submit = async (event: { [key: string]: any }) => {
        event.preventDefault()
        setIsLoading(true)
        const data = {
            code: btoa(code),
            intervalToRun: interval,
            trigger,
            token
        }

        const response = await scriptService.create(data)
        if (response.urlTriggerCode) {
            setUrlToTriggerCode(response.urlTriggerCode)
        }
        setInterval(DEFAULT_INTERVAL)
        setCode(DEFAULT_CODE)
        setTrigger(DEFAULT_CRONJOB)
        setToken(null)
        setIsExecuteCode(false)
        setSessionId(uuid.v4())
        setOutput("")
        setIsLoading(false)

        setTimeout(() => {
            setUrlToTriggerCode(null)
        }, TIMEOUT_REMOVE_URLTRIGGER_CODE)

    }

    const tryOutScript = async (event: { [key: string]: any }) => {
        event.preventDefault()
        setIsExecuteCode(true)
        const data = await scriptService.tryOut({
            code: btoa(code),
            sessionId,
            loadEnvs: (loadEnvs === '1' ? true : false),
            token
        })

        setOutput(data.output)
        setIsExecuteCode(false)
    }

    return {
        getExecutions,
        executions,
        getScripts,
        scripts,
        urlToTriggerCode,
        isLoading,
        tryOutScript,
        submit,
        interval,
        setInterval,
        code,
        setCode,
        trigger,
        setTrigger,
        output,
        setOutput,
        sessionId,
        setSessionId,
        isExecuteCode,
        setIsExecuteCode,
        loadEnvs,
        setLoadEnvs,
        token,
        setToken
    }
}
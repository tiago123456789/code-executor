"use client"

import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
import { useState } from 'react';
import * as uuid from "uuid"
import SensitiveDataAlert from '@/components/SensitiveDataAlert';
import OutputScript from '@/components/OutputScript';
import ScriptService from '@/services/Script';
import Link from 'next/link';

const DEFAULT_CODE = `function start(event, logger) {  }`
const DEFAULT_CRONJOB = 'CRON'
const DEFAULT_INTERVAL = "60"

const scriptService = new ScriptService()

export default function Home() {
  const [interval, setInterval] = useState(DEFAULT_INTERVAL)
  const [code, setCode] = useState(DEFAULT_CODE);
  const [trigger, setTrigger] = useState(DEFAULT_CRONJOB);
  const [output, setOutput] = useState(null)
  const [sessionId, setSessionId] = useState(uuid.v4())
  const [isExecuteCode, setIsExecuteCode] = useState(false)
  const [loadEnvs, setLoadEnvs] = useState('0')
  const [token, setToken] = useState<string | null>(null)

  const isNeedsToken = () => {
    return (loadEnvs === '1' ? true : false)
  }

  const isCronJobTrigger = () => {
    return trigger === DEFAULT_CRONJOB
  }

  const submit = async (event: { [key: string]: any }) => {
    event.preventDefault()
    const data = {
      code: btoa(code),
      intervalToRun: interval,
      trigger,
      token
    }

    await scriptService.create(data)
    setInterval(DEFAULT_INTERVAL)
    setCode(DEFAULT_CODE)
    setTrigger(DEFAULT_CRONJOB)
    setToken(null)
    setIsExecuteCode(false)
    setSessionId(uuid.v4())
    setOutput("")
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

  return (
    <div style={{
      margin: "10px"
    }}>
      <SensitiveDataAlert />
      <Link href={'/scripts'} className='btn btn-primary'>
        List scripts
      </Link>
      <br />
      <br />
      <h2>Create a new script</h2>
      <form>
        <Editor
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 12,
            border: "1px solid red",
            background: "rgba(0,0,0, .1)",
          }}
          value={code}
          onValueChange={code => setCode(code)}
          highlight={code =>
            highlight(code, languages.js)
          }
          padding={10}
        />
        <br />
        <label >Load envs?</label>
        <select
          value={loadEnvs}
          onChange={(event) => setLoadEnvs(event.target.value)}
          className='form-control'>
          <option value={'1'}>Yes</option>
          <option value={'0'} defaultChecked >No</option>
        </select>
        <br />
        {
          isNeedsToken() &&
          <>
            <label >Secret manager token</label>
            <input
              value={token}
              onChange={(event) => setToken(event.target.value)}
              type="text" className='form-control'
            />
            <br />
          </>
        }

        <label >How to trigger?</label>
        <select
          value={trigger}
          className='form-control'
          onChange={(event) => setTrigger(event.target.value)}
        >
          <option value="CRON">Cronjob</option>
          <option value="HTTP">Http</option>
        </select>
        <br />

        {isCronJobTrigger() &&
          <>
            <label >Interval to execute?</label>
            <input type='number'
              className='form-control'
              min={60}
              value={interval}
              onChange={event => setInterval(event.target.value)} />
            <br />
          </>
        }

        <br />
        <button onClick={submit} className='btn btn-primary'>Save</button>&nbsp;
        <button onClick={tryOutScript} className='btn btn-danger'>
          {(isExecuteCode ? 'Executing...' : 'Execute code')}
        </button>
      </form>
      <br />
      <OutputScript output={output} />
    </div>
  )
}

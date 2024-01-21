"use client"

import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
import { useState } from 'react';
import * as uuid from "uuid"
import axios from 'axios';

const DEFAULT_CODE = `function start(event, logger) {  }`
const DEFAULT_CRONJOB = 'CRON'

export default function Home() {
  const [interval, setInterval] = useState("60")
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

  const submit = async (event: { [key: string]: any }) => {
    event.preventDefault()
    const data = {
      code: btoa(code),
      intervalToRun: interval,
      trigger,
      token
    }

    await axios.post("http://localhost:3000/scripts", data)
    setInterval('60')
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
    const data = await axios.post("http://localhost:3000/try-out-scripts", {
      code: btoa(code),
      sessionId,
      loadEnvs: (loadEnvs === '1' ? true : false),
      token
    })

    setOutput(data.data.output)
    setIsExecuteCode(false)
  }

  return (
    <div style={{
      margin: "10px"
    }}>
      <div className="alert alert-danger" role="alert">
        <h4 className="alert-heading">Warning!</h4>
        <p>
          If you need use secrets or sensitive data on script you need use&nbsp; 
          <a target="_blank" href="https://infisical.com/" className="alert-link">Infisical</a>&nbsp;
          to create your secrets.  
        </p>
        <p>
          Tip: Create secrets on Production envirnoment and generate a service token.
          If you don't know how to create service token <a target="_blank" href="https://infisical.com/docs/documentation/platform/token" className="alert-link">link</a>.&nbsp;
        </p>
      </div>
      <h2>Create a new script</h2>
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
     
      <label >Interval to execute?</label>
      <input type='number'
        className='form-control'
        min={60}
        value={interval}
        onChange={event => setInterval(event.target.value)} />
      <br />
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
      <button onClick={submit} className='btn btn-primary'>Save</button>&nbsp;
      <button onClick={tryOutScript} className='btn btn-danger'>
        { (isExecuteCode ? 'Executing...' : 'Execute code') } </button>
      <br />
      <br />

      {output &&
        <p style={{ background: "black", color: "white", "white-space": "pre-line", padding: '10px' }}>
          {output}
        </p>
      }

    </div>
  )
}

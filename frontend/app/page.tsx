"use client"

import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
import SensitiveDataAlert from '@/components/SensitiveDataAlert';
import OutputScript from '@/components/OutputScript';
import ScriptService from '@/services/Script';
import Link from 'next/link';
import useScript from '@/hooks/useScript';

const DEFAULT_CRONJOB = 'CRON'

export default function Home() {
  const {
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
    isExecuteCode,
    loadEnvs,
    setLoadEnvs,
    token,
    setToken
  } = useScript()

  const isNeedsToken = () => {
    return (loadEnvs === '1' ? true : false)
  }

  const isCronJobTrigger = () => {
    return trigger === DEFAULT_CRONJOB
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
        <button onClick={submit} className='btn btn-primary'>
          {(isLoading ? 'Saving...' : 'Save')}
        </button>&nbsp;
        <button onClick={tryOutScript} className='btn btn-danger'>
          {(isExecuteCode ? 'Executing...' : 'Execute code')}
        </button>
      </form>
      <br />
      <OutputScript output={output} />
      {urlToTriggerCode != null &&
        <div style={{ background: "black", color: 'white', padding: "10px" }}>
          <p> <span style={{ textTransform: "uppercase" }}>Http url to trigger code:</span> {urlToTriggerCode} </p>
        </div>
      }

    </div>
  )
}

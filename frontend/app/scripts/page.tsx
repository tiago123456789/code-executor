"use client"
import Link from "next/link"
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import { useEffect } from 'react';
import NotFoundRegister from "@/components/NotFoundRegister";
import useScript from "@/hooks/useScript";

export default function Home() {
    const { 
        getScripts, scripts,
    } = useScript()

    useEffect(() => {
        getScripts()
    }, [])

    return (
        <div className='container'>
            <br />
            <Link className="btn btn-sm btn-primary mb-2" href={"/"}>
                Back
            </Link>
            <div className='row'>
                <NotFoundRegister
                    items={scripts}
                    message="Not found scirpts"
                />
                {
                    scripts.map(item => {
                        return (
                            <div key={item.id} className="card col-md-12" style={{ margin: "1px" }}>
                                <div className="card-body">
                                    <h5 className="card-title">Interval: {item.interval_to_run} seconds</h5>
                                    <p className="card-text">
                                        <Editor
                                            style={{
                                                fontFamily: '"Fira code", "Fira Mono", monospace',
                                                fontSize: 12,
                                                border: "1px solid red",
                                                background: "rgba(0,0,0, .1)",
                                            }}
                                            value={item.code}
                                            highlight={code => highlight(code, languages.js)}
                                            padding={10}
                                        />
                                    </p>
                                    {item.enabled &&
                                        <Link href={`scripts/${item.id}/executions`} className="btn btn-primary">
                                            See exections
                                        </Link>
                                    }
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}


"use client"
import NotFoundRegister from '@/components/NotFoundRegister';
import ScriptService from '@/services/Script';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const scriptService = new ScriptService()

export default function Home() {
    const params = useParams()
    const [executions, setExecutions] = useState([])

    const getExecutions = async () => {
        const data = await scriptService.getLast10ExectuionsByScriptId((params.id) as String)
        setExecutions(data)
    }

    useEffect(() => {
        getExecutions()
    }, [])

    return (
        <div className='container'>
            <Link className="btn btn-sm btn-primary mt-2" href={"/scripts"}>
                Back
            </Link>
            <div className='row'>
                <NotFoundRegister 
                    items={executions}
                    message="Not found executions"
                />
                {executions.map(item => {
                    return (
                        <div key={item.id} className="card col-md-12" style={{ margin: "5px" }}>
                            <div className="card-body">
                                <h5 className="card-title">{item.type}</h5>
                                <p className="card-text" style={{ "whiteSpace": "pre-line" }}>
                                    {item.output || 'Empty'}
                                </p>
                                <small>{item.created_at}</small>
                            </div>
                        </div>
                    )
                })}

            </div>


        </div>
    )
}

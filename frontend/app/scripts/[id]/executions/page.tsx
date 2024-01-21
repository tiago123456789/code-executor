"use client"
import axios from 'axios';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
    const params = useParams()
    const [executions, setExecutions] = useState([])

    const getExecutions = async () => {
        const { data: registers } = await axios.get(`http://localhost:3000/scripts/${params.id}/executions`)
        setExecutions(registers.data)
    }

    useEffect(() => {
        getExecutions()
    }, [])

    return (
        <div className='container'>
            <div className='row'>
                { executions.map(item => {
                    return (
                        <div key={item.id} className="card col-md-12" style={{ margin: "5px" }}>
                            <div className="card-body">
                                <h5 className="card-title">{item.type}</h5>
                                <p className="card-text" style={{ "white-space": "pre-line" }}>
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

import React from "react"

export default function NotFoundRegister(props: any) {
    if (!props.items.length) {
        return <p className='mt-2 alert alert-warning'>{props.message}</p>
    }

    return false
}
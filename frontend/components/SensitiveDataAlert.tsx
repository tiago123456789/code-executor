import React from "react"

export default function SensitiveDataAlert() {

    return (
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
    )

}
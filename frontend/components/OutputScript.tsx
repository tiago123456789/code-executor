
export default function OutputScript({ output }) {
    if (!output) return false;
    return (
        <p style={{ background: "black", color: "white", "whiteSpace": "pre-line", padding: '10px' }}>
            {output}
        </p>
    )
}
import React from 'react';
import { Handle } from 'react-flow-renderer'

export default function CustomNodeSpecial({ data }) {
    const { sourcesHandle = [], targetsHandle = [] } = data || {};
    return (
        <div >
            {targetsHandle && targetsHandle.map((targetHandle, indexT) => (
                <Handle type="target" id={targetHandle.id} position="left" style={{ top: `${15 * (indexT + 1)}%`, borderRadius: 0 }} />
            ))}
            <div>{data.text}</div>
            {sourcesHandle && sourcesHandle.map((sourceHandle, indexS) => (
                <Handle type="target" id={sourceHandle.id} position="right" style={{ top: `${15 * (indexS + 1)}%`, borderRadius: 0 }} />
            ))}

        </div>
    );
}
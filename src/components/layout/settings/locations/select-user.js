import React, { useState, useEffect } from "react";
import { TreeSelect } from 'primereact/treeselect';
import { FloatLabel } from 'primereact/floatlabel';
import style from './location.module.scss';
import './location.module.css';

export const NodeService = {
    getTreeNodes: async () => {
        return Promise.resolve([
            {
                key: "0",
                label: "Murphy Jhones",
                photo: "https://dev.memate.com.au/media/user_13/cg0_cn.png"
            },
            {
                key: "1",
                label: "Alexander Lesly",
                photo: "https://dev.memate.com.au/media/user_13/cg0_cn.png"
            },
            {
                key: "2",
                label: "Eleanor Pena",
                photo: "https://dev.memate.com.au/media/user_13/cg0_cn.png"
            },
            
            {
                key: "3",
                label: "Bessie Cooper",
                photo: "https://dev.memate.com.au/media/user_13/cg0_cn.png"
            }
        ]);
    }
};


const SelectUsers = () => {
    const [nodes, setNodes] = useState([]);
    const [selectedNodeKey, setSelectedNodeKey] = useState(null);

    useEffect(() => {
        NodeService.getTreeNodes().then((data) => setNodes(data));
    }, []);

    // Function to render the node content (custom label with image)
    const nodeTemplate = (node) => {
        return (
            <div className="p-d-flex p-ai-center">
                <img src={node.photo} alt={node.label} style={{ width: '24px', marginRight: '10px' }} />
                <span>{node.label}</span>
            </div>
        );
    };

    return (
        <div className="card flex justify-content-center">
            <FloatLabel className="w-full md:w-20rem">
                <TreeSelect
                    inputId="treeselect"
                    value={selectedNodeKey}
                    onChange={(e) => setSelectedNodeKey(e.value)}
                    options={nodes}
                    placeholder="Select Desktop User"
                    className={`w-full ${style.selectuserInput}`}
                    display="chip"
                    nodeTemplate={nodeTemplate}  
                />
            </FloatLabel>
        </div>
    );
}

export default SelectUsers;

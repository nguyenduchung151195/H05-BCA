import React, { useEffect } from 'react';
import './style.css';
import { useState } from 'react';
import ReactFlow, { removeElements, ReactFlowProvider, addEdge, MiniMap, isNode, Controls, Background, Handle } from 'react-flow-renderer';
import dagre from 'dagre';
let position = { x: 0, y: 0 };
const initialElements = [
  {
    id: 'begin',
    type: 'input',
    className: 'beginFlow',
    data: { label: 'Bắt đầu' },
    position,
  },
  {
    id: 'end',
    type: 'output',
    data: { label: 'Kết thúc' },
    className: 'endFlow',
    position,
  },
];
function FlowDocument(props) {
  const { data = [] } = props;
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  const nodeWidth = 170;
  const nodeHeight = 60;
  // thư viện hỗ trơ căn chỉnh

  const [elements, setElements] = useState(initialElements);
  const [localData, setLocalData] = useState([]);
  const onElementsRemove = elementsToRemove => setElements(els => removeElements(elementsToRemove, els));
  const onConnect = params => setElements(els => addEdge(params, els));
  const onLoad = reactFlowInstance => {
    console.log('flow loaded:', reactFlowInstance);
    reactFlowInstance.fitView();
  };

  const getLayoutedElements = (elements, direction = 'LR') => {
    dagreGraph.setGraph({ rankdir: direction });

    elements.forEach(el => {
      if (isNode(el)) {
        dagreGraph.setNode(el.id, { width: nodeWidth ? nodeWidth : 120, height: nodeHeight ? nodeHeight : 40 });
      } else {
        dagreGraph.setEdge(el.source, el.target);
      }
    });

    dagre.layout(dagreGraph);

    return elements.map(el => {
      if (isNode(el)) {
        const nodeWithPosition = dagreGraph.node(el.id);
        if (el.type !== 'special') {
          el.targetPosition = 'left';
          el.sourcePosition = 'right';
        }
        // unfortunately we need this little hack to pass a slightly different position
        // to notify react flow about the change. Moreover we are shifting the dagre node position
        // (anchor=center center) to the top left so it matches the react flow node anchor point (top left).
        el.position = {
          x: nodeWithPosition.x - nodeWidth / 2 + Math.random() / 1000,
          y: nodeWithPosition.y - nodeHeight / 2,
        };
      }

      return el;
    });
  };
  const customNodeStyles = {
    backgroundColor: '#2196f3',
    color: '#FFF',
    padding: 10,
  };
  const defaultStyle = {
    backgroundColor: 'transparent',
    color: '#000',
    padding: 10,
  };

  const checkNodeExisting = (nodes, newNode) => {
    let index = nodes && nodes.findIndex(f => f.id === newNode.id);
    return index;
  };

  const checkIdReturnIsExistingInSendTo = (sendToParam, returnTo) => {
    let sendTo = (sendToParam && [...new Set(sendToParam)]) || [];
    let result = [...sendTo];
    let returnArr = [...new Set(returnTo)];
    if (Array.isArray(returnTo) && sendTo && returnArr.length > 0) {
      returnArr.map(item => {
        let index = sendTo.findIndex(f => f === item);

        if (index !== -1) {
          result.splice(index, 1);
        }
      });
    }
    return result;
  };

  const makeEdges = nodes => {
    let edges = [];
    if (nodes && nodes.length > 0) {
      nodes.map(node => {
        const { data, id } = node || {};
        const { returnTo = [], sendTo = [] } = data || {};
        if (sendTo && sendTo.length > 0) {
          sendTo.map(send => {

            let edge = {
              id: id + '/' + send,
              source: id ? id : '',
              target: send,
              sourceHandle: send,
              type: 'straight',
              animated: true,
              label: data.action,
            };
            edges.push(edge);
          });
        }
        if (returnTo && returnTo.length > 0) {
          returnTo.map(item => {
            let edgeReturn = {
              id: id + '/' + item,
              source: id ? id : '',
              target: item,
              sourceHandle: item,
              type: 'straight',
              animated: true,
              label: data.action,
            };
            edges.push(edgeReturn);
          });
        }
      });
    }
    return edges;
  };

  const customElement = (dataFlow = [], elements) => {
    const [begin, end] = elements;
    let nodes = [];
    let edges = [];
    let position = { x: 0, y: 0 };
    let listArrayHistory = data && data.length > 0 && data.reduce((totalChilds, el) => totalChilds.concat([el.childs]), []);
    if (listArrayHistory.length > 0) {
      listArrayHistory.map((array, index) => {
        if (array.length === 1) {
          const [item] = array || [];
          const { createdBy = {}, receiver = {}, action, stageStatus } = item || {};
          const { name, _id } = createdBy || {};
          const { name: nameSend, _id: sendTo } = receiver || {};
          const isReturn = action === 'Trả lại' ? true : false;
          if (index === 0) {
            let beginNode = {
              id: _id ? _id : '',
              sourcePosition: 'right',
              data: { label: name, isReturn, sendTo: [sendTo], returnTo: [] },
              position,
            };
            nodes.push(beginNode);
          }
          if (index > 0 && index < listArrayHistory.length - 1) {
            let node = {
              id: _id ? _id : '',
              type: isReturn ? 'nodeReturn' : 'default',
              sourcePosition: 'right',
              targetPosition: 'left',
              data: {
                label: name,
                isReturn,
                sendTo: [sendTo],
                returnTo: isReturn ? [sendTo] : [],
                action: action,
              },
              position,
            };

            let findIndex = checkNodeExisting(nodes, node);
            if (findIndex === -1) {
              nodes.push(node);
            } else {
              const { data = {} } = nodes[findIndex] || {};
              let upDateSendTo = data && [...data.sendTo, sendTo];
              let upDateReturnTo = data && [...data.returnTo, ...node.data.returnTo];
              upDateReturnTo = [...new Set(upDateReturnTo)];

              upDateSendTo = checkIdReturnIsExistingInSendTo(upDateSendTo, upDateReturnTo);
              nodes[findIndex] = {
                ...node,
                data: {
                  ...data,
                  isReturn: node.data ? node.data.isReturn : false,
                  sendTo: upDateSendTo,
                  returnTo: upDateReturnTo,
                },
              };
            }
          }
          if (index === listArrayHistory.length - 1 && stageStatus === 'Hoàn thành xử lý') {
            let nodeConnectEnd = {
              id: sendTo ? sendTo : '',
              sourcePosition: 'right',
              targetPosition: 'left',
              position,
              data: {
                sendTo: ['end'],
                returnTo: [],
                label: nameSend,
                action: action,
              },
            };
            let findIndex = checkNodeExisting(nodes, nodeConnectEnd);
            if (findIndex === -1) {
              nodes.push(nodeConnectEnd);
            } else {
              const { data = {} } = nodes[findIndex] || {};
              let upDateSendTo = data && [...data.sendTo, 'end'];
              let upDateReturnTo = data && [...new Set(data.returnTo)];
              upDateSendTo = checkIdReturnIsExistingInSendTo(upDateSendTo, upDateReturnTo);
              nodes[findIndex] = {
                ...nodes[findIndex],
                data: { ...data, sendTo: upDateSendTo },
              };
            }
            let endNode = {
              id: 'end',
              targetPosition: 'left',
              data: { label: 'Kết thúc', sendTo: [], returnTo: [] },
              position,
            };
            nodes.push(endNode);
          }
        }

        if (array.length > 1) {
          let [firstItem] = array || [];
          const { createdBy = {}, receiver = {}, action, stageStatus } = firstItem || {};
          const { name, _id } = createdBy || {};
          const isReturn = action === 'Trả lại' ? true : false;
          // Custom node Dad
          const sendTo = array.map(send => (send.receiver ? send.receiver._id : ''));

          let nodeDad = {
            id: _id ? _id : '',
            type: isReturn ? 'nodeReturn' : 'default',
            sourcePosition: 'right',
            targetPosition: 'left',
            position,
            data: {
              label: name,
              isReturn,
              sendTo,
              returnTo: [],
              action: action,
            },
          };

          let findIndex = checkNodeExisting(nodes, nodeDad);
          if (findIndex === -1) {
            nodes.push(nodeDad);
          } else {
            const { data = {} } = nodes[findIndex] || {};
            let upDateSendTo = data && [...data.sendTo, ...sendTo];
            let upDateReturnTo = data && [...new Set(data.returnTo)];
            upDateSendTo = checkIdReturnIsExistingInSendTo(upDateSendTo, upDateReturnTo);
            nodes[findIndex] = {
              ...nodeDad,
              data: { ...data, sendTo: upDateSendTo },
            };
          }
          // Make node child
          array &&
            array.map(child => {
              const { receiver = {}, action, role, stageStatus } = child || {};
              const { name, _id } = receiver || {};
              const isProcessor = role === 'processors' ? true : false;
              let nodeChild = {
                id: _id ? _id : '',
                sourcePosition: 'right',
                type: isProcessor ? 'nodeReturn' : 'default',
                targetPosition: 'left',
                position,
                data: {
                  label: name,
                  isReturn: isProcessor,
                  parentId: nodeDad.id ? nodeDad.id : '',
                  sendTo: [],
                  returnTo: isProcessor ? [nodeDad.id] : [],
                  action: action,
                },
              };

              let findIndexChild = checkNodeExisting(nodes, nodeChild);
              if (findIndexChild === -1) {
                nodes.push(nodeChild);
              } else {
                const { data = {} } = nodes[findIndexChild] || {};
                let upDateSendToForMany = data && [...data.sendTo];
                let upDateReturnTo = data && [...new Set(data.returnTo)];
                upDateSendToForMany = checkIdReturnIsExistingInSendTo(upDateSendToForMany, upDateReturnTo);
                nodes[findIndexChild] = {
                  ...nodes[findIndexChild],
                  data: {
                    ...data,
                    sendTo: upDateSendToForMany,
                    returnTo: upDateReturnTo,
                  },
                };
              }
            });
        }
      });
    }
    edges = (nodes && makeEdges(nodes)) || [];
    let final = [...nodes, ...edges];
    final = getLayoutedElements(final);
    return final;
  };
  const layoutedElements = getLayoutedElements(initialElements);

  const CustomNodeReturnComponent = ({ id, data, isConnectable }) => {
    return (
      <div style={customNodeStyles}>
        <Handle
          type="target"
          position="left"
          id={id}
          onConnect={params => console.log('return connect', params)}
          style={{ top: '20%', borderRadius: '50%', background: 'green' }}
        />

        {data &&
          !data.parentId && (
            <>
              <Handle
                type="source"
                position="left"
                id={data && data.returnFor}
                onConnect={params => console.log('return connect1', params)}
                style={{ top: '80%', borderRadius: '50%', background: 'pink' }}
              />
            </>
          )}

        <div>{data ? data.label : ''}</div>

        {data &&
          data.sendTo.length > 1 && (
            <>
              <Handle
                type="source"
                position="right"
                id={data && data.sendTo[1] ? data.sendTo[1] : id}
                onConnect={params => console.log('return connect2', params)}
                style={{ borderRadius: '50%', background: 'orange' }}
              />
              {data &&
                data.parentId &&
                data.returnFor && (
                  <Handle
                    type="target"
                    position="left"
                    id={id}
                    onConnect={params => console.log('return connect2', params)}
                    style={{
                      top: '30%',
                      borderRadius: '50%',
                      background: 'orange',
                    }}
                  />
                )}
            </>
          )}
        {data &&
          data.sendTo.length === 1 && (
            <>
              <Handle
                type="source"
                position="left"
                id={data && data.sendTo[0] ? data.sendTo[0] : id}
                onConnect={params => console.log('return connect2', params)}
                style={{ top: '70%', borderRadius: '50%', background: 'orange' }}
              />
              {data &&
                data.parentId &&
                data.returnFor &&
                data.label !== 'Văn thư' && (
                  <Handle
                    type="source"
                    position="right"
                    id={data.returnFor}
                    onConnect={params => console.log('return connect2', params)}
                    style={{
                      borderRadius: '50%',
                      background: 'red',
                    }}
                  />
                )}
            </>
          )}
      </div>
    );
  };
  const CustomNodeReceiveComponent = ({ id, data }) => {
    return (
      <div style={customNodeStyles}>
        {data.label === 'Văn thư' && (
          <>
            <Handle
              type="source"
              id={id}
              onConnect={params => console.log('handle onConnect', params)}
              position={'right'}
              style={{
                top: '20%',
                borderRadius: '50%',
                background: 'green',
              }}
            />
            <Handle
              type="target"
              id={data && data.sendTo[0]}
              onConnect={params => console.log('handle onConnect', params)}
              position={'right'}
              style={{
                top: '80%',
                borderRadius: '50%',
                background: 'pink',
              }}
            />
          </>
        )}
        {data.label !== 'Văn thư' && (
          <>
            <Handle
              type="target"
              // id={data && data.sendTo[1]}
              onConnect={params => console.log('handle onConnect', params)}
              position="left"
              style={{
                borderRadius: '50%',
                background: 'green',
              }}
            />

            <Handle
              type="target"
              id={id}
              onConnect={params => console.log('handle onConnect', params)}
              position={'right'}
              style={{
                top: '80%',
                borderRadius: '50%',
                background: 'orange',
              }}
            />
            {/* <Handle
              type="source"
              id={data.sendTo[0]}
              onConnect={(params) => console.log("handle onConnect", params)}
              position="right"
              style={{
                top: "30%",
                borderRadius: "50%",
                background: "green"
              }}
            />
            <Handle
              type="source"
              id={data.sendTo[1]}
              onConnect={(params) => console.log("handle onConnect", params)}
              position="right"
              style={{
                top: "60%",
                borderRadius: "50%",
                background: "green"
              }}
            /> */}
          </>
        )}
        {data.parentId && (
          <Handle
            type="source"
            id={data.parentId}
            // id={id}
            position="right"
            style={{ top: '20%', borderRadius: '50%', background: 'red' }}
          />
        )}
        <div>{data ? data.label : ''}</div>
      </div>
    );
  };
  const CustomNodeDadComponent = ({ id, data }) => {
    return (
      <div style={customNodeStyles}>
        <Handle type="target" id={id} position="left" style={{ top: '52%', borderRadius: '50%', background: 'red' }} />
        <Handle type="source" id={id} position="right" style={{ top: '52%', borderRadius: '50%', background: 'green' }} />
        {data.parentId && <Handle type="target" id={id} position="left" style={{ top: '30%', borderRadius: '50%', background: 'pink' }} />}

        <div>{data ? data.label : ''}</div>
      </div>
    );
  };
  const nodeTypes = {
    nodeReturn: CustomNodeReturnComponent,
    receiveHandle: CustomNodeReceiveComponent,
    dadNodeHasReturn: CustomNodeDadComponent,
  };

  return (
    <div className="wrapperFlow">
      <ReactFlowProvider>
        <ReactFlow
          elements={data && customElement(data, elements)}
          onElementsRemove={onElementsRemove}
          onConnect={onConnect}
          onLoad={onLoad}
          nodeTypes={nodeTypes}
          connectionLineType="straight"
          snapToGrid={true}
          snapGrid={[15, 15]}
        >
          <Controls />
          <Background color="#aaa" gap={16} />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}

export default FlowDocument;

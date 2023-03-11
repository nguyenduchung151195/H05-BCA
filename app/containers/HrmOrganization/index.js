/**
 *
 * HrmOrganization
 *
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectHrmOrganization from './selectors';
import reducer from './reducer';
import saga from './saga';


import { DataManager } from "@syncfusion/ej2-data";
import {
  DataBinding,
  DiagramComponent,
  HierarchicalTree,
  ImageElement,
  Inject,
  SnapConstraints,
  StackPanel,
  TextElement,
  UndoRedo,
  DiagramTools,
  AnnotationConstraints,
  ConnectorBridging,
  DiagramConstraints, ComplexHierarchicalTree,
  NodeConstraints,
  PortConstraints,
  SelectorConstraints,
  LayoutAnimation,
  PrintAndExport,
} from "@syncfusion/ej2-react-diagrams";
import { ItemDirective, ItemsDirective, ToolbarComponent } from "@syncfusion/ej2-react-navigations"
import { data } from './diagram-data';
import { getAllHrmChart } from './actions';
import { Grid, Button } from '@material-ui/core';
import { Print, ZoomIn, ZoomOut } from '@material-ui/icons';

let diagramInstance;

function HrmOrganization(props) {
  const { hrmOrganizationPage, onGetAllHrmChart } = props;
  const { hrmOrgTreeData } = hrmOrganizationPage;
  const [localData, setLocalData] = useState([]);

  useEffect(() => {
    onGetAllHrmChart();
    setLocalData(data);
  }, []);
  useEffect(() => {
    if (Array.isArray(hrmOrgTreeData)) {
      setLocalData(hrmOrgTreeData);
    } else {
      setLocalData([]);
    }
  }, [hrmOrgTreeData])
  // useEffect(() => {
  //   setLocalData(employees);
  // }, [employees])
  // const dataSource = new DataManager(localData);
  // console.log(1, dataSource)

  const onZoomIn = () => {
    let zoomin = { type: "ZoomIn", zoomFactor: 0.2 };
    diagramInstance.zoomTo(zoomin);
  }
  const onZoomOut = () => {
    let zoomout = { type: "ZoomOut", zoomFactor: 0.2 };
    diagramInstance.zoomTo(zoomout);
  }

  const onItemClick = (e) => {
    //console.log(1, e)
    switch (e.target.name) {
      case "zoomIn":
        let zoomin = { type: "ZoomIn", zoomFactor: 0.2 };
        diagramInstance.zoomTo(zoomin);
        break;
      case "zoomOut":
        let zoomout = { type: "ZoomOut", zoomFactor: 0.2 };
        diagramInstance.zoomTo(zoomout);
        break;
      case "print":
        let exportOptions = {};
        exportOptions.mode = "Download";
        exportOptions.region = "PageSettings";
        exportOptions.multiplePage = true;
        exportOptions.fileName = "Export";
        exportOptions.margin = { left: 0, top: 0, bottom: 0, right: 0 };
        diagramInstance.exportDiagram(exportOptions);
        break;
      default:
        break;

    }
  }


  return (
    <div>
      {/* <ToolbarComponent
        id="toolbar_diagram" clicked={onItemClick} items={[
          {
            id: "zoomIn",
            type: "Button",
            tooltipText: "ZoomIn",
            text: "Phóng to",
            prefixIcon: "e-diagram-icons e-diagram-zoomin"
          },
          { type: "Separator" },
          {
            id: "zoomOut",
            type: "Button",
            tooltipText: "ZoomOut",
            text: "Thu nhỏ",
            prefixIcon: "e-diagram-icons e-diagram-zoomout"
          },
          { type: "Separator" },
          {
            id: "print",
            type: "Button",
            tooltipText: "Print",
            text: "Xuất PDF",
            prefixIcon: "e-diagram-icons e-diagram-print"
          },
        ]}
      /> */}
      <Grid container spacing={16}>
        <Grid item>
          <Button onClick={onZoomIn}><ZoomIn /></Button>
        </Grid>
        <Grid item>
          <Button onClick={onZoomOut}><ZoomOut /></Button>
        </Grid>
        <Grid item>
          <Button><Print /></Button>
        </Grid>
      </Grid>

      <DiagramComponent
        id="diagram"
        ref={diagram => (diagramInstance = diagram)}
        width={"100%"}
        height={"590px"}
        snapSettings={{ constraints: SnapConstraints.None }} //Configrues organizational chart layout
        dataSourceSettings={{
          id: "Id",
          parentId: "ReportingPerson",
          dataSource: new DataManager(localData),
        }}

        // setting ket noi
        getConnectorDefaults={(connector, diagram) => {
          connector.targetDecorator.shape = "None";
          connector.type = "Orthogonal";
          connector.bridgeSpace = 20; //
          connector.cornerRadius = 20; // goc 

          return connector;
        }}

        // setting 
        getNodeDefaults={node => {
          node.annotations = [
            // {
            //   template: `<img src=${node.data.avatar} style="object-fit: contain; width: 100px; height: 100px" />` || '',
            //   style: {
            //     fill: "none",

            //   }
            // },
            {
              // content: node.data.name,
              content: node.data.Name,
              name: "Name",
              style: {
                color: "black",
                textWrapping: 'wrap',
                strokeColor: "none",
                fill: "none",
                textAlign: "Right"
              },
              offset: {
                x: 0.72,
                y: 0.2
              },
              // horizontalAlignment: "Left",
              // verticalAlignment: "Top",

              constraints: AnnotationConstraints.Interaction, // Interaction: co the di chuyen tuy y - nhung khong luu
              // addInfo: { content: 'label' }
            },
            {
              // content: node.data.position && node.data.position.title,
              content: node.data.Designation,
              name: "Designation",
              style: {
                color: "black",
                textWrapping: 'wrap',
                strokeColor: "none",
                fill: "none",
              },
              margin: { left: 0, right: 0, top: 5, bottom: 0 },
              offset: {
                x: 0.72,
                y: 0.4
              },

              constraints: AnnotationConstraints.Interaction
            },

          ];

          // chen va hien thi anh du oi dang full
          // node.shape = {
          //   type: "Image",
          //   source: node.data.ImageUrl || "",
          //   scale: "Meet"
          // }

          //html
          if (node.data.ImageUrl) {
            node.shape = {
              type: "HTML",
              content: node.data.ImageUrl ? `<img src=${node.data.ImageUrl || ""} height="100%" width="40%" style="object-fit: scale-down; opacity: 0.8; line-height: 100%; position: static; z-index: -1"/>` : '<div style="width: 0;height: 0"></div>',
            }
          }

          // node.shape = {
          //   type: "Basic",
          //   shape: "Terminator",
          //   left: 25,
          //   right: 25,
          //   top: 25,
          //   bottom: 25
          // }
          node.height = 100;
          node.width = 250;
          node.offsetX = 200;
          node.offsetY = 200;

          // node.style.fill = 'white';
          // node.strokeWidth = 2;
          // node.style.strokeColor = 'black'
          node.borderColor = 'black';
          node.backgroundColor = 'white';
          node.borderWidth = 1;

          // an - hien thi du lieu

          node.expandIcon = {
            height: 15,
            width: 15,
            shape: "Minus",
            fill: "lightgray",
            offset: {
              x: .5,
              y: .9
            }
          }
          node.collapseIcon.offset = {
            x: .5,
            y: .9
          };
          node.collapseIcon.height = 15;
          node.collapseIcon.width = 15;
          node.collapseIcon.shape = "Plus";
          // node.isExpanded = node.data.IsExpand;
          node.style = {
            fill: 'transparent',
            strokeWidth: 2,
            textWrapping: 'wrap',
          };

          // node.constraints = NodeConstraints.Default & ~NodeConstraints.Expandable;

          // hanh vi cua cong ket noi
          // node.ports = [{ constraints: PortConstraints.None }];

          return node;
        }}
        tool={DiagramTools.Default & ~DiagramTools.ZoomPan}

        created={
          () => {
            //Start to group the changes
            diagramInstance.startGroupAction();
            diagramInstance.endGroupAction();
          }
          // ,
          // () => {
          //   // them ket noi 
          //   const connectors = {
          //     id: "connector1",
          //     type: "Straight",
          //     segments: [{ type: "Basic" }]
          //   };
          //   diagramInstance.drawingObject = connectors;
          //   //To draw an object once, activate draw once
          //   diagramInstance.tool = DiagramTools.DrawOnce;
          //   diagramInstance.dataBind();
          // }
          // () => {
          // them o chon
          //   const drawingShape = {
          //     type: "Basic"
          //     // shape: "Square"
          //   };
          //   const node = {
          //     shape: drawingShape
          //   };
          //   diagramInstance.drawingObject = node;
          //   //To draw an object once, activate draw once
          //   diagramInstance.tool = DiagramTools.DrawOnce;
          //   diagramInstance.dataBind();
          // }        
        }
        // format hien thi du lieu
        // setNodeTemplate={(obj, diagram) => {
        //   return setNodeTemplate(obj, diagram);
        // }}
        layout={{
          enableAnimation: true,
          type: "HierarchicalTree",

          connectionDirection: "Orientation",
          orientation: 'TopToBottom',
          verticalAlignment: "Top", // hien thi vi tri
          verticalSpacing: 40,
          horizontalAlignment: "Center",
          horizontalSpacing: 40,
          springLength: 80,
          springFactor: 0.8,
          maxIteration: 500,
          // margin: {
          //   top: 20,
          //   bottom: 20
          // },
          // getBranch: (node, tree) => {
          //   if()
          // },
          getLayoutInfo: (node, tree) => {
            if (!tree.hasSubTree) {
              tree.orientation = "Vertical";
              tree.type = "Right";
            }
          }
        }}

        // tool={DiagramTools.DrawOnce || DiagramTools.ZoomPan || DiagramTools.MultipleSelect}

        //1: ket noi binh thuong
        //2: ket noi ghi de vong cung
        // constraints={
        //   DiagramConstraints.Default | DiagramConstraints.Bridging
        // }

        // 1: link sang nhan su
        // 2: tao ket noi giua nhan su
        doubleClick={
          (arg) => {
            // tro toi trang nhan su
            if (typeof arg.source.data !== 'undefined') {
              const { source: { data: { _id } } } = arg;
              //console.log(1, props);
              props.push(`/hrm/personnel/${_id}`);
            } else {
              const connectors = {
                id: "connector1",
                type: "Straight",
                segments: [{ type: "Straight" }]
              };
              diagramInstance.drawingObject = connectors;
              //To draw an object once, activate draw once
              diagramInstance.tool = DiagramTools.DrawOnce;
              diagramInstance.dataBind();

            }
          }
        }

        dataLoaded={
          (arg) => {
            // console.log(1, arg)
          }
        }

        // load du lieu nam trong view
        // constraints={DiagramConstraints.Default | DiagramConstraints.Virtualization}

        selectionChange={
          (arg) => {
            //console.log(arg)
            // enableOptions(arg);
          }
        }
      >
        <Inject services={[DataBinding, HierarchicalTree, UndoRedo, PrintAndExport]} />
      </DiagramComponent>
    </div >
  );
}

HrmOrganization.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  hrmOrganizationPage: makeSelectHrmOrganization(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetAllHrmChart: () => dispatch(getAllHrmChart()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'hrmOrganization', reducer });
const withSaga = injectSaga({ key: 'hrmOrganization', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(HrmOrganization);

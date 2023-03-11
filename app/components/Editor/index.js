import React from 'react';

import HtmlEditor, { Toolbar, Item } from 'devextreme-react/html-editor';
import Popup from 'devextreme-react/popup';
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';
// import { markup } from './data.js';

class Editor extends React.Component {
  constructor() {
    super();

    this.state = {
      value: '',
      popupVisible: false,
    };

    this.headerValues = [false, 1, 2, 3, 4, 5];

    this.toolbarButtonOptions = {
      // text: '',
      stylingMode: 'text',
      onClick: () => this.customButtonClick(),
    };
  }

  componentDidMount() {
    this.props.value ? this.setState({ value: this.props.value }) : null;
  }

  render() {
    const { value, popupVisible } = this.state;

    return (
      <React.Fragment>
        <div className="widget-container">
          <HtmlEditor value={value} onValueChanged={this.valueChanged} height={200}>
            <Toolbar style={{ display: 'flex' }}>
              <Item formatName="undo" />
              <Item formatName="redo" />
              <Item formatName="separator" />
              <Item formatName="header" formatValues={this.headerValues} />
              <Item formatName="separator" />
              <Item formatName="bold" />
              <Item formatName="italic" />
              <Item formatName="strike" />
              <Item formatName="underline" />
              <Item formatName="separator" />
              <Item formatName="alignLeft" />
              <Item formatName="alignCenter" />
              <Item formatName="alignRight" />
              <Item formatName="alignJustify" />
              <Item formatName="separator" />
              <Item widget="dxButton" options={this.toolbarButtonOptions} />
            </Toolbar>
          </HtmlEditor>
          <Popup showTitle title="Markup" visible={popupVisible} onHiding={this.popupHiding}>
            {value}
          </Popup>
        </div>
      </React.Fragment>
    );
  }

  valueChanged = e => {
    this.setState({
      value: e.value,
    });
    this.props.onChange(e.value);
  };

  popupHiding = () => {
    this.setState({
      popupVisible: false,
    });
  };

  customButtonClick = () => {
    this.setState({
      popupVisible: true,
    });
  };
}

export default Editor;

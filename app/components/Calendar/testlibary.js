import { render } from 'react-dom';

import * as React from 'react';
import {
  Day,
  Week,
  WorkWeek,
  Month,
  Agenda,
  ScheduleComponent,
  ResourcesDirective,
  ResourceDirective,
  Inject,
  Resize,
  DragAndDrop,
  ViewDirective,
  ViewsDirective,
} from '@syncfusion/ej2-react-schedule';
import { extend } from '@syncfusion/ej2-base';

import { SampleBase } from './sample-base';

import * as dataSource from './datasource.json';
export default class Resource extends SampleBase {
  constructor(props) {
    super(props);
    this.data = extend([], dataSource.resourceSampleData, null, true);
    this.resourceData = [
      { Text: 'Margaret', Id: 1, Color: '#ea7a57' },
      { Text: 'Robert', Id: 2, Color: '#df5286' },
      { Text: 'Laura', Id: 3, Color: '#865fcf' },
    ];
  }

  render() {
    return (
      <div className="schedule-control-section">
        <div className="col-lg-9 control-section">
          <div className="control-wrapper">
            <ScheduleComponent
              cssClass="resource"
              width="100%"
              height="650px"
              selectedDate={new Date(2018, 5, 5)}
              ref={schedule => (this.scheduleObj = schedule)}
              eventSettings={{
                dataSource: this.data,
              }}
            >
              <ResourcesDirective>
                <ResourceDirective
                  field="OwnerId"
                  title="Owners"
                  name="Owners"
                  allowMultiple
                  dataSource={this.resourceData}
                  textField="Text"
                  idField="Id"
                  colorField="Color"
                />
              </ResourcesDirective>
              <ViewsDirective>
                <ViewDirective option="Day" displayName="Ngày" />
                <ViewDirective option="Week" displayName="Tuần" />
                <ViewDirective option="Month" displayName="Tháng" />
              </ViewsDirective>
              <Inject services={[Day, Week, WorkWeek, Month, Agenda, Resize, DragAndDrop]} />
            </ScheduleComponent>
          </div>
        </div>
      </div>
    );
  }
}

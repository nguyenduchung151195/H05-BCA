import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import addFunnel from 'highcharts/modules/funnel';

import { Grid, Paper, Card, CardContent, IconButton, Button } from '@material-ui/core';
import { Settings } from '@material-ui/icons';
import PropTypes from 'prop-types';

import highcharts3d from 'highcharts/highcharts-3d';

addFunnel(Highcharts);
// addCylinder(Highcharts);
// addFunnel3d(Highcharts);

highcharts3d(Highcharts);

const pieChart = {
  chart: {
    type: 'pie',
    options3d: {
      enabled: true,
      alpha: 45,
      beta: 0,
    },
  },
  title: {
    text: 'Nguồn khách hàng',
  },
  tooltip: {
    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
  },
  plotOptions: {
    pie: {
      allowPointSelect: true,
      showInLegend: true,
      cursor: 'pointer',
      depth: 35,
      dataLabels: {
        enabled: true,
        format: '{point.name}',
      },
    },
  },
  series: [
    {
      type: 'pie',
      name: 'Nguồn',
      data: [
        ['Gọi điện', 45.0],
        ['Gặp mặt', 26.8],
        {
          name: 'Email',
          y: 12.8,
          sliced: true,
          selected: true,
        },

        ['Others', 15.4],
      ],
    },
  ],
  colors: ['#4286f4', '#5fcbef', '#16f7b0', '#16f764', '#5fef91', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
};
const lineChart = {
  colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
  chart: {
    type: 'line',
  },
  title: {
    text: 'Nhân viên',
  },

  xAxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  },
  yAxis: {
    title: {
      text: 'Chuyển đổi',
    },
  },
  plotOptions: {
    line: {
      dataLabels: {
        enabled: true,
      },
      enableMouseTracking: false,
    },
  },
  series: [
    {
      name: 'Convertion',
      data: [7.0, 6.9, 9.5, 14.5, 18.4, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
    },
    {
      name: 'Lost',
      data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8],
    },
  ],
};

const columnChart = {
  colors: ['#4286f4', '#5fcbef', '#16f7b0', '#16f764', '#5fef91', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
  chart: {
    type: 'column',
  },
  title: {
    text: 'Hiệu quả xử lý của nhân viên',
  },

  xAxis: {
    categories: ['Employee 1', 'Employee 2', 'Employee 3'],
    crosshair: true,
  },
  yAxis: {
    min: 0,
  },
  tooltip: {
    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' + '<td style="padding:0"><b>{point.y}</b></td></tr>',
    footerFormat: '</table>',
    shared: true,
    useHTML: true,
  },
  plotOptions: {
    column: {
      pointPadding: 0.2,
      borderWidth: 0,
    },
  },
  series: [
    {
      name: 'Number of active leads 15',
      data: [49, 71, 106],
    },
    {
      name: 'Number of active leads 30',
      data: [83, 78, 98],
    },
    {
      name: 'Number of converted leads 2',
      data: [48, 38, 39],
    },
    {
      name: 'Number of hunk loeads 1',
      data: [42, 33, 34],
    },
  ],
};

const funnelChart = {
  chart:
    // {
    //   type: 'funnel3d',
    //   options3d: {
    //     enabled: true,
    //     alpha: 10,
    //     depth: 50,
    //     viewDistance: 50,
    //   },
    {
      type: 'funnel',
      // options3d: {
      //   enabled: true,
      //   alpha: 10,
      //   depth: 50,
      //   viewDistance: 50,
    },
  title: {
    text: 'Phễu',
  },
  plotOptions: {
    series: {
      dataLabels: {
        enabled: true,
        format: '<b>{point.name}</b> ({point.y:,.0f})',
        softConnector: true,
      },
      neckWidth: '0%',
      neckHeight: '10%',
      width: '80%',
      height: '80%',
    },
  },
  legend: {
    enabled: false,
  },
  series: [
    {
      name: 'Công việc',
      data: [['Công việc mới', 65], ['Đang xử lý', 50], ['Đã sử lý xong', 35], ['Good lead', 5]],
    },
  ],

  responsive: {
    rules: [
      {
        condition: {
          maxWidth: 500,
        },
        chartOptions: {
          plotOptions: {
            series: {
              dataLabels: {
                inside: true,
              },
              center: ['50%', '50%'],
              width: '100%',
            },
          },
        },
      },
    ],
  },
  colors: ['#4286f4', '#5fcbef', '#5fefd9', '#5fefae', '#5fef91', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
};

const Box = props => (
  <Grid item md={props.md}>
    <Card style={{ background: props.color }}>
      <IconButton style={{ float: 'right' }}>
        <Settings />
      </IconButton>

      <p style={{ margin: '5px' }}>{props.title.toUpperCase()}</p>

      <CardContent style={{ display: 'flex', justifyContent: props.justifyContent }}>{props.children}</CardContent>
    </Card>
  </Grid>
);
const Report = () => (
  <Paper style={{ margin: '20px' }}>
    <Grid container>
      <Grid item md={6}>
        {' '}
        <HighchartsReact highcharts={Highcharts} options={funnelChart} />
      </Grid>
      <Grid item md={6}>
        {' '}
        <HighchartsReact highcharts={Highcharts} options={pieChart} />
      </Grid>
      <Box md={6} color="green" title="Số lượng khách hàng tiềm năng">
        65
      </Box>
      <Box md={6} color="lightblue" title="tỷ lệ chuyển đổi">
        7.7%
      </Box>
      <Box md={3} color="lightblue" title="Sô chuyển đổi">
        5
      </Box>
      <Box md={3} color="yellow" title="không thành công">
        10
      </Box>
      <Box md={6} color="red" title="tỷ lệ thất bại">
        15.4%
      </Box>
      <Grid item md={12}>
        {' '}
        <HighchartsReact highcharts={Highcharts} options={lineChart} />
      </Grid>
      <Grid item md={12}>
        {' '}
        <HighchartsReact highcharts={Highcharts} options={columnChart} />
      </Grid>
      <Box md={12} justifyContent="space-around" color="lightblue" title="dẫn đầu bảng chuyển đổi">
        <div>
          <p>Your rank #2</p>
          <Button variant="outlined" color="primary">
            total 2
          </Button>
        </div>
        <div>
          <p>#1</p>
          <Button variant="outlined">total 2</Button>
        </div>
        <div>
          <p> #3</p>
          <Button variant="outlined">total 2</Button>
        </div>
      </Box>
    </Grid>
  </Paper>
);

Box.PropTypes = {
  color: PropTypes.string,
};
Box.defaultProps = {
  justifyContent: 'flex-end',
};

export default Report;

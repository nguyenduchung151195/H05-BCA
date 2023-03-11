import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import addFunnel from 'highcharts/modules/funnel';
import { Grid, Paper, Card, CardContent, IconButton, Button } from '@material-ui/core';
import { Settings } from '@material-ui/icons';
import PropTypes from 'prop-types';

addFunnel(Highcharts);

const lineChart = {
  colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
  chart: {
    type: 'line',
  },
  title: {
    text: 'Deals in progress',
  },

  xAxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  },
  yAxis: {
    title: {},
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
      name: 'Number of deals in progress',
      data: [7.0, 6.9, 9.5, 14.5, 18.4, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
    },
    {
      name: 'Number of calls',
      data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8],
    },
    {
      name: 'Activity count',
      data: [5.9, 5.2, 5.3, 8.5, 11.2, 15.0, 16.0, 13.6, 14.2, 7.9, 8.6, 7.8],
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

const columnChart2 = {
  colors: ['#4286f4', '#5fcbef', '#16f7b0', '#16f764', '#5fef91', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
  chart: {
    type: 'column',
  },
  title: {
    text: 'Payment control for deals won',
  },

  xAxis: {
    categories: ['11 Mar', '15 Mar', '19 Mar', '23 Mar', '27 Mar', '31 Mar'],
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
      name: 'Total of invoiced sales',
      data: [89, 71, 96, 80, 87, 90],
    },
    {
      name: 'Total of uninvoiced sales',
      data: [93, 78, 105, 96, 109, 107],
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

      <CardContent style={{ display: 'flex', justifyContent: props.justifyContent, fontSize: '1.5rem' }}>{props.children}</CardContent>
    </Card>
  </Grid>
);
const Report = () => (
  <Paper style={{ margin: '20px' }}>
    <Grid style={{ display: 'flex', alignItems: 'center' }} container>
      <Grid item md={6}>
        <HighchartsReact highcharts={Highcharts} options={funnelChart} />
      </Grid>
      <Grid item md={6}>
        <Box md={12} color="green" title="Total value of deals">
          $300.000
        </Box>
        <Grid style={{ display: 'flex' }} item md={12}>
          <Box md={6} color="lightblue" title="Total of deals wons">
            $55.000
          </Box>
          <Box md={6} color="yellow" title="Total of deals in progress">
            $245.000
          </Box>
        </Grid>
      </Grid>
      <Grid item md={12}>
        <HighchartsReact highcharts={Highcharts} options={columnChart} />
      </Grid>
      <Grid item md={6}>
        <Box md={12} color="green" title="Total of invoiced sales">
          $50.000
        </Box>
        <Grid style={{ display: 'flex' }} item md={12}>
          <Box md={6} color="lightblue" title="Total of uninvoiced sales">
            $5.000
          </Box>
          <Box md={6} color="yellow" title="Total of deals won">
            $55.000
          </Box>
        </Grid>
      </Grid>
      <Grid item md={6}>
        <HighchartsReact highcharts={Highcharts} options={columnChart2} />
      </Grid>
      <Grid item md={6}>
        <HighchartsReact highcharts={Highcharts} options={lineChart} />
      </Grid>
      <Grid item md={6}>
        <Box md={12} color="green" title="Number of deals in progress">
          59
        </Box>
        <Grid style={{ display: 'flex' }} item md={12}>
          <Box md={6} color="lightblue" title="Activity count">
            350
          </Box>
          <Box md={6} color="yellow" title="Number of calls">
            300
          </Box>
        </Grid>
      </Grid>
      <Box md={12} justifyContent="flex-end" color="lightblue" title="Number of deals on hold">
        1
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

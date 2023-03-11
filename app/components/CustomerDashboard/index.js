/**
 *
 * CustomerDashboard
 *
 */

import React from 'react';

import Table from '@material-ui/core/Table';
import { Grid, Typography, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
// import Am4themesAnimated from '@amcharts/amcharts4/themes/animated';

// am4core.useTheme(Am4themesAnimated);
// function FunnelChart(props) {
//   // eslint-disable-next-line no-unused-vars
//   const { id, data } = props;
//   let columnFunnel;
//   useEffect(() => {
//     const chart = am4core.create(id, am4charts.SlicedChart);
//     const title = chart.titles.create();
//     title.text = 'TỶ LỆ CHUYỂN ĐỔI KHÁCH HÀNG';
//     title.fontSize = 25;
//     title.marginBottom = 30;
//     title.fontWeight = 'bold';
//     chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
//     chart.paddingBottom = 30;
//     chart.angle = 35;

//     chart.data = data;

//     // Create series
//     const series = chart.series.push(new am4charts.FunnelSeries());
//     series.colors.step = 2;
//     series.dataFields.value = 'value';
//     series.dataFields.category = 'name';
//     series.alignLabels = true;
//     series.labelsContainer.paddingLeft = 15;
//     series.labelsContainer.width = 200;

//     chart.legend = new am4charts.Legend();
//     chart.legend.position = 'left';
//     chart.legend.valign = 'bottom';
//     chart.legend.margin(5, 5, 20, 5);
//     columnFunnel = chart;
//   }, []);
//   useEffect(
//     () => () => {
//       if (columnFunnel) {
//         columnFunnel.dispose();
//       }
//     },
//     [],
//   );
//   return <div {...props} id={id} />;
// }

class CustomerDashboard extends React.Component {
  constructor(props) {
    super(props);
    const listMonth = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [] };
    this.props.customers.forEach(element => {
      const m = new Date(element.createdAt).getMonth();
      listMonth[m].push(element);
    });

    this.state = {
      listMonth,
    };
  }

  componentDidMount() {
    const chart = am4core.create('chartdiv', am4charts.XYChart);
    const y = new Date().getFullYear();
    chart.data = [
      {
        date: `${y}-01-01`,
        value: this.state.listMonth[0].length,
      },
      {
        date: `${y}-02-01`,
        value: this.state.listMonth[1].length,
      },
      {
        date: `${y}-03-01`,
        value: this.state.listMonth[2].length,
      },
      {
        date: `${y}-04-01`,
        value: this.state.listMonth[3].length,
      },
      {
        date: `${y}-05-01`,
        value: this.state.listMonth[4].length,
      },
      {
        date: `${y}-06-01`,
        value: this.state.listMonth[5].length,
      },
      {
        date: `${y}-07-01`,
        value: this.state.listMonth[6].length,
      },
      {
        date: `${y}-08-01`,
        value: this.state.listMonth[7].length,
      },
      {
        date: `${y}-09-01`,
        value: this.state.listMonth[8].length,
      },
      {
        date: `${y}-10-01`,
        value: this.state.listMonth[9].length,
      },
      {
        date: `${y}-11-01`,
        value: this.state.listMonth[10].length,
      },
      {
        date: `${y}-12-01`,
        value: this.state.listMonth[11].length,
      },
    ];

    chart.dateFormatter.inputDateFormat = 'yyyy-MM-dd';

    // Thêm tiêu đề
    const title = chart.titles.create();
    title.text = `TĂNG TRƯỞNG KHÁCH HÀNG  ${this.props.customers.length}`;
    title.fontSize = 25;
    title.marginBottom = 30;
    title.fontWeight = 'bold';

    // Create axes
    const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = 'Số lượng khách hàng';
    valueAxis.title.fontSize = 15;
    valueAxis.title.fontWeight = 'bold';

    // Create series
    const series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = 'value';
    series.dataFields.dateX = 'date';
    series.tooltipText = '{value}';
    series.strokeWidth = 2;
    series.minBulletDistance = 15;

    // Make bullets grow on hover
    const bullet = series.bullets.push(new am4charts.CircleBullet());
    bullet.circle.strokeWidth = 2;
    bullet.circle.radius = 4;
    bullet.circle.fill = am4core.color('#fff');

    const bullethover = bullet.states.create('hover');
    bullethover.properties.scale = 1.3;

    // Make a panning cursor
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.behavior = 'panXY';
    chart.cursor.xAxis = dateAxis;
    chart.cursor.snapToSeries = series;

    this.chart = chart;

    // PIE CHART
    const pieChart = am4core.create('piechart', am4charts.PieChart);

    const pieTitle = pieChart.titles.create();
    pieTitle.text = 'NHÓM KHÁCH HÀNG';
    pieTitle.fontSize = 25;
    pieTitle.marginBottom = 30;
    pieTitle.fontWeight = 'bold';
    pieChart.data = this.props.typeCustomer;

    const pieSeries = pieChart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = 'amount';
    pieSeries.dataFields.category = 'typeCustomer';
    pieSeries.slices.template.stroke = am4core.color('#fff');
    pieSeries.slices.template.strokeWidth = 2;
    pieSeries.slices.template.strokeOpacity = 1;

    // This creates initial animation
    pieSeries.hiddenState.properties.opacity = 1;
    pieSeries.hiddenState.properties.endAngle = -90;
    pieSeries.hiddenState.properties.startAngle = -90;
    pieChart.legend = new am4charts.Legend();

    // NGUỒN KHÁCH HÀNG

    const columnChart = am4core.create('columnchart', am4charts.XYChart);

    // Thanh kéo dãn
    // columnChart.scrollbarX = new am4core.Scrollbar();
    // Tiêu đề
    const columnTitle = columnChart.titles.create();
    columnTitle.text = 'NGUỒN KHÁCH HÀNG';
    columnTitle.fontSize = 25;
    columnTitle.marginBottom = 30;
    columnTitle.fontWeight = 'bold';

    // Add data
    columnChart.data = this.props.introducedWay;

    // Create axes
    const categoryAxis = columnChart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'introducedWay';
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.labels.template.horizontalCenter = 'right';
    categoryAxis.renderer.labels.template.verticalCenter = 'middle';
    categoryAxis.renderer.labels.template.rotation = 270;
    categoryAxis.tooltip.disabled = true;
    categoryAxis.renderer.minHeight = 110;

    const columnValueAxis = columnChart.yAxes.push(new am4charts.ValueAxis());
    columnValueAxis.renderer.minWidth = 50;

    // Create series
    const columnSeries = columnChart.series.push(new am4charts.ColumnSeries());
    columnSeries.sequencedInterpolation = true;
    columnSeries.dataFields.valueY = 'amount';
    columnSeries.dataFields.categoryX = 'introducedWay';
    columnSeries.tooltipText = '[{categoryX}: bold]{valueY}[/]';
    columnSeries.columns.template.strokeWidth = 0;

    columnSeries.tooltip.pointerOrientation = 'vertical';

    columnSeries.columns.template.column.cornerRadiusTopLeft = 10;
    columnSeries.columns.template.column.cornerRadiusTopRight = 10;
    columnSeries.columns.template.column.fillOpacity = 0.8;

    // on hover, make corner radiuses bigger
    const hoverState = columnSeries.columns.template.column.states.create('hover');
    hoverState.properties.cornerRadiusTopLeft = 0;
    hoverState.properties.cornerRadiusTopRight = 0;
    hoverState.properties.fillOpacity = 1;

    columnSeries.columns.template.adapter.add('fill', (fill, target) => columnChart.colors.getIndex(target.dataItem.index));

    // columnChart.legend = new am4charts.Legend();
    // Cursor
    columnChart.cursor = new am4charts.XYCursor();
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.dispose();
    }
    if (this.pieChart) {
      this.pieChart.dispose();
    }
    if (this.columnChart) {
      this.columnChart.dispose();
    }
  }

  render() {
    // console.log('AAAA,', this.props.bestRevenueCustomer);
    const newBestRevenueCustomer = this.props.bestRevenueCustomer ? this.props.bestRevenueCustomer : [];
    return (
      <Grid container>
        <Grid style={{ marginBottom: '90px' }} container md={12}>
          <Grid item md={12}>
            <div id="chartdiv" style={{ width: '100%', height: '500px' }} />
          </Grid>
          {/* <Grid item md={6}>
            <FunnelChart style={{ width: '100%', height: '100%' }} data={this.state.columnFunnel} id="chart1" />
          </Grid> */}
        </Grid>
        <Grid item md={6}>
          <div id="piechart" style={{ width: '100%', height: '500px' }} />
        </Grid>
        <Grid item md={6}>
          <div id="columnchart" style={{ width: '100%', height: '500px' }} />
        </Grid>
        <Grid style={{ marginTop: '20px' }} item md={6}>
          <Typography component="p" style={{ marginTop: 20, fontSize: 12, fontWeight: 'bold' }}>
            Top 10 khách hàng có giá trị hợp đồng lớn nhất
          </Typography>
          <Table style={{ width: '95%' }}>
            <TableHead>
              <TableRow>
                <TableCell>STT</TableCell>
                <TableCell>Tên khách hàng</TableCell>
                <TableCell>Hợp đồng</TableCell>
                <TableCell>Giá trị hợp đồng</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.props.contractOfCustomer.map((row, index) => (
                <TableRow key={row.contractName}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.customer.name}</TableCell>
                  <TableCell>{row.contractName}</TableCell>
                  <TableCell>{row.paymentRequest.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>

        <Grid style={{ marginTop: '20px' }} item md={6}>
          <Typography component="p" style={{ marginTop: 20, fontSize: 12, fontWeight: 'bold' }}>
            Top 10 đem lại doanh thu nhiều nhất
          </Typography>
          <Table style={{ width: '95%' }}>
            <TableHead>
              <TableRow>
                <TableCell>STT</TableCell>
                <TableCell>Tên khách hàng</TableCell>
                <TableCell>Số lượng hợp đồng đã kí</TableCell>
                <TableCell>Tổng giá trị đã nhiệm thu</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {newBestRevenueCustomer.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row[0]}</TableCell>
                  <TableCell>{row[1].total}</TableCell>
                  <TableCell>{row[1].revenue}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
      </Grid>
    );
  }
}

export default CustomerDashboard;

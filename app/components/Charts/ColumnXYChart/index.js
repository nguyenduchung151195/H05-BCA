import React, { useEffect, memo, useState  } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import Am4themesAnimated from '@amcharts/amcharts4/themes/animated';
am4core.useTheme(Am4themesAnimated);

function createChart(id, data) {
    const chart = am4core.create(id, am4charts.XYChart);
    const title = chart.titles.create();
    title.text = 'BIỂU ĐỒ DOANH THU';
    title.fontSize = 25;
    title.marginBottom = 30;
    title.fontWeight = 'bold';
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    chart.data = data;

    const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.dataFields.category = 'country';
    dateAxis.renderer.minGridDistance = 30;
    dateAxis.fontSize = 11;

    const valueAxis1 = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis1.title.text = 'Sales';

    const valueAxis2 = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis2.title.text = 'Doanh số';
    valueAxis2.renderer.opposite = true;
    valueAxis2.renderer.grid.template.disabled = true;

    // Create series
    const series1 = chart.series.push(new am4charts.ColumnSeries());
    series1.dataFields.valueY = 'sales1';
    series1.dataFields.dateX = 'date';
    series1.yAxis = valueAxis1;
    series1.name = 'Mục tiêu';
    // eslint-disable-next-line no-template-curly-in-string
    series1.tooltipText = '{name}\n[bold font-size: 20]${valueY}M[/]';
    series1.fill = chart.colors.getIndex(0);
    series1.strokeWidth = 0;
    series1.clustered = false;
    series1.columns.template.width = am4core.percent(40);

    const series2 = chart.series.push(new am4charts.ColumnSeries());
    series2.dataFields.valueY = 'sales2';
    series2.dataFields.dateX = 'date';
    series2.yAxis = valueAxis1;
    series2.name = 'Thực tế';
    series2.tooltipText = '{name}\n[bold font-size: 20]${valueY}M[/]';
    series2.fill = chart.colors.getIndex(0).lighten(0.5);
    series2.strokeWidth = 0;
    series2.clustered = false;
    series2.toBack();

    const series3 = chart.series.push(new am4charts.LineSeries());
    series3.dataFields.valueY = 'market1';
    series3.dataFields.dateX = 'date';
    series3.name = 'Doanh số theo tháng';
    series3.strokeWidth = 2;
    series3.tensionX = 0.7;
    series3.yAxis = valueAxis2;
    series3.tooltipText = '{name}\n[bold font-size: 20]{valueY}[/]';

    const bullet3 = series3.bullets.push(new am4charts.CircleBullet());
    bullet3.circle.radius = 3;
    bullet3.circle.strokeWidth = 2;
    bullet3.circle.fill = am4core.color('#fff');

    const series4 = chart.series.push(new am4charts.LineSeries());
    series4.dataFields.valueY = 'market2';
    series4.dataFields.dateX = 'date';
    series4.name = 'Cùng kỳ';
    series4.strokeWidth = 2;
    series4.tensionX = 0.7;
    series4.yAxis = valueAxis2;
    series4.tooltipText = '{name}\n[bold font-size: 20]{valueY}[/]';
    series4.stroke = chart.colors.getIndex(0).lighten(0.5);
    series4.strokeDasharray = '3,3';

    const bullet4 = series4.bullets.push(new am4charts.CircleBullet());
    bullet4.circle.radius = 3;
    bullet4.circle.strokeWidth = 2;
    bullet4.circle.fill = am4core.color('#fff');

    // Add cursor
    chart.cursor = new am4charts.XYCursor();

    // Add legend
    chart.legend = new am4charts.Legend();
    chart.legend.position = 'top';

    // Add scrollbar
    chart.scrollbarX = new am4charts.XYChartScrollbar();
    chart.scrollbarX.series.push(series1);
    chart.scrollbarX.series.push(series3);
    chart.scrollbarX.parent = chart.bottomAxesContainer;

    return chart;
}

function ColumnXYChart(props) {
  const [chart, setChart] = useState(null);
  const { id, data, isExport, onExportSuccess } = props;
  
  useEffect(() => {
    if (isExport && chart) {
      chart.exporting.export("pdf");

      onExportSuccess();
    }
  }, [isExport, onExportSuccess]);

  useEffect(() => {
    const currentChart = createChart(id, data);
    setChart(currentChart);
    return () => {
      if (currentChart) {
        currentChart.dispose();
      }
    };
  }, [data]);

  return <div {...props} id={id} />;
}

export function ProfitChart(props) {
  const { id, data } = props;
  useEffect(() => {
    const chart = am4core.create(id, am4charts.XYChart);
    const newData = data && data.map(item => ({ ...item, value: item.totalExpense - item.totalRevenue }))
    chart.data = newData;

    chart.dateFormatter.inputDateFormat = 'yyyy-MM';

    // Thêm tiêu đề
    const title = chart.titles.create();
    title.text = 'BIỂU ĐỒ LỢI NHUẬN';
    title.fontSize = 25;
    title.marginBottom = 30;
    title.fontWeight = 'bold';

    // Create axes
    const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = 'VND';
    // Create series
    const series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = 'value';
    series.dataFields.dateX = 'month';
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
    return () => {
      chart.dispose();
    }
  }, [data])
  return (
    <div id={id} {...props}></div>
  )
}
export default memo(ColumnXYChart);
import React, { useEffect, memo, useState  } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import Am4themesAnimated from '@amcharts/amcharts4/themes/animated';
am4core.useTheme(Am4themesAnimated);
const a =['số lượng thời gian', 'đơn vị thời gian', 'số lượng']
function createChart(id, data) {
    const chart = am4core.create(id, am4charts.XYChart);
    const title = chart.titles.create();
    title.text = 'BIỂU ĐỒ SỬ DỤNG DỮ LIỆU';
    title.fontSize = 25;
    title.marginBottom = 30;
    title.fontWeight = 'bold';
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    chart.data = data;

    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataFields.category = 'index';
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.fontSize = 11;

    const valueAxis2 = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis2.title.text = 'Dữ liệu';
    // valueAxis2.renderer.opposite = true;
    // valueAxis2.renderer.grid.template.disabled = true;

    const series3 = chart.series.push(new am4charts.LineSeries());
    series3.dataFields.categoryX = 'index';
    series3.dataFields.valueY = 'used';
    series3.dataFields.id = 'typeOfData';
    series3.name = 'Dữ liệu';
    series3.strokeWidth = 2;
    series3.tensionX = 0.7;
    series3.yAxis = valueAxis2;
    series3.tooltipText = '{name}\n[bold font-size: 20]{valueY} {id}[/]';

    const bullet3 = series3.bullets.push(new am4charts.CircleBullet());
    bullet3.circle.radius = 3;
    bullet3.circle.strokeWidth = 2;
    bullet3.circle.fill = am4core.color('#fff');

    // Add cursor
    chart.cursor = new am4charts.XYCursor();

    // Add legend
    chart.legend = new am4charts.Legend();
    chart.legend.position = 'top';

    // Add scrollbar
    // chart.scrollbarX = new am4charts.XYChartScrollbar();
    // chart.scrollbarX.series.push(series2);
    // chart.scrollbarX.parent = chart.bottomAxesContainer;

    return chart;
}

function FilesChart(props) {
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

export default memo(FilesChart);
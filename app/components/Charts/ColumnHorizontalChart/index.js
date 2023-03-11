import React, { useEffect, memo, useState  } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import Am4themesAnimated from '@amcharts/amcharts4/themes/animated';
import PropTypes from 'prop-types';

am4core.useTheme(Am4themesAnimated);


// TUANTRAN - "BIEU DO TRON - PIE CHART":
function ColumnHorizontalChart(props) {
  // eslint-disable-next-line no-unused-vars
  const { id, titleChart, data, dataFieldsCategory, dataFieldsValueX, serieName} = props;

  let barChart;
  useEffect(() => {
    const chart = am4core.create(id, am4charts.XYChart);

    chart.colors.list = [
      am4core.color("#bc58c9"),
      am4core.color("#8fd141"),
      am4core.color("#be5239"),
      am4core.color("#9db9ba"),
      am4core.color("#513549"),
      am4core.color("#cbab53"),
      am4core.color("#535d35"),
      am4core.color("#476391"),
      // 
      am4core.color("#845EC2"),
      am4core.color("#D65DB1"),
      am4core.color("#FF6F91"),
      am4core.color("#FF9671"),
      am4core.color("#FFC75F"),
      am4core.color("#F9F871"),
    ];

    chart.logo.hidden = true;
    chart.legend = new am4charts.Legend();

    // TIÊU ĐỀ
    const title = chart.titles.create();
    title.text = titleChart;
    title.fontSize = 25;
    title.marginBottom = 30;
    title.fontWeight = 'bold';

    // DỮ LIỆU
    chart.data = data;

    // Create axes
    const yAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    yAxis.dataFields.category = dataFieldsCategory; // tuantran

    yAxis.renderer.grid.template.location = 0;
    yAxis.renderer.labels.template.fontSize = 10;
    yAxis.renderer.minGridDistance = 10;

    const xAxis = chart.xAxes.push(new am4charts.ValueAxis());
    xAxis.dataFields.category = dataFieldsCategory; // tuantran

    // Create series
    const series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueX = dataFieldsValueX;  // tuantran
    // series.dataFields.valueX = 'sales';
    series.dataFields.categoryY = dataFieldsCategory; // tuantran
    series.columns.template.tooltipText = '{categoryY}: [bold]{valueX}[/]';
    series.columns.template.strokeWidth = 0;
    series.name = serieName;  // tuantran

    // Add ranges
    function addRange(label, start, end, color) {
      const range = yAxis.axisRanges.create();
      range.category = start;
      range.endCategory = end;
      range.label.text = label;
      range.label.disabled = false;
      range.label.fill = color;
      range.label.location = 0;
      range.label.dx = -130;
      range.label.dy = 12;
      range.label.fontWeight = 'bold';
      range.label.fontSize = 12;
      range.label.horizontalCenter = 'left';
      range.label.inside = true;

      range.grid.stroke = am4core.color('#396478');
      range.grid.strokeOpacity = 1;
      range.tick.length = 200;
      range.tick.disabled = false;
      range.tick.strokeOpacity = 0.6;
      range.tick.stroke = am4core.color('#396478');
      range.tick.location = 0;

      range.locations.category = 1;
    }

    addRange('', chart.colors.getIndex(0));

    chart.cursor = new am4charts.XYCursor();

    barChart = chart;
  }, [data]);

  // 
  useEffect(
    () => () => {
      if (barChart) {
        barChart.dispose();
      }
    },
    [],
  );
  return <div {...props} id={id} />;
}

// PROPS TYPES:
ColumnHorizontalChart.propTypes = {
  id: PropTypes.string.isRequired,  // ID BIỂU ĐỒ
  titleChart: PropTypes.string, // TIÊU ĐỀ BIỂU ĐỒ
  data: PropTypes.array,  // DỮ LIỆU ĐỔ VÀO BIỂU ĐỒ
  dataFieldsCategory: PropTypes.string, // CHỦ THỂ CÁC CỘT = (1 NHÓM CỘT)
  dataFieldsValueX: PropTypes.string, // 
  serieName: PropTypes.string, // 
  // arrSeries: PropTypes.array, // CỘT + TÊN HIỂN THỊ CỦA NÓ TRONG CHÚ THÍCH LEGEND
};

export default memo(ColumnHorizontalChart);
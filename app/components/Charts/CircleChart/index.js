import React, { useEffect, memo, useState } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import Am4themesAnimated from '@amcharts/amcharts4/themes/animated';
import PropTypes from 'prop-types';

am4core.useTheme(Am4themesAnimated);

// TUANTRAN - "BIEU DO TRON - PIE CHART":
function CircleChart(props) {
  const { id, titleChart, data = [], isExport = false, onExportSuccess } = props;
  const [chartExport, setChartExport] = useState(null);
  let finalResult = [];
  if (data && data.length !== 0) {
    data.map(item => {
      if (item && item.bank) {
        let { bank = {} } = item;
        item.value = bank.value ? bank.value : 0;
        finalResult.push(item);
      }
      else if (item && (item.value || item.balance)) {
        item.value = item.name ? item.name : '';
        item.currentBalance = item.balance ? item.balance : 0;
        finalResult.push(item);
      }
    });
  }

  let circleChartVar;
  useEffect(
    () => {
      const chart = am4core.create(id, am4charts.PieChart);

      const title = chart.titles.create();
      title.text = titleChart;
      title.fontSize = 25;
      title.marginBottom = 20;
      title.fontWeight = 'bold';

      chart.data = finalResult;

      chart.logo.hidden = true;

      const pieSeries = chart.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = 'currentBalance';
      pieSeries.dataFields.category = 'value';

      // LEGEND
      chart.legend = new am4charts.Legend();
      chart.legend.position = 'right';
      chart.legend.width = '200px';
      chart.legend.maxHeight = '20vh';
      chart.legend.scrollable = true;

      // COLOR
      // pieSeries.colors.list = [
      //   am4core.color("#bc58c9"),
      //   am4core.color("#8fd141"),
      //   am4core.color("#be5239"),
      //   am4core.color("#9db9ba"),
      //   am4core.color("#513549"),
      //   am4core.color("#cbab53"),
      //   am4core.color("#535d35"),
      //   am4core.color("#476391"),
      //   //
      //   am4core.color("#845EC2"),
      //   am4core.color("#D65DB1"),
      //   am4core.color("#FF6F91"),
      //   am4core.color("#FF9671"),
      //   am4core.color("#FFC75F"),
      //   am4core.color("#F9F871"),
      // ];

      circleChartVar = chart;
      setChartExport(chart);
    },
    [data],
  );

  useEffect(
    () => {
      if (chartExport && isExport === true) {
        // console.log(chartExport);
        chartExport.exporting.export('pdf');
        onExportSuccess && onExportSuccess();
      }
    },
    [data, isExport, chartExport],
  );

  useEffect(
    () => () => {
      if (circleChartVar) {
        circleChartVar.dispose();
      }
    },
    [data],
  );
  return <div {...props} id={id} />;
}

// PROPS TYPES:
CircleChart.propTypes = {
  id: PropTypes.string.isRequired, // ID BIỂU ĐỒ
  titleChart: PropTypes.string, // TIÊU ĐỀ BIỂU ĐỒ
  data: PropTypes.array, // DỮ LIỆU ĐỔ VÀO BIỂU ĐỒ
};

export default memo(CircleChart);

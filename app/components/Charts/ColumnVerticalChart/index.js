import React, { useEffect, memo, useState  } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import Am4themesAnimated from '@amcharts/amcharts4/themes/animated';
import PropTypes from 'prop-types';

am4core.useTheme(Am4themesAnimated);


// TUANTRAN - "BIEU DO TRON - PIE CHART":
function ColumnVerticalChart(props) {
  // eslint-disable-next-line no-unused-vars
  const { id, titleChart, data, dataFieldsCategory, arrSeries} = props;
  let ColumnChart;
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

    
    // Add scrollbar: TT
    chart.scrollbarX = new am4core.Scrollbar();

    // "SCROLL BAR COLOR" - "normal"
    chart.scrollbarX.startGrip.background.fill = am4core.color("#6794dc");  // c1c1c1 , #a6c5f7 , 6794dc
    chart.scrollbarX.endGrip.background.fill = am4core.color("#6794dc");

    chart.scrollbarX.thumb.background.fill = am4core.color("#f1f1f1");  // #e4eeff ; #f1f1f1 ; #a6c5f7 // f9f9f9 // f1f1f1
    chart.scrollbarX.stroke = "#f1f1f1"; // border line color of scrollbar.
    // chart.scrollbarX.stroke = "#e4eeff"; // border line color of scrollbar.

    chart.scrollbarX.startGrip.icon.stroke = am4core.color("#ffffff");
    chart.scrollbarX.endGrip.icon.stroke = am4core.color("#ffffff");
    // "SCROLL BAR COLOR" - Applied on "hover"
    chart.scrollbarX.startGrip.background.states.getKey("hover").properties.fill = am4core.color("#6771dc");  // #6771dc , #6794dc
    chart.scrollbarX.endGrip.background.states.getKey("hover").properties.fill = am4core.color("#6771dc");
    chart.scrollbarX.thumb.background.states.getKey("hover").properties.fill = am4core.color("#6794dc");
    // "SCROLL BAR COLOR" - Applied on "mouse down"
    chart.scrollbarX.startGrip.background.states.getKey("down").properties.fill = am4core.color("#6771dc");
    chart.scrollbarX.endGrip.background.states.getKey("down").properties.fill = am4core.color("#6771dc");
    chart.scrollbarX.thumb.background.states.getKey("down").properties.fill = am4core.color("#6794dc"); 


    // "BUTTON ZOOM" - Applied on "mouse down"
    chart.zoomOutButton.background.cornerRadius(50, 50, 50, 50);
    chart.zoomOutButton.icon.stroke = am4core.color("#ffffff");
    chart.zoomOutButton.icon.strokeWidth = 2;
    chart.zoomOutButton.background.fill = am4core.color("#6794dc");
    chart.zoomOutButton.background.states.getKey("hover").properties.fill = am4core.color("#6771dc");


    // TIÊU ĐỀ
    const title = chart.titles.create();
    title.text = titleChart;
    title.fontSize = 25;
    title.marginBottom = 20;
    title.fontWeight = 'bold';
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    chart.data = data;

    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataFields.category = dataFieldsCategory;  // NHÓM CỘT
    // categoryAxis.dataFields.category = 'name';  //
    categoryAxis.renderer.minGridDistance = 40;
    categoryAxis.fontSize = 11;

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    // valueAxis.max = 2000;
    valueAxis.strictMinMax = true;
    valueAxis.renderer.minGridDistance = 30;


    function createSeries(field, displayName) {
      const series = chart.series.push(new am4charts.ColumnSeries());

      series.name = displayName;  // tuantran
      series.dataFields.categoryX = dataFieldsCategory; // tuantran
      // series.dataFields.categoryX = 'name'; //
      series.dataFields.valueY = field; // tuantran
      series.columns.template.tooltipText = '{valueY.value}';
      series.columns.template.tooltipY = 0;
      // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
    }

    // SỬA HARDCODE: 1
    arrSeries.map(item => {
      createSeries(item.fieldSerie, item.displayNameSerie);
    })

    ColumnChart = chart;

    chart.events.on("ready", function () {
      // TT -: BARCHART + BUTTON ZOOM IN - SAU KHI RENDER
      if (data.length > 20) {         
        categoryAxis.start = 0.962;
        categoryAxis.end = 1;       
      }
    });

  }, [data]);

  // hủy bỏ
  useEffect(
    () => () => {
      if (ColumnChart) {
        ColumnChart.dispose();
      }
    },
    [],
  );
  return <div {...props} id={id} />;
}

// PROPS TYPES:
ColumnVerticalChart.propTypes = {
  id: PropTypes.string.isRequired,  // ID BIỂU ĐỒ
  titleChart: PropTypes.string, // TIÊU ĐỀ BIỂU ĐỒ
  data: PropTypes.array,  // DỮ LIỆU ĐỔ VÀO BIỂU ĐỒ
  dataFieldsCategory: PropTypes.string, // CHỦ THỂ CÁC CỘT = (1 NHÓM CỘT)
  arrSeries: PropTypes.array, // CỘT + TÊN HIỂN THỊ CỦA NÓ TRONG CHÚ THÍCH LEGEND
};

export default memo(ColumnVerticalChart);
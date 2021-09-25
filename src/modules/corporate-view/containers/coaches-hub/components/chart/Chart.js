import React from 'react';
import FusionCharts from 'fusioncharts';
import charts from 'fusioncharts/fusioncharts.charts';
import ReactFC from 'react-fusioncharts';

import './styles.scss';

export class Chart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isChart: true,
      division: 'Studio'
    };
    charts(FusionCharts);
  }
  handleToggle() {
    this.setState({
      isChart: !this.state.isChart
    });
  }
  handleSelectChange() {
    return function (newValue) {
      this.setState({
        division: newValue
      });
    }.bind(this);
  }
  render() {
    let dataArea2D = {
      chart: {
        xAxisName: 'Day',
        yAxisName: '(People)',
        numberSuffix: ',000',
        paletteColors: '#ff6c00',
        bgColor: '#ffffff',
        showBorder: '0',
        showCanvasBorder: '0',
        plotBorderAlpha: '10',
        usePlotGradientColor: '0',
        plotFillAlpha: '50',
        showXAxisLine: '1',
        axisLineAlpha: '25',
        divLineAlpha: '10',
        showValues: '1',
        showAlternateHGridColor: '0',
        captionFontSize: '14',
        subcaptionFontSize: '14',
        subcaptionFontBold: '0',
        toolTipColor: '#ffffff',
        toolTipBorderThickness: '0',
        toolTipBgColor: '#000000',
        toolTipBgAlpha: '80',
        toolTipBorderRadius: '2',
        toolTipPadding: '5',
        theme: 'zune,ocean',
        plotGradientColor: '#eeeeee',
        plotFillAngle: '90'
      },

      data: [
        {
          label: '14/7',
          value: '1,200',
          displayvalue: '1,200',
          showvalue: '1',
          anchoralpha: '100',
          anchorradius: '4',
          stepSkipped: false,
          appliedSmartLabel: true
        },
        {
          label: '15/7',
          value: '3,300',
          displayvalue: '3,300',
          showvalue: '1',
          anchoralpha: '100',
          anchorradius: '4',
          stepSkipped: false,
          appliedSmartLabel: true
        },
        {
          label: '16/7',
          value: '2,300',
          displayvalue: '2,300',
          showvalue: '1',
          anchoralpha: '100',
          anchorradius: '4',
          stepSkipped: false,
          appliedSmartLabel: true
        },
        {
          label: '17/7',
          value: '1,900',
          displayvalue: '1,900',
          showvalue: '1',
          anchoralpha: '100',
          anchorradius: '4',
          stepSkipped: false,
          appliedSmartLabel: true
        },
        {
          label: '18/7',
          value: '4,000',
          displayvalue: '4,000',
          showvalue: '1',
          anchoralpha: '100',
          anchorradius: '4',
          stepSkipped: false,
          appliedSmartLabel: true
        },
        {
          label: '19/7',
          value: '3,900',
          displayvalue: '3,900',
          showvalue: '1',
          anchoralpha: '100',
          anchorradius: '4',
          stepSkipped: false,
          appliedSmartLabel: true
        },
        {
          label: '20/7',
          value: '4,700',
          displayvalue: '4,700',
          showvalue: '1',
          anchoralpha: '100',
          anchorradius: '4',
          stepSkipped: false,
          appliedSmartLabel: true
        }
      ]
    };
    let chartConfigsArea2D = {
      id: 'revenue-chart-1',
      renderAt: 'revenue-chart-container-1',
      type: 'area2d',
      width: '98%',
      height: '70%',
      dataFormat: 'json',
      dataSource: dataArea2D
    };
    return (
      <div className='chart'>
        <p className='title-chart'>{'Personal Record Breaking Member Count'}</p>
        <ReactFC {...chartConfigsArea2D} />
      </div >
    );
  }
}

import React from 'react';
import PropTypes from 'prop-types';
import FusionCharts from 'fusioncharts';
import charts from 'fusioncharts/fusioncharts.charts';
import ReactFC from 'react-fusioncharts';
import { FormattedMessage } from 'react-intl';

import { ChartType, FormatType } from './ChartConstants';

import './styles.scss';

/**
 * Using FusionChart for this customization
 * Refer: http://www.fusioncharts.com/dev/api/fusioncharts.html
 */
export class Chart extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    charts(FusionCharts);
  }

  /**
   * Populate chart theme
   */
  populateChartThemeCustomization() {
    return {
      plotFillAlpha: '90',
      paletteColors: '#858d90, #3e84cc, #379c7a, #ea4807, #af0505',
      baseFontColor: '#333333',
      baseFontSize: '15',
      baseFont: 'Helvetica Neue,Arial',
      captionFontSize: '14',
      yAxisNameFontBold: '0',
      yAxisNameFontColor: '#7a7a7a',
      subcaptionFontSize: '14',
      subcaptionFontBold: '0',
      showBorder: '0',
      bgColor: '#ffffff',
      showShadow: '0',
      canvasBgColor: '#ffffff',
      canvasBorderAlpha: '0',
      divlineAlpha: '100',
      divlineColor: '#999999',
      divlineThickness: '1',
      divLineIsDashed: '1',
      divLineDashLen: '1',
      divLineGapLen: '1',
      showplotborder: '0',
      valueFontColor: '#ffffff',
      usePlotGradientColor: '0',
      placeValuesInside: '1',
      showHoverEffect: '1',
      rotateValues: '1',
      showXAxisLine: '1',
      xAxisLineThickness: '1',
      xAxisLineColor: '#999999',
      showAlternateHGridColor: '0',
      legendBgAlpha: '0',
      legendBorderAlpha: '0',
      legendShadow: '0',
      legendItemFontSize: '16',
      legendItemFontColor: '#666666',
      showValues: '0'
    };
  }

  populateChartFormat() {
    const { formatType } = this.props;

    switch (formatType) {
      case FormatType.TimeWithMiliseconds:
        return {
          decimals: '2',
          forceDecimals: '1',
          formatNumberScale: '0',
          thousandSeparator: ':',
          numDivLines: 5,
          thousandSeparatorPosition: '2'
        };
      case FormatType.Time:
        return {
          formatNumberScale: '0',
          forceDecimals: '0',
          numDivLines: 5,
          thousandSeparator: ':',
          thousandSeparatorPosition: '2'
        };
      case FormatType.Distance:
        return {
          decimals: '3',
          forceDecimals: '1',
          formatNumberScale: '0',
          thousandSeparator: ',',
          numDivLines: 5
        };
      default:
        return {
          decimals: '2',
          forceDecimals: '1',
          formatNumberScale: '0',
          thousandSeparator: ':',
          numDivLines: 5,
          thousandSeparatorPosition: '2'
        };
    }
  }

  /**
   * Populate chart configuration
   */
  populateChartConfiguration() {
    const {
      chartType,
      width,
      height,
      categories,
      dataset,
      yaxismaxvalue,
      yAxisName
    } = this.props;

    return {
      type: chartType || ChartType.MultiSeriesColumn2D,
      width,
      height,
      dataFormat: 'json',
      dataSource: {
        chart: {
          ...this.populateChartThemeCustomization(),
          ...this.populateChartFormat(),
          yAxisName,
          yaxismaxvalue
        },
        categories,
        dataset
      }
    };
  }

  render() {
    const { dataset } = this.props;

    return (
      <div className='chart-wrapper'>
        {dataset.length === 0 && <span className='no-data-text'>
          <FormattedMessage id={'General.Table.NoData'} />
        </span>}
        {dataset.length > 0 && <ReactFC {...this.populateChartConfiguration()} />}
      </div>
    );
  }
}

/**
 * Typechecking With PropTypes
 * Reference https://facebook.github.io/react/docs/typechecking-with-proptypes.html
 * Proptypes: https://github.com/facebook/prop-types
 */
Chart.propTypes = {
  categories: PropTypes.any,
  chartType: PropTypes.string,
  dataset: PropTypes.any,
  formatType: PropTypes.string,
  height: PropTypes.any,
  width: PropTypes.string,
  yAxisName: PropTypes.string,
  yaxismaxvalue: PropTypes.any
};


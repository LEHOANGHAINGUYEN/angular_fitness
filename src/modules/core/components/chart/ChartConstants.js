/**
 * Chart type
 * Refer: http://www.fusioncharts.com/dev/getting-started/list-of-charts.html
 */
export const ChartType = {
  Column2D: 'column2d',
  MultiSeriesColumn2D: 'mscolumn2d'
};

/**
 * Format type (Time, Distance, etc...)
 * We can customize format type for chart so that we can define the constants
 * and base on that reuse this format by the type
 */
export const FormatType = {
  Time: 'Time',
  TimeWithMiliseconds: 'TimeWithMiliseconds',
  Distance: 'Distance'
};

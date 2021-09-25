/**
 * Table column options that using to render header column for table
 */
export class TableColumn {
  /**
   * The constructor of tableColumn class
   * @param {object} options The options object to build table column
   * @param {string} options.headerName The value display on column header
   * @param {string} options.dataField The field of data you want to show on column
   * @param {boolean} options.isKey Use isKey to tell table which column is unique
   * @param {string} options.width Set the column width. ex: '150px' or '20%', Remeber to an unit for width will be better
   * @param {string} options.dataAlign Set align on column, available value is left, center, right, start and end. Default is 'left'
   * @param {string} options.headerAlign Set align on header, available value is left, center, right, start and end. Default is 'center'
   * @param {any} options.dataFormat To customize the column. This callback function should return a String or a React Component
   * @param {boolean} options.dataSort True to enable table sorting. Default is enabled.
   * @param {string} options.className Add custom css class on table header column, this prop only accept String or Function
   */
  constructor(options) {
    this.headerName = options.headerName || '';
    this.dataField = options.dataField || '';
    this.isKey = options.isKey;
    this.width = options.width;
    this.dataAlign = options.dataAlign || 'left';
    this.headerAlign = options.headerAlign || 'left';
    this.dataFormat = options.dataFormat || this.columnFormat;
    this.dataSort = options.dataSort !== undefined && options.dataSort !== null ?
      options.dataSort :
      true;
    this.className = options.className || '';
  }

  /**
   * The default function to format column if no given dataFormat receive
   * @param {any} cell Value of this column
   * @param {object} row The row object
   */
  columnFormat(cell) {
    return `${cell || ''}`;
  }
}

export default class CalendarFormat {
  constructor() {

  }
  static getCalendarFormat(locale) {
    let format;
    switch (locale) {
      case 'en': {
        format = 'dddd, MM/DD/YYYY';
        break;
      }
      case 'es': {
        format = 'dddd, DD/MM/YYYY';
        break;
      }
      case 'fr': {
        format = 'dddd, DD/MM/YYYY';
        break;
      }
      default: {
        format = 'L';
      }
    }
    return format;
  }
}

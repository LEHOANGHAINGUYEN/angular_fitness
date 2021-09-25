import { AppConstants } from 'common';
import * as _ from 'lodash';

class ApiFakeService {
  constructor() {
  }

  get(path) {
    let data;
    let baseUrl = path.split('?')[0];
    let queryObject = this.parseQueryString(path.split('?')[1]);

    switch (baseUrl) {
      case 'corporate/members':
        data = AppConstants.corMembers;
        break;
      case 'corporate/interactive-leader-board':
        data = AppConstants.corporateInteractiveLeaderBoard;
        break;
      case 'corporate/permission':
        data = AppConstants.userPermission;
        break;
      case 'leader-board/today-personal-records':
        data = AppConstants.todayPersonalRecordsData;
        break;
      case 'corporate/reports':
        data = AppConstants.userRepeatUsage;
        break;
      default:
        data = [];
        break;
    }

    // Sort data
    if (queryObject.sort) {
      data = this.sortData(data, queryObject.sort);
    }
    delete queryObject.sort;

    // Search by keyword data
    if (queryObject.keyword) {
      data = this.searchByKeyword(
        data,
        queryObject.keyword,
        queryObject.searchFields,
        queryObject.fullTextSearch);
    }
    delete queryObject.keyword;
    delete queryObject.fullTextSearch;
    delete queryObject.searchFields;

    let pagingOptions = {};
    pagingOptions.pageIndex = queryObject.pageIndex;
    delete queryObject.pageIndex;
    pagingOptions.pageSize = queryObject.pageSize;
    delete queryObject.pageSize;

    data = this.search(data, queryObject);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.paging(data, pagingOptions));
      }, 500);
    });
  }

  parseQueryString(queryStr) {
    if (typeof queryStr !== 'string') {
      return {};
    }

    queryStr = queryStr.trim().replace(/^\?/, '');

    if (!queryStr) {
      return {};
    }

    return queryStr.trim().split('&').reduce(function (ret, param) {
      let parts = param.replace(/\+/g, ' ').split('=');
      let value = parts[1] === undefined ? null : decodeURIComponent(parts[1]);

      if (value === 'false' || value === 'true') {
        // Parse to boolean
        value = value === 'true';
      } else if (!_.isNaN(value * 1)) {
        // Parse to number
        value *= 1;
      }

      ret[parts[0]] = value;
      return ret;
    }, {});
  }

  searchByKeyword(data, keyword, searchFields, fullTextSearch) {
    let checkKeyInSearchFields = (key, fields) => {
      // Default if fields is undefined then search all key
      if (_.isUndefined(fields)) {
        return true;
      }

      return fields.indexOf(key) !== -1;
    };

    keyword = `${keyword}`.trim().toLowerCase();

    return _.filter(data, (item) => {
      let isMatch = false;

      for (let key in item) {
        if (fullTextSearch && !isMatch && checkKeyInSearchFields(key, searchFields)) {
          isMatch = (`${item[key]}`).toLowerCase().indexOf(`${keyword}`.toLowerCase()) !== -1;
        } else if (!fullTextSearch && !isMatch && checkKeyInSearchFields(key, searchFields)) {
          let arrKeys = (`${item[key]}`).split(' ');

          for (let i = 0; i < arrKeys.length; i++) {
            if (!isMatch) {
              isMatch = (`${arrKeys[i]}`).toLowerCase().startsWith(keyword);
            }
          }
        }
      }

      return isMatch;
    });
  }

  search(data, options) {
    return _.filter(data, (item) => {
      let isHasntAttr = true;
      let isMatch = true;

      for (let key in options) {
        if (isMatch) {
          isHasntAttr = false;
          isMatch = item[key] === options[key];
        }
      }

      return isHasntAttr || isMatch;
    });
  }

  paging(data, options) {
    let count = data.length;
    let offset = (options.pageIndex - 1) * options.pageSize;
    let rows = _.slice(data, offset, offset + options.pageSize);

    return {
      count,
      rows
    };
  }

  sortData(data, sort) {
    let sortKey = sort.split('_')[0];
    let sortBy = sort.split('_')[1];

    return _.orderBy(data, sortKey, sortBy);
  }
}

export default new ApiFakeService();

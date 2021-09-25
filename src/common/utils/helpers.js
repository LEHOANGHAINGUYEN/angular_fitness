import * as _ from 'lodash';
import {
  Constants
} from 'common';

function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
// Check variable is number or string inside double quotes, return true if the variable is number
export function isNumber(n) {
  return /^-?[\d.]+(?:e-?\d+)?$/.test(n);
}
export function updateLocalStorage(key, value, type = 'string') {
  if (type === 'array') {
    const list = JSON.parse(localStorage.getItem(key)) || [];
    if (!list.includes(value)) {
      list.push(value);
      localStorage.setItem(key, JSON.stringify(list));
    }
  } else {
    localStorage.setItem(key, value);
  }
}
export function removeLocalStorage(key) {
  const item = localStorage.getItem(key);
  if (_.isNull(item) || _.isEqual(item, 'null')) {
    localStorage.removeItem(key);
  }
}
export function getSuggestions(suggestions, value) {
  let escapedValue = escapeRegexCharacters(value.trim());
  if (escapedValue === '') {
    return [];
  }
  let list = suggestions.filter((val) => {
    let conditionFirstName = val.firstName.toLowerCase().startsWith(escapedValue.toLowerCase());
    let conditionLastName = val.lastName.toLowerCase().startsWith(escapedValue.toLowerCase());
    return conditionFirstName || conditionLastName;
  });
  return list;
}

export function splitSpace(arrTitle) {
  let result;
  if (arrTitle) {
    result = arrTitle.replace(/ /g, '');
  }
  return result;
}

/**
 * Sum all elements of array disregard NaN
 *
 * @export
 * @param {any} arr array needs to sum
 * @returns
 */
export function sumArrayDisregardNaN(arr) {
  let sum = 0;
  if (!_.isArray(arr)) {
    return parseInt(arr, 10);
  }
  for (let i = 0; i <= arr.length; i++) {
    if (!isNaN(arr[i])) {
      sum += arr[i];
    }
  }
  return sum;
}

export function findMatchesItem(list, value, propName) {
  let result;
  if (value) {
    let escapedValue = escapeRegexCharacters(value.trim());

    if (escapedValue === '') {
      return [];
    }

    value = !isNaN(parseInt(value, 10)) ? parseInt(value, 10) : value;

    for (let i = 0; i < list.length; i++) {
      let s = list[i];
      if (s[propName] === value) {
        result = s;
        break;
      }
    }
  }

  return result;
}

export function findMatchesHightlight(text, query) {
  let result = [];
  let queries = query.split(' ');
  for (let i = 0; i < queries.length; i++) {
    let q = queries[i];
    let c = q.length;
    let index = text.toLowerCase().indexOf(q.toLowerCase());
    if (index > -1) {
      result.push([index, index + c]);
    }
  }
  return result;
}

export function mobileAndTabletCheck() {
  let check = false;
  (function (a) {
    // eslint-disable-next-line max-len
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i
      .test(a.substr(0, 4))) {
      check = true;
    }
  }(navigator.userAgent || navigator.vendor || window.opera));
  return check;
}


/**
 * Build query url based on passed parameters
 * @param {object} parameters Specify the params to build query url
 */
export function buildUrlQuery(parameters) {
  let queryUrl = '';
  let qs = '';

  /* eslint-disable guard-for-in */
  for (let key in parameters) {
    let value = parameters[key];

    if (!_.isUndefined(value) && !_.isNull(value) && value !== '') {
      qs += `${encodeURIComponent(key)}=${encodeURIComponent(value)}&`;
    }
  }
  /* eslint-enable */
  if (qs.length > 0) {
    qs = qs.substring(0, qs.length - 1); // chop off last "&"
    queryUrl = `${queryUrl}?${qs}`;
  }

  return queryUrl;
}

/**
 *
 * Exit fullscreen function
 *
 */
export function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

/**
 * Expand fullscreen
 */
export function expandFullscreen() {
  // If screen has already been fullscreen then return
  if (window.innerHeight === screen.height) {
    return;
  }
  // Otherwise request fullscreen
  let el = document.documentElement,
    rfs = el.requestFullscreen ||
      el.webkitRequestFullScreen ||
      el.mozRequestFullScreen ||
      el.msRequestFullscreen;

  rfs.call(el);
}

/**
 *
 * Validate Studio Roles
 *
 */
export function validateStudioRoles(roles) {
  if (roles.includes('STUDIO_OWNER') || roles.includes('STUDIO_USER')) {
    return true;
  }
  return false;
}

/**
 * Create uuid
 */
export function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return `${s4() + s4()}-${s4()}-${s4()}-${
    s4()}-${s4()}${s4()}${s4()}`;
}

export function getEnumDescription(object, value) {
  for (let prop in object) {
    if (object[prop] === value) {
      return prop;
    }
  }

  return '';
}

/**
 *
 * Delay input handler
 *
 */
export const delay = (function () {
  let timer = 0;
  return function (callback, ms) {
    clearTimeout(timer);
    timer = setTimeout(callback, ms);
  };
}());

/**
 * Format member name as "Fist name concat with initial character of Last name"
 * Ex: John Cornor => John C
 * @param {string} firstName Specify the first name of member
 * @param {string} lastName Specify the last name of member
 */
export function formatMemberName(firstName, lastName) {
  if (!firstName) {
    return undefined;
  }

  // Trim name before concatination
  if (lastName) {
    lastName = `${lastName}`.trim();
  }

  return `${firstName.trim()} ${`${lastName || ''}`.charAt(0).toUpperCase()}.`;
}

/**
 * Return a javascript object containing the URL parameters
 * Read a page's GET URL variables and return them as an associative array.
 */
export function getUrlVars() {
  let vars = {};
  let hash;
  let hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');

  for (let i = 0; i < hashes.length; i++) {
    hash = hashes[i].split('=');
    vars[hash[0]] = hash[1];
  }

  return vars;
}

/**
 * Render email to following format	Emi*****@xxx.com
 * @param {String} email The email need format
 */
export function renderEmail(email) {
  if (!email) {
    return undefined;
  }

  let arrs = email.split('@');
  let hash = arrs[0].substring(arrs[0].length - 6, arrs[0].length - 2);

  return email.replace(hash, '**');
}

/**
 * Get data in localStorage by key
 *
 * @export
 * @param {any} key
 * @returns
 */
export function getDataInLocalStorage(key) {
  let data = localStorage.getItem(key);
  if (data && !_.isNull(data) && !_.isEqual(data, 'null')) {
    data = JSON.parse(localStorage.getItem(key));
  } else {
    data = [];
  }
  return data;
}

/**
 * Clear all storage if key contains prefix string
 * @param {string} prefix
 */
export function clearStorageByPrefix(prefix) {
  const arr = [];
  for (let i = 0; i < localStorage.length; i++) {
    if (localStorage.key(i).startsWith(prefix)) {
      arr.push(localStorage.key(i));
    }
  }

  for (let i = 0; i < arr.length; i++) {
    localStorage.removeItem(arr[i]);
  }
}
export function getChallengeTemplateById(challengeTemplateId, challengeTemplate) {
  let ct = {};
  _.forIn(challengeTemplate, value => {
    if (value.ChallengeTemplateId === challengeTemplateId) {
      ct = value;
      return false;
    }
    return true;
  });
  return ct;
}
export function getChallengeTemplateTypeById(challengeTemplateId, challengeTemplateTypeId, challengeTemplate) {
  const ct = getChallengeTemplateById(challengeTemplateId, challengeTemplate);
  if (ct.ChallengeTemplateTypes.length > 0) {
    return _.find(ct.ChallengeTemplateTypes, ['ChallengeTemplateTypeId', challengeTemplateTypeId]);
  }
  return undefined;
}
export function getInitChallengeTemplateTypeId(challengeTemplateId, challengeTemplate) {
  let challengeTemplateTypeId;
  _.forIn(challengeTemplate, value => {
    if (value.ChallengeTemplateId === challengeTemplateId) {
      challengeTemplateTypeId = value.ChallengeTemplateTypes.length > 0
        ? value.ChallengeTemplateTypes[0].ChallengeTemplateTypeId : undefined;
      return false;
    }
    return true;
  });
  return challengeTemplateTypeId;
}
export function createListChallengeTemplate(challengeTemplate) {
  return _.sortBy(Object.keys(challengeTemplate).map(ct => {
    return {
      label: challengeTemplate[ct].TemplateName,
      value: challengeTemplate[ct].ChallengeTemplateId
    };
  }), ['value']);
}

export function getEntryTypeId(entryType) {
  switch (entryType) {
    case Constants.MetricEntryType.Time:
      return 1;
    case Constants.MetricEntryType.Distance:
      return 2;
    case Constants.MetricEntryType.Reps:
      return 3;
    default:
      return null;
  }
}

export function getEntryType(entryTypeId) {
  switch (entryTypeId) {
    case 1:
      return Constants.MetricEntryType.Time;
    case 2:
      return Constants.MetricEntryType.Distance;
    case 3:
      return Constants.MetricEntryType.Reps;
    default:
      return null;
  }
}
/**
 * Get challenge title
 * @param {*} challengeId
 * @param {*} metricEntry the first metric entry of challenge
 */
export function getTitleChallenge(challengeTemplateId, challengeTemplate) {
  if (!challengeTemplateId) { return undefined; }
  return getChallengeTemplateById(challengeTemplateId, challengeTemplate).TemplateName;
}

export function getPrefixTitleChallenge(fitnessTypeId) {
  return fitnessTypeId === Constants.FitnessType.SignatureWorkout ? 'General.ChallengeSignatureLabel' : 'General.ChallengeLabel';
}

/**
 * Get Initial leaderboard opt
 *
 * @returns Initial leaderboard opt
 */
export function getLeaderboardOpt(mboMemberId) {
  let leaderboardOpt = true;
  const leaderboardOptionalKey = localStorage.getItem(Constants.LeaderboardOptionalKey);
  if (leaderboardOptionalKey) {
    leaderboardOpt = !JSON.parse(leaderboardOptionalKey).includes(mboMemberId);
  }
  return leaderboardOpt;
}
/**
 * Remove MemberUUID when switch to Show
 *
 * @param {any} memberUUId MemberUUID is removed
 */
export function removeLeaderboardOpt(mboMemberId) {
  const leaderBoardOpt = localStorage.getItem(Constants.LeaderboardOptionalKey);
  if (leaderBoardOpt) {
    const newLeaderboardOpt = JSON.parse(leaderBoardOpt);
    _.remove(newLeaderboardOpt, (n) => {
      return n === mboMemberId;
    });
    localStorage.setItem(Constants.LeaderboardOptionalKey, JSON.stringify(newLeaderboardOpt));
  }
}
/**
 * Filter data leaderboard depend optional
 *
 * @param {any} data data before filter
 * @returns data after filter
 * @memberof TCALTable
 */
export function filterDataOptLeaderboard(data) {
  const leaderboardOptionalKey = localStorage.getItem(Constants.LeaderboardOptionalKey);
  return _.filter(data, (item) => {
    if (leaderboardOptionalKey && !_.isNull(leaderboardOptionalKey) && !_.isEqual(leaderboardOptionalKey, 'null')) {
      return !JSON.parse(leaderboardOptionalKey).includes(item.MemberUUId);
    }
    return item;
  });
}
// Resort same rank after hide in leaderboard
export function reSortRank(leaders) {
  for (let i = 0; i < leaders.length; i++) {
    const lead = leaders[i];
    if (i === 0) {
      lead.Rank = i + 1;
    } else if (!lead.Result || (lead.Result !== leaders[i - 1].Result)) {
      lead.Rank = leaders[i - 1].Rank + 1;
    } else {
      lead.Rank = leaders[i - 1].Rank;
    }
  }
}

/**
 * Format distance data
 * @param {*} result input data
 */
export function formatDistanceResult(result) {
  return result.length < 6 ? `0${result}` : result;
}

/**
 * Convert data of Today leaderboard, Interactive leaderboard based on measurement unit setting
 * @param {*} input Conditions to convert data
 */
export function convertDataUnitMeasurement(input) {
  const coefficient = input.challengeType === Constants.MetricEntryType.Distance
    ? Constants.CoefficientUnitMeasurement.Distance : Constants.CoefficientUnitMeasurement.Weight;
  const isKG = input.weightFloorUnitMeasurement === Constants.UnitMeasurementType.Metric;
  const isMetric = input.unitDistanceMeasurement
    && input.unitDistanceMeasurement === Constants.UnitMeasurementType.Metric;
  const isDefaultUnit = input.challengeType === Constants.MetricEntryType.Distance ? isMetric : isKG;
  const decimal = input.challengeType === Constants.MetricEntryType.Distance ? 3 : 1;

  (input.data || []).forEach((leader) => {
    leader.Result = (parseFloat(leader.Result, 10) / (isDefaultUnit ? 1 : coefficient)).toFixed(decimal);
    leader.Result = input.challengeType === Constants.MetricEntryType.Distance
      ? formatDistanceResult(leader.Result) : leader.Result;
  });

  return input.data;
}

/**
 * Convert data of Inter Studio Leaderboard based on measurement unit setting
 * @param {*} input Conditions to convert data
 */
export function convertDataUnitMeasurementInterStudio(input) {
  const isMetric = input.unitDistanceMeasurement
    && input.unitDistanceMeasurement === Constants.UnitMeasurementType.Metric;
  const coefficient = isMetric ? 1 : Constants.CoefficientUnitMeasurement.Distance;
  (input.data || []).forEach(studio => {
    studio.studioAverage = formatDistanceResult((parseFloat(studio.studioAverage) / coefficient).toFixed(3));
  });
  input.currentHomeSt.studioAverage = formatDistanceResult(
    (parseFloat(input.currentHomeSt.studioAverage) / coefficient).toFixed(3)
  );
  return input;
}

export function saveState(state) {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
    return true;
  } catch (err) {
    return undefined;
  }
}
export function loadState() {
  try {
    const serializedState = localStorage.getItem('state');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
}
/**
 * Convert data of Personal record breaker based on measurement unit setting
 * @param {*} input Conditions to convert data
 */
export function convertDataUnitMeasurementPersonalBreaker(input) {
  const coefficient = input.challengeType === Constants.MetricEntryType.Distance
    ? Constants.CoefficientUnitMeasurement.Distance : Constants.CoefficientUnitMeasurement.Weight;
  const isKG = input.weightFloorUnitMeasurement === Constants.UnitMeasurementType.Metric;
  const decimal = input.challengeType === Constants.MetricEntryType.Distance ? 3 : 1;

  (input.data || []).forEach((leader) => {
    const isMetric = input.uom[leader.EquipmentId]
      && input.uom[leader.EquipmentId] === Constants.UnitMeasurementType.Metric;
    const isDefaultUnit = input.challengeType === Constants.MetricEntryType.Distance ? isMetric : isKG;
    leader.NewRecord = (parseFloat(leader.NewRecord, 10) / (isDefaultUnit ? 1 : coefficient)).toFixed(decimal);
    leader.PreviousRecord = (parseFloat(leader.PreviousRecord, 10) / (isDefaultUnit ? 1
      : coefficient)).toFixed(decimal);
    leader.DiffRecord = (parseFloat(leader.NewRecord) - parseFloat(leader.PreviousRecord)).toFixed(decimal);
    if (input.challengeType === Constants.MetricEntryType.Distance) {
      leader.NewRecord = formatDistanceResult(leader.NewRecord);
      leader.PreviousRecord = formatDistanceResult(leader.PreviousRecord);
      leader.DiffRecord = formatDistanceResult(leader.DiffRecord);
    }
  });
  return input.data;
}

export function getOrdinalSuffix(number) {
  if (number % 100 >= 11 && number % 100 <= 13) {
    return 'General.Rank.Other';
  }
  switch (number % 10) {
    case 1: return 'General.Rank.1st';
    case 2: return 'General.Rank.2nd';
    case 3: return 'General.Rank.3st';
    default: return 'General.Rank.Other';
  }
}

export function renderUOM(uom, entryType, equipmentId) {
  if (entryType === Constants.MetricEntryType.Time) {
    return 'MINUTE';
  } else if (entryType === Constants.MetricEntryType.Distance) {
    if (equipmentId === Constants.EquipmentType.Row) {
      return 'METER';
    }
    return uom[equipmentId] === Constants.UnitMeasurementType.Metric ? 'KILOMETER' : 'MILE';
  }
  return '';
}

// Find Diff between 2 Strings
export function findDiffString(str1, str2) {
  let diffStr = '';
  str2.split('').forEach(function (val, index) {
    if (val.toUpperCase() !== str1.charAt(index).toUpperCase()) {
      diffStr += val;
    }
  });
  return diffStr;
}
/**
 * Export default helpers function
 */
export default {
  getUrlVars,
  formatMemberName,
  delay,
  getEnumDescription,
  guid,
  exitFullscreen,
  buildUrlQuery,
  mobileAndTabletCheck,
  findMatchesHightlight,
  findMatchesItem,
  getSuggestions,
  splitSpace,
  expandFullscreen,
  renderEmail,
  clearStorageByPrefix,
  getTitleChallenge,
  getPrefixTitleChallenge,
  removeLocalStorage,
  getLeaderboardOpt,
  removeLeaderboardOpt,
  filterDataOptLeaderboard,
  reSortRank,
  convertDataUnitMeasurementPersonalBreaker,
  formatDistanceResult,
  saveState,
  loadState,
  getOrdinalSuffix,
  renderUOM,
  getInitChallengeTemplateTypeId,
  getChallengeTemplateById,
  getChallengeTemplateTypeById,
  createListChallengeTemplate,
  getEntryTypeId,
  findDiffString,
  convertDataUnitMeasurementInterStudio,
  convertDataUnitMeasurement,
  getEntryType,
  updateLocalStorage,
  sumArrayDisregardNaN,
  isNumber
};

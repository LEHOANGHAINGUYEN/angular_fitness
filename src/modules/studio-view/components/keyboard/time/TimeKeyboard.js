import React from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import { FormattedMessage, intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { Constants, SelectOptionsConstants, Helpers } from 'common';
import { ModalType, ModalResult } from 'modules/core/components';

import './styles.scss';
import BackImg from './images/back_keyboard_button.svg';
import { SubstituteArea, ChallengeSubTypeSelect, MultiInput } from './components';
import { Switch } from 'modules/core/components/switch/Switch';
import { IconMale, IconFemale, Logo } from 'modules/shared/images';

export class TimeKeyboard extends React.Component {
  constructor(props) {
    super(props);
    this.unitOfMeasure = {
      1: props.treadmillUnitMeasurement,
      2: props.striderUnitMeasurement,
      3: props.bikeUnitMeasurement,
      4: props.treadmillUnitMeasurement
    };
    this.state = this.initState(this.props.numberOfRound);
    Helpers.removeLocalStorage(Constants.LeaderboardOptionalKey);
  }
  initState(numberOfRound) {
    const { metricEntryType, origin, challengeType, treadmillUnitMeasurement, substituteId, challengeTemplateId, challengeTemplateTypeId, challengeTemplate, marathonTypeId } = this.props;
    const { isDriTri, isRowTime, isRowDistance,
      isWeightFloorEquipment } = challengeType;
    const isDistance = metricEntryType === Constants.MetricEntryType.Distance && !isDriTri;
    let obj = (() => {
      let roundState;
      for (let i = 1; i <= numberOfRound; i++) {
        let challengeResultHistoryId, isClear, stateInput;
        if (!_.isUndefined(origin)) {
          // Indicate whether number is active (inputed) in result
          // ex: 1: 0, 2: 1, 3: 1 => 1: deactive (no input value), 2: active, 3: active
          let roundResult = origin[`round${i}`] ? origin[`round${i}`].result : {
            1: [],
            2: [],
            3: []
          };
          if (!_.isUndefined(origin[`round${i}`])) {
            stateInput = _.filter(_.values(roundResult), function (item) {
              return item.length === 0;
            }).length === 3 ?
              { 1: 0, 2: 0, 3: 0 } : { 1: 1, 2: 1, 3: 1 };
            isClear = _.filter(_.values(roundResult), function (item) {
              return item.length === 0;
            }).length === 3 ? true : false;
            challengeResultHistoryId = origin[`round${i}`].challengeResultHistoryId ? origin[`round${i}`].challengeResultHistoryId : undefined;
          } else {
            stateInput = {
              1: 0,
              2: 0,
              3: 0
            };
            isClear = true;
            challengeResultHistoryId = undefined;
          }
          let showingTimeOrigin;
          if (origin) {
            showingTimeOrigin = {
              1: origin[`round${i}`] ? this.joinArrayResult(roundResult[1], isWeightFloorEquipment) : `00${isWeightFloorEquipment ? '0' : ''}`,
              2: origin[`round${i}`] ? this.joinArrayResult(roundResult[2], isDistance) : `00${isDistance ? '0' : ''}`,
              3: origin[`round${i}`] ? this.joinArrayResult(roundResult[3]) : '00'
            };
          } else {
            showingTimeOrigin = {
              1: `00${isWeightFloorEquipment ? '0' : ''}`,
              2: `00${isDistance ? '0' : ''}`,
              3: '00'
            };
          }

          roundState = {
            ...roundState,
            [`round${i}`]: {
              time: origin ? roundResult : {
                1: [],
                2: [],
                3: []
              },
              showingTime: showingTimeOrigin,
              challengeResultHistoryId,
              stateInput,
              previousValue: {
                substituteId: this.props.substituteId,
                challengeTemplateTypeId: this.props.challengeTemplateTypeId,
                time: _.cloneDeep(origin ? roundResult : {
                  1: [],
                  2: [],
                  3: []
                }),
                showingTime: _.cloneDeep(showingTimeOrigin),
                stateInput: _.cloneDeep(stateInput)
              },
              isClear,
              isInitial: true,
              count: 0,
              position: (isDriTri || isRowTime) && !isRowDistance ? 3 : 2,
              positionWeightFloor: 1
            }
          };
        }
      }
      return roundState;
    })();

    return {
      ...obj,
      selectedRound: 1,
      isDriTri,
      isRowTime,
      isWeightFloorEquipment,
      challengeTemplateTypeId: challengeTemplateId === challengeTemplate.MarathonMonth.ChallengeTemplateId ? marathonTypeId : challengeTemplateTypeId,
      substituteId: this.props.substituteId,
      unitOfMeasure: substituteId ? this.unitOfMeasure[substituteId] : treadmillUnitMeasurement
    };
  }
  onShowed() {
    let kb = this;
    $('.time-input').on('focus', function (e) {
      kb.setState({ position: parseInt(e.target.id, 10) });
      $(e.target).blur();
    });
  }

  cancel() {
    this.props.close();
  }

  /**
   * Join the value from input array and return view value that
   * used for dislaying on input screen result
   * ex: [2] => return '02'; [] => return '00'; [1, 2] => return '12'
   * @param {Array} arrays Specify array value that use for join
   */
  joinArrayResult(arrays, isThousandths) {
    if (arrays.length === 0) {
      return `00${isThousandths ? '0' : ''}`;
    } else if (arrays.length === 1) {
      return `0${isThousandths ? '0' : ''}${arrays[0]}`;
    } else if (arrays.length === 2) {
      return `${isThousandths ? '0' : ''}${arrays.join('')}`;
    } else if (arrays.length === 3) {
      return arrays.join('');
    }
    return arrays.slice(0, 2).join('');
  }

  /**
   * Handle on number button is clicked
   * @param {number} number The number that user click on
   */
  onNumberClick(number, roundNumber, isThousandths) {
    // If *metric equipment of this challenge is Row Equipment*
    // or *this challenge type is Dri-Tri* then UI will show milisecond field (hasMiliseconds will be true).
    // Otherwise
    const { isRowTime, isDriTri } = this.state;
    const { isDistance, isWeightFloorEquipment } = isThousandths;
    let hasMiliseconds = (isRowTime || isDriTri) && !isDistance;
    const { challenge } = this.props;
    const metricEntry = challenge.MetricEntry || {};
    const isRowDistance = metricEntry.EntryType === Constants.MetricEntryType.Distance
      && metricEntry.EquipmentId === Constants.EquipmentType.Row;
    // The pos variable will be pointed at last field of Input Screen (maybe seconds or miliseconds field)
    // Position will be pointed at second field (2) if hasMiliseconds if false
    // Otherwise position will be pointed at miliseconds field (3).
    let pos;
    if (!isWeightFloorEquipment) {
      pos = hasMiliseconds ?
        Object.keys(this.state[roundNumber].time).length :
        Object.keys(this.state[roundNumber].time).length - 1;
    } else {
      pos = this.state[roundNumber].positionWeightFloor;
    }

    // Set position into state, use for delete function when user click delete button
    this.setState((prevState) => {
      return {
        [roundNumber]: { ...prevState[roundNumber], ...{ position: pos } }
      };
    });
    const maxLenghtBlock = isDistance ? 3 : 2;
    // The purpose of isInitial variable => ???
    let nextState = { isInitial: true, count: this.state[roundNumber].count + 1 };

    // Clone value from state (make sure immutable for this.state)
    let time = _.cloneDeep(this.state[roundNumber].time);
    let showingTime = _.cloneDeep(this.state[roundNumber].showingTime);
    let stateInput = _.cloneDeep(this.state[roundNumber].stateInput);

    // If hasMiliseconds === true => UI will be look like: [__]:[__].[__]
    // If hasMiliseconds === false => UI will be look like: [__]:[__]
    // If last field has been filled by 2 numbers (ex: [__]:[__].[12])
    if (!isWeightFloorEquipment) {
      if (pos >= 1 && time[pos].length >= maxLenghtBlock) {
        if (time[pos - 1].length < 2) {
          stateInput[pos - 1] = 1;
          time[pos - 1].push(time[pos][0]);
          showingTime[pos - 1] = this.joinArrayResult(time[pos - 1]);
        } else {
          if (this.state[roundNumber].isInitial && this.state[roundNumber].count < 4) {
            if (isRowDistance) {
              time[pos - 1].shift();
              time[pos - 1].push(time[pos].shift());
            } else {
              time[pos].splice(1, 1);
            }
          } else {
            time[pos - 1].push(time[pos][0]);
            if (hasMiliseconds) {
              stateInput[pos - 2] = 1;
              time[pos - 2].push(time[pos - 1][0]);
            }
            time[pos - 1].splice(0, 1);
            if (hasMiliseconds) {
              if (time[pos - 2].length > 2) {
                time[pos - 2].splice(0, 1);
              }
            }
          }
          showingTime[pos - 1] = this.joinArrayResult(time[pos - 1]);
          if (hasMiliseconds) {
            showingTime[pos - 2] = this.joinArrayResult(time[pos - 2]);
          }
        }

        time[pos].push(number);
        /* eslint-disable max-len */
        if (!this.state[roundNumber].isInitial || time[pos - 1].length === 1 || time[pos].length === maxLenghtBlock + 1) {
          time[pos].splice(0, 1);
        }
        /* eslint-disable max-len */
        if (!isRowDistance && time[pos - 1].length === 1 && this.state[roundNumber].isInitial && (this.state.isDriTri || this.state.isRowTime)) {
          time[pos - 1].push(time[pos][0]);
          time[pos].splice(0, 1);
          time[pos].push(0);
          showingTime[pos - 1] = this.joinArrayResult(time[pos - 1]);
        } else {
          nextState.isInitial = this.state[roundNumber].count === 4 && (this.state.isDriTri || this.state.isRowTime);
        }
        showingTime[pos] = this.joinArrayResult(time[pos], isDistance);
      } else if (this.state[roundNumber].time[pos].length < maxLenghtBlock) {
        // If last field has been filled by 1 numbers or hasn't been filled
        // Ex: [__]:[__].[_2] or [__]:[__].[__]
        // We push the input param number into last field
        time[pos].push(number);
        showingTime[pos] = this.joinArrayResult(time[pos], isDistance);
        stateInput[pos] = 1;
      }
    } else {
      if ((pos === 1 && time[pos].length === 3) || (pos === 2 && time[pos].length === 2)) {
        time[pos].shift();
      }
      time[pos].push(number);
      showingTime[pos] = this.joinArrayResult(time[pos], pos === 1 ? isWeightFloorEquipment : null);
      stateInput[pos] = 1;
    }

    nextState = { ...nextState, time, showingTime, stateInput, isClear: false };
    this.setState((prevState) => {
      return {
        [roundNumber]: { ...prevState[roundNumber], ...nextState }
      };
    });
  }

  /**
   * Build initial array to sum block by block of all rounds
   * ex: [round1.time[1], round2.time[1], round3.time[1]....,roundn[1]]
   * @param {any} numberOfRound
   * @param {any} index
   * @returns
   * @memberof TimeKeyboard
   */
  buildInitArray(numberOfRound, index) {
    let arr = [];
    for (let i = 1; i <= numberOfRound; i++) {
      if (index) {
        arr.push(parseInt(this.state[`round${i}`].time[index].join(''), 10));
      } else {
        arr.push(parseFloat(`${this.state[`round${i}`].showingTime[1]}.${this.state[`round${i}`].showingTime[2]}`));
      }
    }
    return arr;
  }

  /**
   * Calculate total time
   *
   * @param {any} arrBlock1
   * @param {any} arrBlock2
   * @param {any} arrBlock3
   * @returns
   * @memberof TimeKeyboard
   */
  calculateTime(arrBlock1, arrBlock2, arrBlock3) {
    let totalTime = {};
    let millisec = Helpers.sumArrayDisregardNaN(arrBlock3) || 0;
    let seconds = Helpers.sumArrayDisregardNaN(arrBlock2) || 0;
    let minutes = Helpers.sumArrayDisregardNaN(arrBlock1) || 0;
    // func ([1,2,3])
    // loop input arr
    if (millisec > 99) {
      millisec = 99;
    }
    totalTime['3'] = [Math.floor(millisec / 10), millisec % 10];
    // Handle for make sure second must small than 60 seconds (only Time case)
    // sec > 60 -> minutes -> 59
    if (seconds > 59) {
      minutes += Math.floor(seconds / 60);
      if (minutes >= 99) {
        seconds = 59;
      } else {
        seconds -= Math.floor(seconds / 60) * 60;
      }
    }
    totalTime['2'] = [Math.floor(seconds / 10), seconds % 10];
    // minutes + minutes mod -> > 99 = 99
    if (minutes > 99) {
      minutes = 99;
    }
    totalTime['1'] = [Math.floor(minutes / 10), minutes % 10];
    return totalTime;
  }

  /**
   * Calculate total distance
   *
   * @param {any} arrBlock1
   * @param {any} arrBlock2
   * @returns
   * @memberof TimeKeyboard
   */
  calculateDistance(list) {
    let distance = _.sum(list) > 99.999 ? 99.999 : _.sum(list);
    distance = _.isNumber(distance) ? distance.toFixed(3) : distance;
    return distance;
  }
  calculateRep(arrBlock1, arrBlock2) {
    let totalDistance = [];
    let weight = Helpers.sumArrayDisregardNaN(arrBlock1);
    let reps = Helpers.sumArrayDisregardNaN(arrBlock2);
    totalDistance['1'] = [Math.floor(weight / 100), Math.floor((weight % 100) / 10), (weight % 100) % 10];
    totalDistance['2'] = [Math.floor(reps / 10), reps % 10];
    totalDistance['3'] = [0, 0];
    return totalDistance;
  }
  calculateDistanceRower(result) {
    let distanceArr = [];
    let totalDistanceArr = [];
    for (let i = 1; i <= this.props.numberOfRound; i++) {
      let distance = parseInt(this.state[`round${i}`].time[1].join('') + this.state[`round${i}`].time[2].join(''), 10);
      if (!_.isNaN(distance)) {
        distanceArr.push(distance);
      }
    }
    let totalDistance = String(_.sum(result ? result : distanceArr) > 99999 ? 99999 : _.sum(result ? result : distanceArr)).split('');
    totalDistanceArr['1'] = [totalDistance[totalDistance.length - 5] || 0, totalDistance[totalDistance.length - 4] || 0];
    totalDistanceArr['2'] = [totalDistance[totalDistance.length - 3] || 0, totalDistance[totalDistance.length - 2] || 0, totalDistance[totalDistance.length - 1] || 0];
    totalDistanceArr['3'] = [0, 0];
    return {totalDistanceArr, totalDistance: _.sum(result ? result : distanceArr)};
  }

  getInitChallengeTemplateTypeId(challengeTemplateTypeId) {
    const { challengeTemplateId, challengeTemplate } = this.props;
    let templateTypeId;
    if (challengeTemplateTypeId) {
      templateTypeId = challengeTemplateTypeId;
    } else {
      const ct = Helpers.getChallengeTemplateById(challengeTemplateId, challengeTemplate);
      if (ct.ChallengeTemplateTypes.length > 0) {
        templateTypeId = ct.ChallengeTemplateTypes[0].ChallengeTemplateTypeId;
        if (!challengeTemplateTypeId) {
          templateTypeId = null;
        }
      } else {
        templateTypeId = null;
      }
    }
    return templateTypeId;
  }
  /**
   * Initialize Substitute Id
   * @param {*} substituteId
   * @param {*} substituteType
   * @param {*} challenge
   */
  getInitSubstitute(substituteId, substituteType, challenge) {
    const isSubstitute = challenge.isDriTri
      || (!challenge.isRowTime && !challenge.isWeightFloorEquipment && !challenge.isRowDistance);
    let substitute;
    if (substituteId) {
      substitute = substituteId;
    } else if (isSubstitute) {
      substitute = substituteType.TM;
    } else {
      substitute = null;
    }
    return substitute;
  }

  save(isThousandths) {
    const { isDistance, isWeightFloorEquipment } = isThousandths;
    const { actions, handleOutput, intl, metricEntryType, numberOfRound, weightFloorUnitMeasurement, challenge, challengeType, substituteType } = this.props;
    const { isDriTri, challengeTemplateTypeId, substituteId, unitOfMeasure } = this.state;
    const metricEntry = challenge.MetricEntry || {};
    const isRowDistance = metricEntryType === Constants.MetricEntryType.Distance
      && metricEntry.EquipmentId === Constants.EquipmentType.Row;
    this.props.close();
    let arr1 = this.buildInitArray(numberOfRound, 1);
    let arr2 = this.buildInitArray(numberOfRound, 2);
    let arr3 = this.buildInitArray(numberOfRound, 3);
    let arrDistance = this.buildInitArray(numberOfRound);
    let numberRoundClear = 0;

    for (let i = 1; i <= numberOfRound; i++) {
      if (this.state[`round${i}`].isClear || _.isEqual(this.state[`round${i}`].showingTime, {
        1: `00${isWeightFloorEquipment ? '0' : ''}`,
        2: `00${isDistance ? '0' : ''}`,
        3: '00'
      })) {
        numberRoundClear += 1;
      }
    }

    if (numberRoundClear === this.props.numberOfRound) {
      if (this.props.uuid) {
        numberRoundClear = 0;
        return actions.shared_challenges.removeChallengeResult(this.props.uuid);
      }
      return false;
    }

    let origin, round, totalResult, totalResultRower;

    // If substitute is'nt selected, set default is Treadmill
    // Otherwise
    let substitute = this.getInitSubstitute(substituteId, substituteType, challengeType);
    let templateTypeId = this.getInitChallengeTemplateTypeId(challengeTemplateTypeId, challengeType);
    if (metricEntryType === Constants.MetricEntryType.Time || isDriTri) {
      origin = (() => {
        for (let i = 1; i <= numberOfRound; i++) {
          round = {
            ...round,
            [`round${i}`]: {
              result: this.calculateTime(this.state[`round${i}`].time[1].join(''), this.state[`round${i}`].time[2].join(''), this.state[`round${i}`].time[3].join('')),
              challengeResultHistoryId: this.state[`round${i}`].challengeResultHistoryId,
              position: i
            }
          };
        }
        return round;
      })();
      totalResult = this.calculateTime(arr1, arr2, arr3);
    } else if (metricEntryType === Constants.MetricEntryType.Distance) {
      origin = (() => {
        for (let i = 1; i <= numberOfRound; i++) {
          round = {
            ...round,
            [`round${i}`]: {
              result: isRowDistance ? this.calculateDistanceRower(`${this.state[`round${i}`].showingTime[1]}${this.state[`round${i}`].showingTime[2]}`).totalDistanceArr
                : this.calculateDistance(`${this.state[`round${i}`].showingTime[1]}.${this.state[`round${i}`].showingTime[2]}`),
              challengeResultHistoryId: this.state[`round${i}`].challengeResultHistoryId,
              position: i
            }
          };
        }
        return round;
      })();
      totalResultRower = isRowDistance ? this.calculateDistanceRower().totalDistance : 0;
      totalResult = isRowDistance ? this.calculateDistanceRower().totalDistanceArr : this.calculateDistance(arrDistance);
    } else if (metricEntryType === Constants.MetricEntryType.Reps) {
      origin = (() => {
        for (let i = 1; i <= numberOfRound; i++) {
          round = {
            ...round,
            [`round${i}`]: {
              result: this.calculateRep(this.state[`round${i}`].time[1].join(''), this.state[`round${i}`].time[2].join('')),
              challengeResultHistoryId: this.state[`round${i}`].challengeResultHistoryId,
              position: i
            }
          };
        }
        return round;
      })();
      totalResult = this.calculateRep(arr1, arr2);
    }
    const formula = Constants.formulaDistance[substitute] || 1;
    if (metricEntryType === Constants.MetricEntryType.Reps) {
      if (parseInt(totalResult[1].join(''), 10) > 100 && weightFloorUnitMeasurement === Constants.UnitMeasurementType.Imperial) {
        return actions.core_alert.showError(intl.formatMessage({ id: 'ClassRosTer.Validation.ExceedMaxWeight.LBS' }));
      } else if (parseInt(totalResult[1].join(''), 10) > 45 && weightFloorUnitMeasurement === Constants.UnitMeasurementType.Metric) {
        return actions.core_alert.showError(intl.formatMessage({ id: 'ClassRosTer.Validation.ExceedMaxWeight.KG' }));
      }
      if (parseInt(totalResult[2].join(''), 10) > 20) {
        return actions.core_alert.showError(intl.formatMessage({ id: 'ClassRosTer.Validation.ExceedMaxReps' }));
      }
    } else if (metricEntryType === Constants.MetricEntryType.Distance) {
      const coefficient = !isRowDistance && unitOfMeasure === Constants.UnitMeasurementType.Imperial
        ? Constants.CoefficientUnitMeasurement.Distance : 1;
      let maxValue, minValue;
      maxValue = parseFloat(metricEntry.MaxValue) / coefficient * formula;
      minValue = parseFloat(metricEntry.MinValue || '0') / coefficient * formula;
      const total = isRowDistance ? totalResultRower : totalResult;
      if (parseFloat(total) > _.round(maxValue, 3) || parseFloat(total) < _.round(minValue, 3)) {
        return actions.core_alert.showError(intl.formatMessage({ id: 'ClassRosTer.Validation.OutsideRange' }));
      }
    } else if (metricEntryType === Constants.MetricEntryType.Time && !_.isNull(metricEntry.MinValue) && !_.isNull(metricEntry.MaxValue)) {
      let msRangeMax, msRangeMin, msResult;
      if (challengeType.isDriTri) {
        const dritriMetric = _.find(SelectOptionsConstants.DriTriRange, (drc) => {
          return drc.templateTypeId === templateTypeId;
        });
        if (dritriMetric) {
          msRangeMin = dritriMetric.minValue.includes(':') ? (parseFloat(dritriMetric.minValue.split(':')[0] || '0') * 60 * 100 + parseFloat(dritriMetric.minValue.split(':')[1]) * 100)
            : parseFloat(dritriMetric.minValue.split(':')[0]) * 100;
          msRangeMax = dritriMetric.maxValue.includes(':') ? (parseFloat(dritriMetric.maxValue.split(':')[0] || '0') * 60 * 100 + parseFloat(dritriMetric.maxValue.split(':')[1]) * 100)
            : parseFloat(dritriMetric.maxValue.split(':')[0]) * 100;
        }
      } else {
        msRangeMin = metricEntry.MinValue.includes(':') ? (parseFloat(metricEntry.MinValue.split(':')[0] || '0') * 60 * 100 + parseFloat(metricEntry.MinValue.split(':')[1]) * 100)
        : parseFloat(metricEntry.MinValue.split(':')[0]) * 100;
        msRangeMax = metricEntry.MaxValue.includes(':') ? (parseFloat(metricEntry.MaxValue.split(':')[0] || '0') * 60 * 100 + parseFloat(metricEntry.MaxValue.split(':')[1]) * 100)
        : parseFloat(metricEntry.MaxValue.split(':')[0]) * 100;
      }
      msResult = parseFloat(totalResult[1].join('')) * 60 * 100 + parseFloat(totalResult[2].join('')) * 100 + parseFloat(totalResult[3].join(''));
      if (msResult > msRangeMax || msResult < msRangeMin) {
        return actions.core_alert.showError(intl.formatMessage({ id: 'ClassRosTer.Validation.OutsideRange' }));
      }
    }
    return handleOutput({ origin, total: totalResult, substituteId: substitute, templateTypeId });
  }

  clear(keepPreviousEntry, roundNumber, isThousandths) {
    const { isDistance, isWeightFloorEquipment } = isThousandths || {};
    let time = {
      1: [],
      2: [],
      3: []
    };
    let showingTime = {
      1: `00${isWeightFloorEquipment ? '0' : ''}`,
      2: `00${isDistance ? '0' : ''}`,
      3: '00'
    };
    let stateInput = { 1: 0, 2: 0, 3: 0 };

    if (typeof (keepPreviousEntry) === 'boolean'
      && keepPreviousEntry
      && this.state.substituteId === this.state[roundNumber].previousValue.substituteId
      && this.state.challengeTemplateTypeId === this.state[roundNumber].previousValue.challengeTemplateTypeId) {
      time = _.cloneDeep(this.state[roundNumber].previousValue.time);
      showingTime = _.cloneDeep(this.state[roundNumber].previousValue.showingTime);
      stateInput = _.cloneDeep(this.state[roundNumber].previousValue.stateInput);
    }

    this.setState((preState) => {
      return {
        [roundNumber]: {
          ...preState[roundNumber],
          position: 3,
          time,
          showingTime,
          stateInput,
          isClear: true,
          isInitial: true,
          count: 0
        }
      };
    });
  }

  delete(selectedRound, isThousandths, isRowDistance) {
    const { isDistance, isWeightFloorEquipment } = isThousandths;
    let pos = isWeightFloorEquipment ? this.state[selectedRound].positionWeightFloor : this.state[selectedRound].position;
    let time = _.cloneDeep(this.state[selectedRound].time);
    let showingTime = _.cloneDeep(this.state[selectedRound].showingTime);
    let arr = time[pos];
    let stateInput = _.cloneDeep(this.state[selectedRound].stateInput);

    if (arr.length > 1) {
      arr.pop();
      if (isWeightFloorEquipment) {
        showingTime[pos] = pos === 1 ? this.joinArrayResult(arr, isWeightFloorEquipment) : this.joinArrayResult(arr);
      } else if (isRowDistance) {
        if (time[pos - 1].length > 0) {
          arr.unshift(time[pos - 1].pop());
        }
        showingTime[pos] = pos === 2 ? this.joinArrayResult(arr, isDistance) : this.joinArrayResult(arr);
        showingTime[pos - 1] = this.joinArrayResult(time[pos - 1]);
      } else {
        showingTime[pos] = pos === 2 ? this.joinArrayResult(arr, isDistance) : this.joinArrayResult(arr);
      }
    } else {
      time[pos] = [];
      // Update state of input view
      stateInput[pos] = 0;
      if (isWeightFloorEquipment) {
        showingTime[pos] = `00${isWeightFloorEquipment && pos === 1 ? '0' : ''}`;
      } else {
        showingTime[pos] = `00${isDistance && pos === 2 ? '0' : ''}`;
      }
      if (pos > 1 && !isWeightFloorEquipment) {
        this.setState((prevState) => {
          return {
            [selectedRound]: { ...prevState[selectedRound], position: --pos }
          };
        });
      }
    }
    this.setState((prevState) => {
      return {
        [selectedRound]: { ...prevState[selectedRound], time, showingTime, stateInput }
      };
    });
  }

  selectSubstitute(key, type, roundNumber, isThousandths) {
    this.setState({
      [key]: type,
      unitOfMeasure: this.unitOfMeasure[type]
    }, () => {
      this.clear(true, roundNumber, isThousandths);
    });
  }

  /**
   * Calculate separate character and unit based on metric entry type
   * If entry type is Time, UI should be time input seperate by ':' character
   * If entry type is Distance, UI should be distance input seperate by '.' character
   * Otherwise using '' character.
   * @param {string}  metricEntryType Specific the metric entry type of today challenge
   * @param {boolean} isDriTri        Indicate whether the challenge type is DriTri
   */
  calculateMetricInputView(metricEntryType, isDriTri) {
    // If Dri Tri metric view always time type
    if (isDriTri) {
      return ':';
    }

    // Otherwise calculate based on metric entry type
    switch (metricEntryType) {
      case Constants.MetricEntryType.Distance:
        return '.';
      case Constants.MetricEntryType.Time:
        return ':';
      case Constants.MetricEntryType.Reps:
        return <div className='separate-line' />;
      default:
        return '';
    }
  }

  renderUnitOfInputResult(metricEntryType, hasMiliseconds) {
    // If Dri Tri metric view always time type
    const { weightFloorUnitMeasurement, challenge } = this.props;
    const { unitOfMeasure } = this.state;
    const metricEntry = challenge.MetricEntry || {};
    const equipmentId = metricEntry.EquipmentId;
    const isRowDistance = metricEntryType === Constants.MetricEntryType.Distance
      && metricEntry.EquipmentId === Constants.EquipmentType.Row;
    let distanceUnit;
    if (equipmentId === Constants.EquipmentType.Treadmill) {
      distanceUnit = unitOfMeasure === Constants.UnitMeasurementType.Imperial ? 'mile' : 'kilometer';
    } else {
      distanceUnit = 'mile';
    }
    let result = (
      <div className={`unit-input-result${!hasMiliseconds ? ' no-milisecond' : ''}`}>
        <span className='minutes'>{'Minutes'}</span>
        <span className='seconds'>{'Seconds'}</span>
        {hasMiliseconds && <span className='miliseconds'>{'Milliseconds'}</span>}
      </div>
    );

    let weightFloorUnit = (
      <div className={'unit-input-result no-milisecond'}>
        <span className='weight'>{`weight (${weightFloorUnitMeasurement === Constants.UnitMeasurementType.Imperial ? 'LB' : 'KG'})`}</span>
        <span className='max-reps'>{'max reps'}</span>
      </div>
    );

    if (hasMiliseconds) {
      return result;
    }

    // Otherwise calculate based on metric entry type
    switch (metricEntryType) {
      case Constants.MetricEntryType.Distance:
        return <div className='unit-distance'><span>{isRowDistance ? 'Meter' : distanceUnit}</span></div>;
      case Constants.MetricEntryType.Time:
        return result;
      case Constants.MetricEntryType.Reps:
        return weightFloorUnit;
      default:
        return '';
    }
  }

  renderAvatar() {
    const { member } = this.props;
    if (!member) { return Logo; }
    let gender = member.gender;

    if (gender === 'Female') {
      return IconFemale;
    } else if (gender === 'Male') {
      return IconMale;
    }
    return Logo;
  }

  renderMemberName() {
    const { member } = this.props;
    if (!member) { return undefined; }

    let name = Helpers.formatMemberName(member.firstName, member.lastName);
    name = name.replace('\\', '');
    return name;
  }
  onSelectRound(number) {
    this.setState({
      selectedRound: number
    });
  }
  onSelectSubType(number, roundNumber, isThousandths) {
    const {challengeTemplateId, challengeTemplate, intl, actions, marathonTypeId} = this.props;
    if (challengeTemplateId === challengeTemplate.MarathonMonth.ChallengeTemplateId) {
      if (number !== marathonTypeId) {
        actions.core_modal.show({
          message: intl.formatHTMLMessage({ id: 'Challenge.Confirmation.MarathonMonth.ChangeSubType' }),
          className: 'delete-confirmation',
          modalType: ModalType.Confirm,
          onClose: (status) => {
            if (status === ModalResult.Ok) {
              actions.shared_challenges.setMarathonType(number);
              this.clear(true, roundNumber, isThousandths);
            }
            setTimeout(() => {
              this.props.openKeyboard();
            }, 100);
          }
        });
      }
    } else {
      this.setState({
        challengeTemplateTypeId: number
      }, () => {
        this.clear(true, roundNumber, isThousandths);
      });
    }
  }
  changePosWF(roundNumber, number) {
    this.setState((prevState) => {
      return {
        [roundNumber]: { ...prevState[roundNumber], positionWeightFloor: number }
      };
    });
  }
  handleSwitchChange(value, memberUUId) {
    if (value) {
      Helpers.removeLeaderboardOpt(memberUUId);
    } else {
      Helpers.updateLocalStorage(Constants.LeaderboardOptionalKey, memberUUId, 'array');
    }
  }
  renderTemplateTypeOptions() {
    const { challenge, challengeTemplate } = this.props;
    const ct = Helpers.getChallengeTemplateById(challenge.ChallengeTemplateId, challengeTemplate);
    let options;
    if ((ct.ChallengeTemplateTypes || []).length > 0) {
      options = [
        ...ct.ChallengeTemplateTypes.map(templateType => {
          return {
            label: templateType.TemplateTypeName,
            value: templateType.ChallengeTemplateTypeId
          };
        })
      ];
      if (challenge.ChallengeTemplateId !== challengeTemplate.MarathonMonth.ChallengeTemplateId) {
        options.unshift({
          label: ct.TemplateName,
          value: null
        });
      }
    }
    return options;
  }
  render() {
    const {
      substituteId,
      selectedRound,
      isDriTri,
      isRowTime,
      isWeightFloorEquipment,
      challengeTemplateTypeId,
      unitOfMeasure
    } = this.state;
    const {
      metricEntryType,
      numberOfRound,
      member,
      intl,
      substituteType,
      challengeType,
      challengeTemplateId,
      challengeTemplate,
      marathonTypeId,
      challengeMemberInfo,
      challenge
    } = this.props;
    const metricEntry = this.props.challenge.MetricEntry || {};
    const isRowDistance = metricEntryType === Constants.MetricEntryType.Distance
      && metricEntry.EquipmentId === Constants.EquipmentType.Row;

    const isSubstitute = isDriTri || (!isRowTime && !isWeightFloorEquipment && !isRowDistance);

    const isDistance = metricEntryType === Constants.MetricEntryType.Distance && !this.state.isDriTri;
    const isThousandths = { isDistance, isWeightFloorEquipment };

    const hasMiliseconds = (isRowTime || isDriTri) && !isDistance;
    let roundNumber = `round${selectedRound}`;
    const valueDistanceRower = this.state[roundNumber].showingTime['1'].concat(this.state[roundNumber].showingTime['2']);
    return (
      <div>
        <div className='close-btn' onClick={this.cancel.bind(this)}>{'x'}</div>
        <div className='wrapper-content'>
          <div className='left-panel'>
            <div className='member-area'>
              <div className='title'>
                <FormattedMessage id={'ClassRoster.Dialog.Title'} />
              </div>
              <div className='member-icon'>
                <img src={!member.profilePictureUrl ? this.renderAvatar() : member.profilePictureUrl}
                  ref={img => { this.img = img; }} onError={() => this.renderAvatar()}
                  className='avatar' />
              </div>
              <div className='member-name'>{this.renderMemberName()}</div>
              <div className='leaderboard-opt-wrapper'>
                <p className='leaderboard-opt col-md-7'><FormattedMessage id={'MemberDetail.ShowOnLeaderBoard.Title'} /></p>
                <Switch
                  className={'col-md-5'}
                  checkedLabel={intl.formatMessage({ id: 'General.Toggle.Show.Title' })}
                  uncheckedLabel={intl.formatMessage({ id: 'General.Toggle.Hide.Title' })}
                  defaultValue={Helpers.getLeaderboardOpt(member.mboMemberId)}
                  onSwitchChange={(value) => this.handleSwitchChange.bind(this)(value, member.mboMemberId)} />
              </div>
            </div>
            <SubstituteArea
              isRowTime={isRowTime}
              isSubstitute={isSubstitute}
              substituteId={this.getInitSubstitute(substituteId, substituteType, challengeType)}
              challengeTemplateTypeId={challengeTemplateTypeId}
              challengeTemplateId={challengeTemplateId}
              challengeTemplate={challengeTemplate}
              isWeightFloorEquipment={isWeightFloorEquipment}
              isDriTri={isDriTri}
              isRowDistance={isRowDistance}
              substituteType={substituteType}
              selectSubstitute={(key, type) => this.selectSubstitute.bind(this)(key, type, roundNumber, isThousandths)}
              logoUrl={this.props.challenge.LogoUrl || null} />
          </div>
          <div className='right-panel'>
            <div className='member-input-container'>
              {(numberOfRound > 1 && !isDriTri) && <MultiInput
                selectedRound={selectedRound}
                numberOfRound={numberOfRound}
                onSelectRound={(number) => this.onSelectRound.bind(this)(number)} />}
              {challengeTemplateId !== challengeTemplate.MarathonMonth.ChallengeTemplateId && this.renderTemplateTypeOptions() && this.renderTemplateTypeOptions().length > 0 && <ChallengeSubTypeSelect
                options={this.renderTemplateTypeOptions()}
                challengeTemplate={Helpers.getChallengeTemplateById(challenge.ChallengeTemplateId, challengeTemplate)}
                selectedSubType={challengeTemplateTypeId || this.renderTemplateTypeOptions()[0].value}
                onSelectSubType={(number) => this.onSelectSubType.bind(this)(number, roundNumber, isThousandths)} />}
              {isWeightFloorEquipment &&
                <div className='multi-input'>
                  {isWeightFloorEquipment && <div className={`arrow-down${this.state[roundNumber].positionWeightFloor === 1 ? ' weight-input' : ' reps-input'}`} />}
                </div>}
              {(!isRowDistance) && <input
                id='1'
                type='text'
                className={`time-input${this.state[roundNumber].stateInput[1] === 1 ? ' inputed' : ''}${isWeightFloorEquipment ? ' weight-input' : ''}`}
                value={this.state[roundNumber].showingTime['1']} readOnly={true}
                onClick={() => this.changePosWF.bind(this)(roundNumber, 1)} />}
              {(!isRowDistance) && <span className={`separate${isDistance ? ' distance-input' : ''}${this.state[roundNumber].stateInput[1] === 1 ? ' inputed' : ''}`}>
                {this.calculateMetricInputView(metricEntryType, isDriTri)}
              </span>}
              <input
                id='2'
                type='text'
                className={`time-input${this.state[roundNumber].stateInput[2] === 1 ? ' inputed' : ''}${isWeightFloorEquipment ? ' weight-input' : ''}${isRowDistance ? ' orangevoyage' : ''}`}
                value={isRowDistance ? valueDistanceRower : this.state[roundNumber].showingTime['2']} readOnly={true}
                onClick={() => this.changePosWF.bind(this)(roundNumber, 2)} />
              {hasMiliseconds && (<span className={`separate${this.state[roundNumber].stateInput[3] === 1 ? ' inputed' : ''}`}>{'.'}</span>)}
              {hasMiliseconds && (<input id='3' type='text' className={`time-input${this.state[roundNumber].stateInput[3] === 1 ? ' inputed' : ''}`}
                value={this.state[roundNumber].showingTime['3']} readOnly={true} />)}
              {this.renderUnitOfInputResult(metricEntryType, hasMiliseconds)}
            </div>
            <div className='keypad-container'>
              <table>
                <tbody>
                  <tr>
                    <td onClick={() => this.onNumberClick.bind(this)(1, roundNumber, isThousandths)}>{'1'}</td>
                    <td onClick={() => this.onNumberClick.bind(this)(2, roundNumber, isThousandths)}>{'2'}</td>
                    <td onClick={() => this.onNumberClick.bind(this)(3, roundNumber, isThousandths)}>{'3'}</td>
                    <td id='delete' className='btn-back' onClick={() => this.delete.bind(this)(roundNumber, isThousandths, isRowDistance)}>
                      <img src={BackImg} />
                    </td>
                  </tr>
                  <tr>
                    <td onClick={() => this.onNumberClick.bind(this)(4, roundNumber, isThousandths)}>{'4'}</td>
                    <td onClick={() => this.onNumberClick.bind(this)(5, roundNumber, isThousandths)}>{'5'}</td>
                    <td onClick={() => this.onNumberClick.bind(this)(6, roundNumber, isThousandths)}>{'6'}</td>
                    <td id='clear' className='btn-clear' onClick={() => this.clear.bind(this)(null, roundNumber, isThousandths)}><FormattedMessage id={'ClassRoster.Dialog.ClearBtn'} /></td>
                  </tr>
                  <tr>
                    <td onClick={() => this.onNumberClick.bind(this)(7, roundNumber, isThousandths)}>{'7'}</td>
                    <td onClick={() => this.onNumberClick.bind(this)(8, roundNumber, isThousandths)}>{'8'}</td>
                    <td onClick={() => this.onNumberClick.bind(this)(9, roundNumber, isThousandths)}>{'9'}</td>
                    <td id='ok' rowSpan='2' className='btn-ok'
                      onClick={() => this.save.bind(this)(isThousandths)}><FormattedMessage id={'ClassRoster.Dialog.OKBtn'} /></td>
                  </tr>
                  <tr>
                    <td />
                    <td onClick={() => this.onNumberClick.bind(this)(0, roundNumber, isThousandths)}>{'0'}</td>
                    <td />
                  </tr>
                </tbody>
              </table>
            </div>
            {challengeTemplateId === challengeTemplate.MarathonMonth.ChallengeTemplateId && <ChallengeSubTypeSelect
              challengeMemberInfo={challengeMemberInfo}
              challengeTemplate={Helpers.getChallengeTemplateById(challenge.ChallengeTemplateId, challengeTemplate)}
              unitOfMeasure={unitOfMeasure}
              hideIndicator={true}
              options={this.renderTemplateTypeOptions()}
              selectedSubType={marathonTypeId}
              onSelectSubType={(number) => this.onSelectSubType.bind(this)(number, roundNumber, isThousandths)} />}
          </div>
        </div>
      </div>
    );
  }
}

/**
 * Typechecking With PropTypes
 * Reference https://facebook.github.io/react/docs/typechecking-with-proptypes.html
 * Proptypes: https://github.com/facebook/prop-types
 */
TimeKeyboard.propTypes = {
  actions: PropTypes.any,
  bikeUnitMeasurement: PropTypes.string,
  challenge: PropTypes.object,
  challengeMemberInfo: PropTypes.object,
  challengeTemplate: PropTypes.object,
  challengeTemplateId: PropTypes.number,
  challengeTemplateTypeId: PropTypes.number,
  challengeType: PropTypes.object,
  close: PropTypes.func,
  handleOutput: PropTypes.func,
  intl: intlShape.isRequired,
  marathonTypeId: PropTypes.number,
  mboClassId: PropTypes.string,
  member: PropTypes.object,
  metricEntryType: PropTypes.string,
  numberOfRound: PropTypes.number,
  openKeyboard: PropTypes.func,
  origin: PropTypes.object,
  props: PropTypes.object,
  striderUnitMeasurement: PropTypes.string,
  substituteId: PropTypes.number,
  substituteType: PropTypes.object,
  time: PropTypes.object,
  title: PropTypes.string,
  treadmillUnitMeasurement: PropTypes.string,
  uuid: PropTypes.string,
  weightFloorUnitMeasurement: PropTypes.string
};
const timeKeyboard = connect(state => ({
  marathonTypeId: state.shared_challenges.marathonTypeId
}))(TimeKeyboard);
export default injectIntl(timeKeyboard);

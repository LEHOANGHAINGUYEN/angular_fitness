import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { FormattedMessage, intlShape, injectIntl } from 'react-intl';
import * as _ from 'lodash';

import { Constants, Helpers } from 'common';
import { AttendanceButton } from '..';
import { TimeKeyboard, MarathonSubCategory } from 'modules/studio-view/components';
import { ModalType, ModalResult } from 'modules/core/components';
import RefreshIcon from '../../image/icon_refresh.svg';

export class CRInput extends React.Component {
  constructor(props) {
    super(props);
    const mboClassId = this.props.location.query.mboClassId;
    // Init state for this component
    this.state = {
      mboClassId,
      allowEdit: false,
      attendanceSelected: undefined,
      challengeResultSelected: undefined,
      numberOfRound: 1
    };
    this.unitOfMeasure = {
      1: props.treadmillUnitMeasurement,
      2: props.striderUnitMeasurement,
      3: props.bikeUnitMeasurement,
      4: props.treadmillUnitMeasurement
    };
    this.date = moment(this.props.location.query.date, 'MM/DD/YYYY');
    this.weightCoefficient = Constants.CoefficientUnitMeasurement.Weight;
    this.distanceCoefficient = Constants.CoefficientUnitMeasurement.Distance;
  }
  componentDidMount() {
    let studioId = this.props.currentStudio.StudioId;
    let date = this.date.format('MM/DD/YYYY');

    this.props.actions.shared_challenges.getTodayChallenge(studioId, date);
    this.props.actions.shared_challenges.getChallengeResults(
      this.state.mboClassId,
      studioId
    );
  }
  componentWillReceiveProps(nextProps) {
    let studioId = this.props.currentStudio.StudioId;
    if (
      nextProps.saveChallengeResultSuccess ||
      nextProps.removeChallengeResultSuccess
    ) {
      this.props.actions.shared_challenges.getChallengeResults(
        this.state.mboClassId,
        studioId
      );
      // Set saveChallengeResultSuccess to false
      this.props.actions.shared_challenges.reloadChallengeResultsDone();
    } else if (
      nextProps.challenge &&
      (nextProps.challenge.MetricEntry &&
        nextProps.challenge.MetricEntry.length !== 0)) {
      this.setState({ allowEdit: true });
    }
    if (nextProps.challenge && !_.isEqual(nextProps.challenge, this.props.challenge)) {
      this.setState({
        numberOfRound: nextProps.challenge.NumberOfRound
          ? nextProps.challenge.NumberOfRound
          : 1
      });
    }
    if (nextProps.challengeMemberInfo && _.isNull(nextProps.challengeMemberInfo.TotalResults)
      && nextProps.challenge.ChallengeTemplateId === nextProps.challengeTemplate.MarathonMonth.ChallengeTemplateId
      && this.keyboardPayload && nextProps.initPopup) {
      const challengeTemplateTypes = this.getTemplateTypesMarathon();
      if (challengeTemplateTypes) {
        nextProps.actions.core_modal.show({
          modalType: ModalType.Custom,
          size: 'lg',
          component: MarathonSubCategory,
          props: {
            challengeTemplateTypes,
            actions: this.props.actions
          },
          className: 'marathon-month-container',
          headerClass: 'marathon-month-header',
          hasFooter: true,
          onClose: (status) => {
            const self = this;
            nextProps.actions.shared_challenges.closeInitPopup();
            if (status === ModalResult.Ok) {
              setTimeout(function () {
                self.keyboardPayload = {
                  ...self.keyboardPayload,
                  props: {
                    ...self.keyboardPayload.props,
                    challengeMemberInfo: nextProps.challengeMemberInfo
                  }
                };
                nextProps.actions.core_modal.show(self.keyboardPayload);
              }, 100);
            }
          }
        });
      }
    } else if (this.keyboardPayload && nextProps.isFetchedChallengeMemberInfo
      && nextProps.challenge.ChallengeTemplateId === nextProps.challengeTemplate.MarathonMonth.ChallengeTemplateId
      && nextProps.isOpenPopup) {
      this.keyboardPayload = {
        ...this.keyboardPayload,
        props: {
          ...this.keyboardPayload.props,
          challengeMemberInfo: nextProps.challengeMemberInfo
        }
      };
      nextProps.actions.core_modal.show(this.keyboardPayload);
    }
  }

  componentWillUnmount() {
    this.props.actions.shared_challenges.destroyChallengeData();
    clearInterval(window.timer);
  }

  getMembers() {
    let id = this.state.mboClassId;
    const { actions, currentStudio } = this.props;
    actions.studio_roster.refreshMember(id, currentStudio.MboStudioId);
    actions.shared_challenges.getChallengeResults(id, currentStudio.StudioId);
  }

  /**
   * Convert measurement unit by
   * @param {*} input The necessary datas to convert
   */
  convertDataMeasurementSetting(input) {
    let { data, coefficient, isDefault, isInit } = input;
    return isDefault ? data : data * (isInit ? coefficient : 1 / coefficient);
  }

  calculateResultFromInput(input, substituteId) {
    const {
      challenge,
      challengeTemplate,
      weightFloorUnitMeasurement
    } = this.props;
    const isDriTri = challenge.ChallengeTemplateId === challengeTemplate.DriTri.ChallengeTemplateId;
    const metricEntry = (challenge.MetricEntry || {});
    const isDistance = metricEntry.EntryType === Constants.MetricEntryType.Distance && !isDriTri;
    const isRowTime = metricEntry.EntryType === Constants.MetricEntryType.Time
      && metricEntry.EquipmentId === Constants.EquipmentType.Row;
    const isRowDistance = metricEntry.EntryType === Constants.MetricEntryType.Distance
      && metricEntry.EquipmentId === Constants.EquipmentType.Row;
    // At first, we calculate result based on time format (mm:ss.ss)
    let result = `${input[1][0] || 0}${input[1][1] || 0}:${input[2][0] ||
      0}${input[2][1] || 0}.${input[3][0] || 0}${input[3][1] || 0}`;
    // If challenge type is DriTri or Fitness Benchmark with rower metric entry
    // always return result as time format (mm:ss.ss)
    if ((isDriTri || isRowTime) && !isDistance) {
      return result;
    }

    // Otherwise, calculate result based on metric entry type (Time or Distance, Reps)
    // with Fitness Benchmark challenge type
    switch (metricEntry.EntryType) {
      case Constants.MetricEntryType.Distance: {
        if (isRowDistance) {
          return `${input[1][0] || 0}${input[1][1] || 0}${input[2][0] ||
            0}${input[2][1] || 0}${input[2][2] || 0}`;
        } else if (metricEntry.EquipmentId !== Constants.EquipmentType.Row) {
          let resultDistance = input.length < 6 ? `0${input}` : input;
          if (metricEntry.EquipmentId === Constants.EquipmentType.Treadmill) {
            resultDistance =
              resultDistance &&
              this.convertDataMeasurementSetting({
                data: resultDistance,
                coefficient: this.distanceCoefficient,
                isDefault: this.unitOfMeasure[substituteId] === Constants.UnitMeasurementType.Metric,
                isInit: true,
                decimal: 3
              });
          }
          return String(resultDistance).split('.')[0].length < 2
            ? `0${String(resultDistance)}`
            : String(resultDistance);
        }
        return `${input[1][0] || 0}${input[1][1] || 0}.${input[2][0] ||
          0}${input[2][1] || 0}${input[2][2] || 0}`;
      }
      case Constants.MetricEntryType.Time:
        // Check if !isDriTri or !Row, just get mm:ss (not miliseconds)
        if (!isDriTri && !isRowTime && result) {
          result = result.substring(0, 5);
        }
        return result;
      case Constants.MetricEntryType.Reps: {
        let weight =
          weightFloorUnitMeasurement === Constants.UnitMeasurementType.Metric
            ? parseFloat(input[1].join(''), 10)
            : parseFloat(input[1].join(''), 10) * this.weightCoefficient;
        let reps = parseInt(input[2].join(''), 10);
        return (weight / (1.0278 - 0.0278 * reps)).toFixed(1);
      }
      default:
        throw new Error('Metric entry type cannot be null.');
    }
  }

  parseChallengeResultHistory(history, substituteId) {
    let origin = {};
    const { challenge } = this.props;
    const metricEntry = (challenge.MetricEntry || { Title: '' });
    const equipmentId = metricEntry.EquipmentId;
    if (history.length === 0) {
      origin = (() => {
        let round;
        for (let i = 1; i <= this.state.numberOfRound; i++) {
          round = {
            ...round,
            [`round${i}`]: {
              result: {
                1: [],
                2: [],
                3: []
              }
            }
          };
        }
        return round;
      })();
    } else {
      origin = (() => {
        let round;
        for (let i = 0; i < history.length; i++) {
          round = {
            ...round,
            [`round${history[i].Position}`]: {
              result: this.parseResultToObject(
                equipmentId === Constants.EquipmentType.WeightFloor
                  ? this.parseOriginObjectWF(
                    history[i].Weight,
                    history[i].NumberOfReps
                  )
                  : history[i].Result, substituteId
              ),
              challengeResultHistoryId: history[i].ChallengeResultHistoryId,
              position: history[i].Position
            }
          };
        }
        return round;
      })();
    }
    return origin;
  }

  parseOriginToChallengeResultHistory(origin, substituteId) {
    let history = [];
    const { challenge, weightFloorUnitMeasurement } = this.props;
    const equipmentId = (challenge.MetricEntry || [{ Title: '' }])
      .EquipmentId;
    for (let prop in origin) {
      if (equipmentId === Constants.EquipmentType.WeightFloor) {
        history.push({
          ChallengeResultHistoryId: origin[prop].challengeResultHistoryId,
          Position: origin[prop].position || 1,
          Result: this.calculateResultFromInput(origin[prop].result),
          Weight:
            weightFloorUnitMeasurement === Constants.UnitMeasurementType.Metric
              ? parseFloat(origin[prop].result[1].join(''), 10) : (
                parseFloat(origin[prop].result[1].join(''), 10) *
                this.weightCoefficient
              ).toFixed(),
          NumberOfReps: parseInt(origin[prop].result[2].join(''), 10),
          IsWeightFloor: true
        });
      } else {
        history.push({
          ChallengeResultHistoryId: origin[prop].challengeResultHistoryId,
          Position: origin[prop].position || 1,
          Result: this.calculateResultFromInput(origin[prop].result, substituteId)
        });
      }
    }
    return history;
  }

  parseOriginObjectWF(weight, numberOfReps) {
    weight =
      this.props.weightFloorUnitMeasurement ===
        Constants.UnitMeasurementType.Metric
        ? weight : (weight / this.weightCoefficient).toFixed();
    let nor, w;
    if (_.isNull(weight) || _.isNaN(weight) || _.isUndefined(weight)) {
      w = '000';
    } else if (weight < 10) {
      w = `00${weight}`;
    } else {
      w = weight === 100 ? weight : `0${weight}`;
    }
    if (
      _.isNull(numberOfReps) ||
      _.isNaN(numberOfReps) ||
      _.isUndefined(numberOfReps)
    ) {
      nor = '00';
    } else {
      nor = numberOfReps < 10 ? `0${numberOfReps}` : numberOfReps;
    }
    return `${w}.${nor}`;
  }

  handleOutput(output) {
    const { challenge, challengeTemplate } = this.props;
    const { origin, total, substituteId, templateTypeId } = output;
    const metricEntry = (challenge.MetricEntry || {});
    const isRowDistance =
      metricEntry.EntryType === Constants.MetricEntryType.Distance &&
      metricEntry.EquipmentId === Constants.EquipmentType.Row;

    let member = _.filter(this.props.members, mem => {
      return mem.mboMemberId === this.state.attendanceSelected;
    })[0];
    if (
      _.isUndefined(total[1][0]) &&
      _.isUndefined(total[1][1]) &&
      _.isUndefined(total[2][0]) &&
      _.isUndefined(total[2][1]) &&
      _.isUndefined(total[2][2]) &&
      _.isUndefined(total[3][0]) &&
      _.isUndefined(total[3][1])
    ) {
      return;
    }

    let result = this.calculateResultFromInput(total, substituteId);
    let challengeResult = this.getChallengeResultByAttendanceId(
      this.state.attendanceSelected
    );
    const { MboStudioId, StudioId } = this.props.currentStudio;
    const selectedMarathonType = _.find(challengeTemplate.MarathonMonth.ChallengeTemplateTypes, ['ChallengeTemplateTypeId', templateTypeId]);

    let c_result = {
      ChallengeResultId: this.state.challengeResultSelected,
      ChallengeResultUUId: challengeResult.ChallengeResultUUId,
      MboClassId: this.state.mboClassId,
      MBOStudioId: MboStudioId,
      ChallengeId: this.props.challenge.ChallengeId,
      SubstituteId: substituteId,
      Result: isRowDistance ? parseInt(result, 10) : result,
      ChallengeTemplateTypeId: templateTypeId,
      MemberEmail: member ? member.email : '',
      FirstName: member ? member.firstName : '',
      LastName: member ? member.lastName : '',
      DateCreated:
        challengeResult.DateCreated ||
        moment(new Date(), 'YYYY-MM-DD HH:mm:ssZ'),
      DateUpdated: moment(new Date(), 'YYYY-MM-DD HH:mm:ssZ'),
      ChallengeResultHistories:
        this.parseOriginToChallengeResultHistory(origin, substituteId) || []
    };
    // Add CompletedValue if today challenge is MarathonMonth
    if (challenge.ChallengeTemplateId === challengeTemplate.MarathonMonth.ChallengeTemplateId) {
      c_result.CompletedValue = _.round(Constants.MarathonMonthGoal[selectedMarathonType.TemplateTypeCode] * Constants.CoefficientUnitMeasurement.Distance, 3);
    }
    c_result.IsCompleted = c_result.ChallengeResultHistories.length === this.state.numberOfRound;
    this.props.actions.shared_challenges.saveChallengeResult(
      StudioId,
      c_result
    );
  }

  // Get challenges template types for Marathon Month
  getTemplateTypesMarathon() {
    const { challengeTemplate } = this.props;
    const ct = challengeTemplate.MarathonMonth;

    let options;
    if (ct.ChallengeTemplateTypes.length > 0) {
      options = [
        ...ct.ChallengeTemplateTypes.map((templateType, index) => {
          const label = Helpers.findDiffString(ct.TemplateName, templateType.TemplateTypeName).trim().toUpperCase();
          const value = templateType.ChallengeTemplateTypeId;
          switch (index) {
            case 0:
              return {
                label,
                value,
                goalReached: Constants.MarathonMonthGoal.MarathonMonthFull
              };
            case 1:
              return {
                label,
                value,
                goalReached: Constants.MarathonMonthGoal.MarathonMonthHalf
              };
            case 2:
              return {
                label,
                value,
                goalReached: Constants.MarathonMonthGoal.MarathonMonthUltra
              };
            default:
              return {
                label,
                value,
                goalReached: Constants.MarathonMonthGoal.MarathonMonthFull
              };
          }
        })
      ];
    }
    return options;
  }

  // Open keyboard popup after re-choose the marathon month type
  openKeyboard(keyboardPayload) {
    this.props.actions.core_modal.show(keyboardPayload);
  }
  onMemberClick(e, member, challengeType) {
    const {
      challenge,
      actions,
      weightFloorUnitMeasurement,
      treadmillUnitMeasurement,
      striderUnitMeasurement,
      bikeUnitMeasurement,
      substituteType,
      challengeTemplate,
      marathonTypeId,
      challengeMemberInfo
    } = this.props;
    const id = member.mboMemberId;
    const challengeResult = this.getChallengeResultByAttendanceId(id);
    const metricEntry = (challenge.MetricEntry || {});
    const metricEntryType = metricEntry.EntryType;
    const { mboClassId, numberOfRound } = this.state;
    this.keyboardPayload = {
      modalType: ModalType.Custom,
      size: 'lg',
      component: TimeKeyboard,
      props: {
        actions: this.props.actions,
        member,
        handleOutput: this.handleOutput.bind(this),
        time: this.parseResultToObject(challengeResult.Result),
        origin: this.parseChallengeResultHistory(
          challengeResult.ChallengeResultHistories || [],
          challengeResult.SubstituteId
        ),
        substituteId: challengeResult.SubstituteId,
        challengeTemplateId: challenge.ChallengeTemplateId,
        challengeTemplateTypeId: challenge.ChallengeTemplateId === challengeTemplate.MarathonMonth.ChallengeTemplateId ? marathonTypeId : challengeResult.ChallengeTemplateTypeId,
        challengeTemplate,
        metricEntryType,
        challenge,
        challengeType,
        substituteType,
        uuid: challengeResult.ChallengeResultUUId,
        mboClassId,
        numberOfRound,
        weightFloorUnitMeasurement,
        treadmillUnitMeasurement,
        striderUnitMeasurement,
        bikeUnitMeasurement,
        challengeMemberInfo,
        openKeyboard: () => this.openKeyboard(this.keyboardPayload)
      },
      className: 'numeric-keyboard-container',
      headerClass: 'numeric-keyboard-header'
    };
    if (!this.state.allowEdit) {
      return;
    }

    // Call API to get member results if today challenge is MarathonMonth
    if (challenge.ChallengeTemplateId === challengeTemplate.MarathonMonth.ChallengeTemplateId) {
      actions.shared_challenges.getChallengeMemberInfo(member.memberId, challenge.ChallengeId);
    } else {
      actions.core_modal.show(this.keyboardPayload);
    }
    this.setState({
      challengeResultSelected: challengeResult.ChallengeResultId,
      attendanceSelected: id
    });
  }

  parseResultToObject(result, substituteId) {
    let objResult;
    const { challenge } = this.props;
    const metricEntry = (challenge.MetricEntry || { Title: '' });
    const equipmentId = (challenge.MetricEntry || { Title: '' }).EquipmentId;
    const isDistance =
      metricEntry.EntryType === Constants.MetricEntryType.Distance &&
      metricEntry.EquipmentId !== Constants.EquipmentType.WeightFloor &&
      metricEntry.EquipmentId !== Constants.EquipmentType.Row;
    if (isDistance && metricEntry.EquipmentId === Constants.EquipmentType.Treadmill) {
      result = this.convertDataMeasurementSetting({
        data: result,
        coefficient: this.distanceCoefficient,
        isDefault: this.unitOfMeasure[substituteId] === Constants.UnitMeasurementType.Metric,
        isInit: false,
        decimal: 3
      });
      result =
        parseFloat(result).toFixed(3).split('.')[0].length < 2 ? `0${parseFloat(result).toFixed(3)}`
          : parseFloat(result).toFixed(3);
    }
    if (!result || typeof result !== 'string') {
      return objResult;
    }

    // The result of arr may be following:
    // [xx, xx] (mm:ss) => Time
    // [xx, xx.xx] (mm:ss.ss) => Time
    // [xx.xxx] (miles) => Distance
    let arr = result.split(':');
    // If result is type of Distance
    if (arr.length === 1) {
      let practionArrs = arr[0].split('.');
      if (practionArrs.length === 1) {
        return {
          1: [practionArrs[0].split('')[0], practionArrs[0].split('')[1]],
          2: [
            practionArrs[0].split('')[2],
            practionArrs[0].split('')[3],
            practionArrs[0].split('')[4]
          ],
          3: [0, 0]
        };
      } else if (equipmentId === Constants.EquipmentType.WeightFloor) {
        return {
          1: [
            practionArrs[0].split('')[0],
            practionArrs[0].split('')[1],
            practionArrs[0].split('')[2]
          ],
          2: [practionArrs[1].split('')[0], practionArrs[1].split('')[1]],
          3: [0, 0]
        };
      }
      return {
        1: [practionArrs[0].split('')[0], practionArrs[0].split('')[1]],
        2: [
          practionArrs[1].split('')[0],
          practionArrs[1].split('')[1],
          practionArrs[1].split('')[2]
        ],
        3: [0, 0]
      };
    }

    // Otherwise the result is type of Time
    let minute = arr[0];
    let second = arr[1].split('.')[0];
    let milisecond = arr[1].split('.')[1];

    objResult = {
      1: [0, 0],
      2: [0, 0],
      3: [0, 0]
    };

    objResult[1][0] = minute.split('')[0] || 0;
    objResult[1][1] = minute.split('')[1] || 0;
    objResult[2][0] = second.split('')[0] || 0;
    objResult[2][1] = second.split('')[1] || 0;

    if (milisecond) {
      objResult[3][0] = milisecond.split('')[0] || 0;
      objResult[3][1] = milisecond.split('')[1] || 0;
    }

    return objResult;
  }

  /**
   * Get challenge result by attendanceId
   * @param {number} attendanceId Specify the attendance id
   */
  getChallengeResultByAttendanceId(attendanceId) {
    let challengeResults = this.props.challengeResults || [];
    let challengeResult = challengeResults.find(item => {
      return attendanceId === item.MemberUUId.toString();
    });

    return challengeResult || {};
  }

  /**
   * Re-sort class roster by firstName and lastName
   * @param {Object} rosters The class roster object
   */
  sortClassRoster(rosters) {
    if (rosters.length > 0) {
      rosters.sort(function (ros1, ros2) {
        // ignore upper and lowercase
        const firstName1 = ros1.firstName
          ? ros1.firstName.toLowerCase()
          : '';
        const firstName2 = ros2.firstName
          ? ros2.firstName.toLowerCase()
          : '';
        const lastName1 = ros1.lastName
          ? ros1.lastName.toLowerCase()
          : '';
        const lastName2 = ros2.lastName
          ? ros2.lastName.toLowerCase()
          : '';

        // Sort by firstName
        if (firstName1 < firstName2) {
          return -1;
        } else if (firstName1 > firstName2) {
          return 1;
        }

        // Compare lastName when first name the same
        if (lastName1 < lastName2) {
          return -1;
        } else if (lastName1 > lastName2) {
          return 1;
        }

        // names must be equal
        return 0;
      });
    }
    return rosters;
  }

  /**
   * Calculate the result based on current unit measurement setting
   */
  calculateResult(isWeightFloor, result, substituteId) {
    const {
      challenge,
      weightFloorUnitMeasurement
    } = this.props;
    const metricEntry = (challenge.MetricEntry || { Title: '' });
    const isDistance =
      metricEntry.EntryType === Constants.MetricEntryType.Distance &&
      metricEntry.EquipmentId !== Constants.EquipmentType.WeightFloor &&
      metricEntry.EquipmentId !== Constants.EquipmentType.Row;
    if (isWeightFloor) {
      result =
        weightFloorUnitMeasurement === Constants.UnitMeasurementType.Metric
          && result ? result : (parseFloat(result) / this.weightCoefficient).toFixed(1);
    } else if (isDistance) {
      if (metricEntry.EquipmentId === Constants.EquipmentType.Treadmill) {
        result = this.convertDataMeasurementSetting({
          data: result,
          coefficient: this.distanceCoefficient,
          isDefault: this.unitOfMeasure[substituteId] === Constants.UnitMeasurementType.Metric,
          isInit: false,
          decimal: 3
        });
      }
      result =
        parseFloat(result)
          .toFixed(3)
          .split('.')[0].length < 2
          ? `0${parseFloat(result).toFixed(3)}`
          : parseFloat(result).toFixed(3);
    }
    return result;
  }
  /**
   * Render attendances
   */
  renderAttendances(challengeType) {
    const { isWeightFloorEquipment } = challengeType;
    const { substituteType, challengeTemplate, challenge } = this.props;
    if (!this.props.selectedClass) {
      return [];
    }
    const classAttendances = this.sortClassRoster(
      this.props.members.filter(
        value =>
          value &&
          (value.lateCancelled === false || value.lateCancelled === 'false')
      )
    );
    return classAttendances.map((attendance, index) => {
      let challengeResult = this.getChallengeResultByAttendanceId(
        attendance.mboMemberId
      );
      return (
        <AttendanceButton
          key={index}
          className={'col-md-4 attendance-btn-wrapper'}
          allowEdit={this.state.allowEdit}
          member={attendance}
          challengeType={challengeType}
          substituteId={challengeResult.SubstituteId}
          substituteType={substituteType}
          challengeTemplate={challengeTemplate}
          challengeTemplateId={challenge.ChallengeTemplateId}
          challengeTemplateTypeId={challengeResult.ChallengeTemplateTypeId}
          unitOfMeasure={this.unitOfMeasure}
          result={challengeResult.Result
            ? this.calculateResult(
              isWeightFloorEquipment,
              challengeResult.Result,
              challengeResult.SubstituteId
            )
            : challengeResult.Result}
          onClick={e => this.onMemberClick.bind(this)(e, attendance, challengeType)} />
      );
    });
  }

  render() {
    const { challenge, intl, challengeTemplate } = this.props;
    const isFitnessBenchmark = challenge.FitnessTypeId === Constants.FitnessType.BenchmarkChallenge;
    const isDriTri = challenge.ChallengeTemplateId === challengeTemplate.DriTri.ChallengeTemplateId;
    const isMM = challenge.ChallengeTemplateId === challengeTemplate.MarathonMonth.ChallengeTemplateId;
    const logoUrl = challenge.LogoUrl || null;
    const metricEntry = (challenge.MetricEntry || { Title: '' });
    const challengeTitle =
      Helpers.getTitleChallenge(challenge.ChallengeTemplateId, challengeTemplate) ||
      intl.formatMessage({ id: 'General.NoChallenge.Title' });
    // Check if the challenge is Fitness Benmark and first metrice entry is Rower
    // For this variable so that we know that should be show or hide substitute equipment
    const isWeightFloorEquipment = isFitnessBenchmark &&
      metricEntry.EquipmentId === Constants.EquipmentType.WeightFloor;
    const isRowTime = metricEntry.EntryType === Constants.MetricEntryType.Time &&
      metricEntry.EquipmentId === Constants.EquipmentType.Row;
    const isRowDistance = metricEntry.EntryType === Constants.MetricEntryType.Distance &&
      metricEntry.EquipmentId === Constants.EquipmentType.Row;
    const isDistance = metricEntry.EntryType === Constants.MetricEntryType.Distance;
    return (
      <div>
        <img
          src={RefreshIcon}
          className='refresh-ic'
          onClick={this.getMembers.bind(this)} />
        <div className='title'>
          <p className='select-time'>
            <FormattedMessage id='ClassRoster.Title' />
          </p>
          <p className='challenge-name'>
            <FormattedMessage
              id={Helpers.getPrefixTitleChallenge(challenge.FitnessTypeId)} />
            {': '}
            <span className='label-challenge-of-the-day'>
              {challengeTitle}
            </span>
          </p>
        </div>
        <div className='list-member row'>
          {this.renderAttendances({
            isRowTime,
            isWeightFloorEquipment,
            isDriTri,
            isMM,
            isRowDistance,
            isDistance,
            isFitnessBenchmark,
            logoUrl
          })}
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
CRInput.propTypes = {
  actions: PropTypes.any,
  bikeUnitMeasurement: PropTypes.string,
  challenge: PropTypes.shape({
    ChallengeId: PropTypes.number,
    ChallengeTemplateId: PropTypes.number,
    FitnessTypeId: PropTypes.number,
    MetricEntry: PropTypes.object,
    NumberOfRound: PropTypes.number,
    LogoUrl: PropTypes.string
  }),
  challengeMemberInfo: PropTypes.object,
  challengeResults: PropTypes.array,
  challengeTemplate: PropTypes.object,
  currentStudio: PropTypes.object,
  initPopup: PropTypes.bool,
  intl: intlShape.isRequired,
  isConvention: PropTypes.bool,
  isFetchedChallengeMemberInfo: PropTypes.bool,
  isOpenPopup: PropTypes.bool,
  location: PropTypes.object,
  marathonTypeId: PropTypes.number,
  members: PropTypes.array,
  removeChallengeResultSuccess: PropTypes.bool,
  saveChallengeResultSuccess: PropTypes.bool,
  savedEquipment: PropTypes.object,
  selectedClass: PropTypes.object,
  selectedDate: PropTypes.any,
  striderUnitMeasurement: PropTypes.string,
  substituteType: PropTypes.object,
  treadmillUnitMeasurement: PropTypes.string,
  weightFloorUnitMeasurement: PropTypes.string
};

export default injectIntl(CRInput);

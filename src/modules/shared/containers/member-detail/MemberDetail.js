import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage, intlShape, injectIntl } from 'react-intl';

import { Constants } from 'common';
import * as Helpers from 'common/utils/helpers';
import { PanelContainer } from 'modules/studio-view/containers';

import {
  TypeMetricSwitch,
  TypeMetric,
  MemberRowerDetail,
  MemberDetailDriTri,
  MemberDetailByEquipment
} from './components';

import './styles.scss';
import { IconMale, IconFemale } from 'modules/shared/images';


export class MemberDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectType: TypeMetric.Rower
    };
    this.children = undefined;
  }

  componentDidMount() {
    const { actions, memberDetail, params } = this.props;
    actions.shared_challenges.getChallengeTypes();
    if (!memberDetail && params.id) {
      actions.shared_members.getMember(params.id);
    }
  }

  componentWillUnmount() {
    this.props.actions.shared_members.detroyMemberDetail();
  }

  selectEquipment(name) {
    this.setState({ selectType: name });
  }

  handleOnSelectMetricType(type) {
    this.setState({
      selectType: type
    });
  }

  renderAvatar() {
    const { memberDetail } = this.props;
    if (!memberDetail) { return IconMale; }

    if (memberDetail.ProfilePictureUrl) { return memberDetail.ProfilePictureUrl; }

    return memberDetail.GenderId === Constants.GenderType.Men ? IconMale : IconFemale;
  }

  renderMemberName() {
    const { memberDetail } = this.props;
    if (!memberDetail) { return undefined; }

    let name = Helpers.formatMemberName(memberDetail.FirstName, memberDetail.LastName);
    name = name.replace('\\', '');
    return name;
  }

  renderMemberDetail() {
    const {
      actions,
      memberDetail,
      intl,
      challengeTemplate,
      treadmillUnitMeasurement,
      striderUnitMeasurement,
      bikeUnitMeasurement
    } = this.props;
    const uom = {
      2: treadmillUnitMeasurement,
      3: striderUnitMeasurement,
      4: Constants.UnitMeasurementType.Metric,
      5: bikeUnitMeasurement,
      7: treadmillUnitMeasurement
    };
    if (!memberDetail) {
      return <div />;
    }

    switch (this.state.selectType) {
      case TypeMetric.Treadmill:
        return <MemberDetailByEquipment
          {...this.props}
          actions={actions}
          uom={uom}
          equipmentName={intl.formatMessage({ id: 'Equipment.Treadmill.Title' })}
          equipmentType={Constants.EquipmentType.Treadmill} />;
      case TypeMetric.PowerWalker:
        return <MemberDetailByEquipment
          {...this.props}
          actions={actions}
          uom={uom}
          equipmentName={intl.formatMessage({ id: 'Equipment.PW.Title' })}
          equipmentType={Constants.EquipmentType.PowerWalker} />;
      case TypeMetric.Bike:
        return <MemberDetailByEquipment
          {...this.props}
          actions={actions}
          uom={uom}
          equipmentName={intl.formatMessage({ id: 'Equipment.Bike.Title' })}
          equipmentType={Constants.EquipmentType.Bike} />;
      case TypeMetric.Strider:
        return <MemberDetailByEquipment
          {...this.props}
          actions={actions}
          uom={uom}
          equipmentName={intl.formatMessage({ id: 'Equipment.Strider.Title' })}
          equipmentType={Constants.EquipmentType.Strider} />;
      case TypeMetric.Rower:
        return <MemberRowerDetail actions={actions} memberDetail={memberDetail} uom={uom}
          equipmentType={Constants.EquipmentType.Row} />;
      default:
        return <MemberDetailDriTri
          actions={actions}
          uom={uom}
          memberDetail={memberDetail}
          challengeId={challengeTemplate.DriTri.ChallengeTemplateId} />;
    }
  }

  render() {
    const { equipmentLogo, challengeTemplate } = this.props;
    return (
      <div className='member-detail-wrapper'>
        <PanelContainer
          leftPanel={(
            <div className='wrapper'>
              <div className='member-area'>
                <div className='member-icon'>
                  <img src={this.renderAvatar()} />
                </div>
                <div className='member-name'>{this.renderMemberName()}</div>
              </div>
              <div className='metric-switch-area'>
                <TypeMetricSwitch
                  logoUrl={equipmentLogo.Rower || null}
                  type={TypeMetric.Rower}
                  isSelected={this.state.selectType === TypeMetric.Rower}
                  name={<FormattedMessage id={'Equipment.Rower.Title'} />}
                  onSelect={this.handleOnSelectMetricType.bind(this)} />
                <TypeMetricSwitch
                  logoUrl={equipmentLogo.Treadmill || null}
                  type={TypeMetric.Treadmill}
                  isSelected={this.state.selectType === TypeMetric.Treadmill}
                  name={<FormattedMessage id={'Equipment.Treadmill.Title'} />}
                  onSelect={this.handleOnSelectMetricType.bind(this)} />
                <TypeMetricSwitch
                  logoUrl={equipmentLogo.Strider || null}
                  type={TypeMetric.Strider}
                  isSelected={this.state.selectType === TypeMetric.Strider}
                  name={<FormattedMessage id={'Equipment.Strider.Title'} />}
                  onSelect={this.handleOnSelectMetricType.bind(this)} />
                <TypeMetricSwitch
                  logoUrl={equipmentLogo.Bike || null}
                  type={TypeMetric.Bike}
                  isSelected={this.state.selectType === TypeMetric.Bike}
                  name={<FormattedMessage id={'Equipment.Bike.Title'} />}
                  onSelect={this.handleOnSelectMetricType.bind(this)} />
                <TypeMetricSwitch
                  logoUrl={equipmentLogo.PowerWalker || null}
                  type={TypeMetric.PowerWalker}
                  isSelected={this.state.selectType === TypeMetric.PowerWalker}
                  name={<FormattedMessage id={'Equipment.PW.Title'} />}
                  onSelect={this.handleOnSelectMetricType.bind(this)} />
                <TypeMetricSwitch
                  logoUrl={challengeTemplate.DriTri.LogoUrl || null}
                  type={TypeMetric.DriTri}
                  isSelected={this.state.selectType === TypeMetric.DriTri}
                  name={<FormattedMessage id={'PersonalBenchmarks.MetricRecords.DriTri'} />}
                  onSelect={this.handleOnSelectMetricType.bind(this)} />
              </div>
            </div>
          )}
          rightPanel={(
            <div className='container-pesonal-benchmark'>
              {this.renderMemberDetail()}
            </div>
          )} />
      </div>
    );
  }
}

/**
 * Typechecking With PropTypes
 * Reference https://facebook.github.io/react/docs/typechecking-with-proptypes.html
 * Proptypes: https://github.com/facebook/prop-types
 */
MemberDetail.propTypes = {
  actions: PropTypes.object,
  bikeUnitMeasurement: PropTypes.string,
  challengeLogo: PropTypes.object,
  challengeTemplate: PropTypes.object,
  equipmentLogo: PropTypes.object,
  intl: intlShape.isRequired,
  memberDetail: PropTypes.object,
  params: PropTypes.object,
  striderUnitMeasurement: PropTypes.string,
  treadmillUnitMeasurement: PropTypes.string
};

const memberDetail = connect(state => ({
  memberDetail: state.shared_members.memberDetail,
  challengeTemplate: state.shared_challenges.challengeTemplate,
  equipmentLogo: state.shared_challenges.equipmentLogo,
  challengeLogo: state.shared_challenges.challengeLogo,
  treadmillUnitMeasurement: state.studio_setting.treadmillUnitMeasurement,
  striderUnitMeasurement: state.studio_setting.striderUnitMeasurement,
  bikeUnitMeasurement: state.studio_setting.bikeUnitMeasurement
}))(MemberDetail);

export default injectIntl(memberDetail);

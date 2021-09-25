/**
 * React / Redux dependencies
 */
import React, { memo } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { intlShape, injectIntl } from 'react-intl';
import ChallengeItem from '../challenge-item/ChallengeItem';
import { RankTable, TableColumn, ModalResult, ModalType } from 'modules/core/components';
import ChallengeForm from '../challenge-form/ChallengeForm';
import moment from 'moment';
import './styles.scss';

export class ChallengeList extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(newProps) {
    if (newProps && newProps.deleteChallengeSuccess
      && newProps.deleteChallengeSuccess !== this.props.deleteChallengeSuccess) {
      newProps.challengeFilterComp.handleFilter();
    }
  }
  textFormat(cell) {
    return <label className='text-enddate'>{cell}</label>;
  }
  handleOnChallengeFormClose(modalResult) {
    const { challengeFilterComp, paramFilter } = this.props;
    if (modalResult === ModalResult.Ok && challengeFilterComp) {
      this.props.actions.core_table.search({
        url: 'corporate/challenges',
        params: {
          endDate: paramFilter.endDate,
          startDate: paramFilter.startDate,
          division: paramFilter.division
        }
      });
    }
  }
  updateChallenge(cell, row, e) {
    const { challengeFilterComp, data } = this.props;
    const startDate = moment(row.StartDate).format('MM/DD/YYYY');
    const endDate = moment(row.EndDate).format('MM/DD/YYYY');
    this.props.actions.core_modal.show({
      title: 'EDIT CHALLENGE',
      modalType: ModalType.Custom,
      size: 'lg',
      component: ChallengeForm,
      props: {
        id: row.ChallengeId,
        numberOfRound: row.NumberOfRound,
        challengeFilterComp,
        selectedChallenge: row.ChallengeId,
        challengeStartDate: startDate,
        challengeEndDate: endDate,
        actions: this.props.actions,
        disableCheckboxAllStudio: true,
        data
      },
      headerClass: 'challenge-form-header',
      className: 'challenge-form-modal',
      onClose: this.handleOnChallengeFormClose.bind(this)
    });
  }
  dateFormat(cell, row) {
    const format = 'MM/DD/YYYY, hh:mm A';
    return <label className='date-format'>{moment(cell).format(format)}</label>;
  }
  actionEdit(cell, row) {
    return <i className='fa fa-pencil' aria-hidden='true' onClick={() => this.updateChallenge(cell, row)} />;
  }
  listChallengeTable() {
    return [
      new TableColumn({
        dataField: 'ChallengeId',
        headerName: 'Challenge Name',
        width: '151',
        isKey: true,
        dataAlign: 'center'
      }),
      new TableColumn({
        dataField: 'LogoUrl',
        headerName: 'logo',
        dataAlign: 'center',
        width: '200'
      }),
      new TableColumn({
        dataField: 'ChallengeName',
        headerName: 'Challenge Type',
        dataAlign: 'center',
        dataFormat: this.textFormat
      }),
      new TableColumn({
        dataField: 'StudioName',
        headerName: 'Studio',
        dataAlign: 'center',
        dataFormat: this.textFormat
      }),
      new TableColumn({
        dataField: 'StartDate',
        headerName: 'Start Date',
        dataAlign: 'center',
        dataFormat: this.dateFormat
      }),
      new TableColumn({
        dataField: 'EndDate',
        headerName: 'End Date',
        dataAlign: 'center',
        dataFormat: this.dateFormat
      }),
      new TableColumn({
        dataField: 'editChallenge',
        headerName: 'Action',
        dataAlign: 'center',
        dataFormat: this.actionEdit.bind(this)
      })
    ];
  }
  renderChallenges() {
    const { allChallengeTemplate, actions, challengeFilterComp } = this.props;
    return allChallengeTemplate.map((item, index) => {
      return <ChallengeItem key={index} challengeItemTemplate={item} actions={actions}
        challengeFilterComp={challengeFilterComp} />;
    });
  }
  /**
   * Return template of challenges list item component
   */
  render() {
    const { isSelectChallenge, challengeFilterComp, itemChallenge } = this.props;
    return (
      <div className='challenge-list row list-group'>
        {isSelectChallenge ?
          <RankTable
            actions={this.props.actions}
            columns={this.listChallengeTable()}
            isChallengeList={true}
            enableSearch={true}
            challengeFilterComp={challengeFilterComp}
            itemChallenge={itemChallenge} /> : this.renderChallenges()
        }
      </div>
    );
  }
}

/**
 * Typechecking With PropTypes
 * Reference https://facebook.github.io/react/docs/typechecking-with-proptypes.html
 * Proptypes: https://github.com/facebook/prop-types
 */
ChallengeList.propTypes = {
  actions: PropTypes.any,
  allChallengeTemplate: PropTypes.array,
  challengeFilterComp: PropTypes.any,
  challenges: PropTypes.array,
  data: PropTypes.array,
  deleteChallengeSuccess: PropTypes.bool,
  intl: intlShape.isRequired,
  isSelectChallenge: PropTypes.bool,
  itemChallenge: PropTypes.object,
  paramFilter: PropTypes.object,
  selectedChallenge: PropTypes.number
};

const challengeItem = connect(state => ({
  challenges: state.shared_challenges.challenges,
  isSelectChallenge: state.shared_challenges.isSelectChallenge,
  allChallengeTemplate: state.shared_challenges.allChallengeTemplate,
  itemChallenge: state.shared_challenges.itemChallenge,
  deleteChallengeSuccess: state.shared_challenges.deleteChallengeSuccess,
  data: state.core_table.data,
  paramFilter: state.shared_challenges.paramFilter
}))(memo(ChallengeList));
export default injectIntl(challengeItem);

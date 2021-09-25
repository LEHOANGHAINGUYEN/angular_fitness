import React from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import moment from 'moment';
import * as _ from 'lodash';
import { connect } from 'react-redux';

import './styles.scss';
import { TableColumn, RankTable } from 'modules/core/components';
import { LeaderboardFilter } from 'modules/shared/components';
import { locale as defaultLocale } from 'localization';
import { PanelContainer } from 'modules/studio-view/containers';
import { Helpers } from 'common';
export class LeaderboardContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hideClassTimeColumn: false,
      hideCompletionTime: false
    };
  }
  componentDidMount() {
    this.props.actions.shared_challenges.getChallengeTypes();
  }
  timeColumn(cell) {
    return <p className='text-time'><span className='time'>{cell}</span></p>;
  }

  formatClassTime(cell) {
    return <p className='text-class'><span>{moment(cell).locale(defaultLocale).format('LT')}</span></p>;
  }

  // Format completion time that member was reached
  dateFormat(cell, row) {
    const format = 'MM/DD/YYYY, hh:mm A';
    return !_.isNull(row.CompletedDate) ? <label className='date-format'>{moment(cell).format(format)}</label> : null;
  }

  // Format goal
  goalFormat(cell, row) {
    const { challengeTemplate } = this.props;
    const challengeTypesMarathon = challengeTemplate.MarathonMonth.ChallengeTemplateTypes;
    let subTypeMarathon = _.find(challengeTypesMarathon, ['ChallengeTemplateTypeId', row.ChallengeTemplateTypeId]);
    return !_.isNull(row.CompletedDate)
      ? <label className='sub-marathon'>
          {Helpers.findDiffString(challengeTemplate.MarathonMonth.TemplateName, subTypeMarathon.TemplateTypeName)
                  .trim()
                  .toUpperCase()}
        </label>
      : null;
  }
  /**
  * Populate table columns for interactive leader board table
  */

  populateTableColumns() {
    const { intl, isConvention, challengeTemplate, todayChallenge } = this.props;
    const columns = [
      new TableColumn({
        dataField: 'Rank',
        headerName: intl.formatMessage({ id: 'RankTable.RankColumn.Header' }),
        isKey: true
      }),
      new TableColumn({
        dataField: 'MemberName',
        headerName: intl.formatMessage({ id: 'RankTable.NameColumn.Header' })
      }),
      new TableColumn({
        dataField: 'goal',
        dataFormat: this.goalFormat.bind(this)
      }),
      (todayChallenge.ChallengeTemplateId === challengeTemplate.MarathonMonth.ChallengeTemplateId) && new TableColumn({
        dataField: 'CompletedDate',
        headerName: intl.formatMessage({ id: 'RankTable.ComplatedDateColumn.Header' }),
        dataAlign: 'center',
        dataFormat: this.dateFormat.bind(this)
      }),
      new TableColumn({
        dataField: 'ClassTime',
        headerName: intl.formatMessage({ id: 'RankTable.ClassTimeColumn.Header' }),
        dataFormat: this.formatClassTime
      }),
      (isConvention === 'true') && new TableColumn({
        dataField: 'StudioName',
        headerName: 'Studio',
        dataAlign: 'center',
        className: 'studio-column'
      }),
      new TableColumn({
        dataField: 'UnitOfMeasure',
        headerName: 'UOM',
        className: 'uom',
        dataAlign: 'center'
      }),
      new TableColumn({
        dataField: 'Result',
        headerName: intl.formatMessage({ id: 'RankTable.RecordColumn.Header' }),
        dataAlign: 'center',
        dataFormat: this.timeColumn,
        className: 'record-column'
      })
    ];

    //  Challenge type Orange Voyage don't show column Class Time and column Completion Time
    if (this.state.hideClassTimeColumn && this.state.hideCompletionTime) {
      return _.filter(columns, (item) => {
        return item.dataField !== 'ClassTime' && item.dataField !== 'CompletedDate';
      });
    }
    // Challenge MarathonMonth don't show column Class Time
    if (this.state.hideClassTimeColumn) {
      return _.filter(columns, (item) => {
        return item.dataField !== 'ClassTime';
      });
    }
    //  Only challenge Marathon Month is showed column Completion Time
    if (this.state.hideCompletionTime) {
      return _.filter(columns, (item) => {
        return item.dataField !== 'CompletedDate';
      });
    }
    return columns;
  }

  onFilter(filterValue) {
    if (filterValue && (filterValue.challengeTemplateId
      === filterValue.challengeTemplate.OrangeVoyage.ChallengeTemplateId)) {
      this.setState({ hideClassTimeColumn: true, hideCompletionTime: true });
    } else if (filterValue && (filterValue.challengeTemplateId
      === filterValue.challengeTemplate.MarathonMonth.ChallengeTemplateId)) {
      this.setState({ hideClassTimeColumn: true, hideCompletionTime: false });
    }
    else {
      this.setState({ hideClassTimeColumn: false, hideCompletionTime: true });
    }
  }
  render() {
    const { intl, isConvention, homeStudio } = this.props;
    const studioAverage = homeStudio ? homeStudio.studioAverage : '';
    return (
      <div className='leader-board-container row'>
        <PanelContainer
          leftPanel={(
            <div>
              <div className='top-left-container' />
              <LeaderboardFilter
                actions={this.props.actions}
                onFilterCallback={this.onFilter.bind(this)}
                isConvention={isConvention} />
            </div>
          )}
          rightPanel={(
            <div>
              {this.props.defaultTitle &&
                <div className='title-interactive-leader-board'>
                  <p className='text'>{intl.formatMessage({ id: 'Interactive.Title' })}</p>
                </div>}
              <div className='average-result-container'>
                {`${intl.formatMessage({ id: 'Interactive.Average' })}: ${studioAverage ? studioAverage : 0}`}
              </div>
              <RankTable
                actions={this.props.actions}
                columns={this.populateTableColumns()} />
            </div>
          )} />
      </div>
    );
  }
}

LeaderboardContent.propTypes = {
  actions: PropTypes.any,
  challengeTemplate: PropTypes.object,
  defaultTitle: PropTypes.bool,
  homeStudio: PropTypes.object,
  intl: intlShape.isRequired,
  isConvention: PropTypes.bool,
  todayChallenge: PropTypes.object
};

const leaderboardContent = connect(state => ({
  homeStudio: state.shared_challenges.homeStudio,
  challengeTemplate: state.shared_challenges.challengeTemplate,
  todayChallenge: state.shared_challenges.todayChallenge
}))(LeaderboardContent);

export default injectIntl(leaderboardContent);

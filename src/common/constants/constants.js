export const Constants = {
  LeaderboardOptionalKey: 'LEADERBOARD_OPT',
  ListModalId: 'LIST_MODAL_ID',
  MemberResultKey: 'MEMBER_RESULT',
  CoefficientUnitMeasurement: {
    Weight: 0.45359237,
    Distance: 1.609344
  },
  // Challenge type enum
  ChallengeType: {
    All: 'All',
    FitnessBenchmark: 1,
    DriTri: 2,
    Infinity: 3,
    MarathonMonth: 5,
    OrangeVoyage: 7,
    GoRow: 8,
    OrangeEverest: 9,
    CatchMeIfYouCan: 10,
    CaptureTheFlag: 11,
    Regatta: 12
  },
  FitnessType: {
    BenchmarkChallenge: 1,
    SignatureWorkout: 2,
    Event: 3
  },
  formulaDistance: {
    2: 3,
    3: 4,
    4: 0.5
  },
  // Equipment type enum
  EquipmentType: {
    All: 'All',
    Treadmill: 2,
    Strider: 3,
    Row: 4,
    Bike: 5,
    WeightFloor: 6,
    PowerWalker: 7
  },

  // Gender type enum
  GenderType: {
    Men: 1,
    Women: 2,
    All: 'All'
  },
  MarathonMonthGoal: {
    MarathonMonthFull: 26.2,
    MarathonMonthHalf: 13.1,
    MarathonMonthUltra: 31.1
  },
  MarathonMonthTypes: {
    Full: 'Full',
    Half: 'Half',
    Ultra: 'Ultra'
  },
  // Age group type enum for leaderboard
  AgeGroup: {
    Equal29AndUnder: 1,
    From30To39: 2,
    From40To49: 3,
    From50To59: 4,
    From60AndUpper: 5
  },
  userRole: {
    STAFF_ADMIN: 'Corporate Admin',
    STAFF_USER: 'Corporate User'
  },
  // Metric entry type enum
  MetricEntryType: {
    Time: 'Time',
    Distance: 'Distance',
    Reps: 'Reps'
  },
  // Measurement type enum
  MeasurementType: {
    Metric: 1,
    Imperial: 0
  },
  UnitMeasurementType: {
    Metric: 'Metric',
    Imperial: 'Imperial'
  },
  WeightMeasurementType: {
    KG: 'KG',
    LB: 'LB'
  },
  // Metric measurement enum
  MetricMeasurement: {
    Meter: 'METER',
    Mile: 'MILE',
    Min: 'MIN',
    Reps: 'REPS'
  },

  // Pagination config
  pagination: {
    default: {
      pageSizes: [{
        value: 15,
        label: '15'
      },
      {
        value: 25,
        label: '25'
      },
      {
        value: 30,
        label: '30'
      },
      {
        value: 50,
        label: '50'
      }
      ],
      pageSize: 15,
      pageDefault: 1,
      numberPageDisplay: 3
    },
    defaultMember: {
      pageSize: 5,
      pageDefault: 1,
      numberPageDisplay: 3
    }
  },

  // language config
  languageConfig: {
    default: {
      languages: [
        {
          value: 'en',
          label: 'English'
        },
        {
          value: 'es',
          label: 'Español'
        },
        {
          value: 'fr',
          label: 'Français'
        },
        {
          value: 'ja',
          label: '日本語'
        }
      ]
    }
  },
  paginationArea: {
    default: {
      pageAreas: [
        {
          value: 'studio',
          label: 'STUDIO'
        },
        {
          value: 'state',
          label: 'STATE'
        },
        {
          value: 'country',
          label: 'COUNTRY'
        },
        {
          value: 'global',
          label: 'GLOBAL'
        }
      ],
      pageArea: 'studio'
    }
  },
  CognitoStatus: {
    Success: 'SUCCESS',
    NewPasswordRequired: 'NEW_PASSWORD_REQUIRED',
    SetNewPasswordSuccess: 'SET_NEW_PASSWORD_SUCCESSFULLY',
    ForgotPasswordSuccess: 'FORGOT_PASSWORD_SUCCESS',
    VerifyCodeSendSuccess: 'VERIFY_CODE_SEND_SUCCESS'
  },
  Division: {
    Global: 'Global',
    Regional: 'Regional',
    National: 'National',
    Studio: 'Studio'
  },

  SelectedDateKey: 'SELECTED_DATE',

  ClassSize: {
    Original: 'original'
  }
};

export const SelectOptionsConstants = {
  /**
   * Age group
   */
  AgeGroup: [
    {
      value: Constants.AgeGroup.Equal29AndUnder,
      label: '29 & Under'
    },
    {
      value: Constants.AgeGroup.From30To39,
      label: '30-39'
    },
    {
      value: Constants.AgeGroup.From40To49,
      label: '40-49'
    },
    {
      value: Constants.AgeGroup.From50To59,
      label: '50-59'
    },
    {
      value: Constants.AgeGroup.From60AndUpper,
      label: '60+'
    }
  ],
  /**
  * Equipment type options for form-select component
  */
  EquipmentTypeOptions: [{
    value: Constants.EquipmentType.Row,
    label: 'Rower',
    i18nKey: 'Equipment.Rower.Title'
  },
  {
    value: Constants.EquipmentType.Bike,
    label: 'Bike',
    i18nKey: 'Equipment.Bike.Title'
  },
  {
    value: Constants.EquipmentType.Treadmill,
    label: 'Treadmill',
    i18nKey: 'Equipment.Treadmill.Title'
  },
  {
    value: Constants.EquipmentType.Strider,
    label: 'Strider',
    i18nKey: 'Equipment.Strider.Title'
  },
  {
    value: Constants.EquipmentType.PowerWalker,
    label: 'Power Walker',
    i18nKey: 'Equipment.PW.Title'
  },
  {
    value: Constants.EquipmentType.WeightFloor,
    label: 'Weight Floor',
    i18nKey: 'Equipment.WF.Title'
  }
  ],
  MarathonEquipmentTypeOptions: [{
    value: Constants.EquipmentType.Bike,
    label: 'Bike'
  },
  {
    value: Constants.EquipmentType.Treadmill,
    label: 'Treadmill'
  },
  {
    value: Constants.EquipmentType.Strider,
    label: 'Strider'
  },
  {
    value: Constants.EquipmentType.PowerWalker,
    label: 'Power Walker'
  }
  ],
  OrangeVoyageEquipmentTypeOptions: [{
    value: Constants.EquipmentType.Row,
    label: 'Row'
  }],
  EquipmentTypeTreadmill: [{
    value: Constants.EquipmentType.Treadmill,
    label: 'Treadmill'
  }],
  /**
   * Entry type options for form-select
   */
  EntryTypeOptions: [{
    value: Constants.MetricEntryType.Time,
    label: 'Time'
  },
  {
    value: Constants.MetricEntryType.Distance,
    label: 'Distance'
  },
  {
    value: Constants.MetricEntryType.Reps,
    label: 'Reps'
  }
  ],
  EntryTypeFitnessBenchmarkOptions: [
    {
      value: Constants.MetricEntryType.Time,
      label: 'Time'
    },
    {
      value: Constants.MetricEntryType.Distance,
      label: 'Distance'
    }
  ],
  EntryTypeDistanceOptions: [
    {
      value: Constants.MetricEntryType.Distance,
      label: 'Distance'
    }
  ],
  EntryTypeTimeOptions: [
    {
      value: Constants.MetricEntryType.Time,
      label: 'Time'
    }
  ],
  EntryTypeRepsOptions: [
    {
      value: Constants.MetricEntryType.Reps,
      label: 'Reps'
    }
  ],

  /**
   * Entry type options for form-select
   */
  MeasurementTypeOptions: [{
    value: Constants.MetricMeasurement.Meter,
    label: 'Meter'
  },
  {
    value: Constants.MetricMeasurement.Mile,
    label: 'Mile'
  },
  {
    value: Constants.MetricMeasurement.Reps,
    label: 'Reps'
  }
  ],
  /**
   * Measurement type for time
   */
  MeasurementTypeTimeOptions: [
    {
      value: Constants.MetricMeasurement.Min,
      label: 'Min'
    }
  ],
  MeasurementTypeMeterOptions: [
    {
      value: Constants.MetricMeasurement.Meter,
      label: 'Meter'
    },
    {
      value: Constants.MetricMeasurement.Mile,
      label: 'Mile'
    }
  ],
  MeasurementTypeRepsOptions: [
    {
      value: Constants.MetricMeasurement.Reps,
      label: 'Reps'
    }
  ],
  /**
   * Measurement type for Orange Voyage
   */
  MeasurementTypeOrangeVoyageOptions: [{
    value: Constants.MetricMeasurement.Meter,
    label: 'Meter'
  },
  {
    value: Constants.MetricMeasurement.Min,
    label: 'Min'
  }
  ],
  DriTriRange: [
    {
      templateTypeId: null,
      minValue: '20:00.00',
      maxValue: '90:00.00'
    },
    {
      templateTypeId: 3,
      minValue: '10:00.00',
      maxValue: '60:00.00'
    },
    {
      templateTypeId: 4,
      minValue: '20:00.00',
      maxValue: '90:00.00'
    }
  ]
};

export const LocaleSessionConstant = 'current_locale';

export default Constants;

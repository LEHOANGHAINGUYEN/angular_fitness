const AppConstants = {
  appName: 'Challenge Tracker',
  defaultPagePath: {
    app: '/login',
    studio: '/studio/coach-hub-home',
    corporate: '/corporate/coaches-hub'
  },
  members: [
    { name: 'Christopher Doe' },
    { name: 'Anna Doe' },
    { name: 'Benny Fury' },
    { name: 'Celine Mathew' },
    { name: 'Daniel Town' },
    { name: 'Emma Boris' },
    { name: 'Jenny May' },
    { name: 'Jenifer Louis' },
    { name: 'Ken Doe' },
    { name: 'Ken Doe' }
  ],
  division: [
    { value: 'Studio', label: 'Studio', i18nKey: 'Interactive.Filter.Studio' },
    { value: 'Regional', label: 'Regional', i18nKey: 'Interactive.Filter.Regional' },
    { value: 'National', label: 'National', i18nKey: 'Interactive.Filter.National' },
    { value: 'Global', label: 'Global', i18nKey: 'Interactive.Filter.Global' }
  ],
  notifications: [
    {
      name: 'Clarine Vassar',
      message: 'Sometimes it takes a lifetime to win a battle.'
    },
    {
      name: 'Clarine Vassar',
      message: 'Sometimes it takes a lifetime to win a battle.'
    }
  ],
  menuItems: [
    {
      name: 'Coaches Hub',
      to: '/corporate/coaches-hub',
      className: 'coaches'
    },
    {
      name: 'Template',
      to: '/corporate/template',
      className: 'reports'
    },
    {
      name: 'Challenges',
      to: '/corporate/challenges',
      className: 'challenges'
    },
    {
      name: 'Reports',
      to: '/corporate/reports',
      className: 'reports'
    },
    {
      name: 'Leaderboard',
      to: '/corporate/leader-board',
      className: 'leader-board'
    },
    {
      name: 'Member Management',
      to: '/corporate/member-management',
      className: 'member-management'
    },
    {
      name: 'Push Notifications',
      to: '/corporate/push-notifications',
      className: 'push-notifications'
    }
  ],
  address: [
    '14th Street, Washington D.C. #0943',
    'Albuquerque Far Northeast Heights, NM #0567',
    'Fort Lauderdale - North - Commercial, FL #0005',
    'Fort Myers-Six Mile Cypress, FL #283',
    'Grove City, OH #0752'
  ],
  fitnessEquipment: [
    { value: '', label: 'All Equipments' },
    { value: 'Treadmill', label: 'Treadmill' },
    { value: 'Row', label: 'Row' },
    { value: 'Striker', label: 'Striker' },
    { value: 'Biker', label: 'Biker' }
  ],
  studioLocation: [
    { value: '', label: 'All Studios' },
    { value: 'Individually', label: 'Individually' },
    { value: 'Regionally', label: 'Regionally' },
    { value: 'Nationally', label: 'Nationally' }
  ],
  challengeFormSelect: {
    language: [
      { value: 'En', label: 'English' },
      { value: 'ar', label: 'Arabic' },
      { value: 'yue', label: 'Cantonese' },
      { value: 'zh', label: 'Chinese' },
      { value: 'fr', label: 'French' },
      { value: 'gd', label: 'Gaelic' },
      { value: 'de', label: 'German' },
      { value: 'he', label: 'Hebrew' },
      { value: 'it', label: 'Italian' },
      { value: 'ja', label: 'Japanese' },
      { value: 'ms', label: 'Malay' },
      { value: 'cmn', label: 'Mandarin' },
      { value: 'es', label: 'Spanish' }
    ],
    country: [
      { value: '', label: 'All' },
      { value: 'US', label: 'United States' },
      { value: 'AU', label: 'Australia' },
      { value: 'BH', label: 'Bahrain' },
      { value: 'CA', label: 'Canada' },
      { value: 'CL', label: 'Chile' },
      { value: 'CN', label: 'China' },
      { value: 'CO', label: 'Colombia' },
      { value: 'CR', label: 'Costa Rica' },
      { value: 'DE', label: 'Germany' },
      { value: 'GT', label: 'Guatemala' },
      { value: 'HK', label: 'Hong Kong' },
      { value: 'IL', label: 'Israel' },
      { value: 'JP', label: 'Japan' },
      { value: 'KW', label: 'Kuwait' },
      { value: 'MX', label: 'Mexico' },
      { value: 'OM', label: 'Oman' },
      { value: 'PA', label: 'Panama' },
      { value: 'PE', label: 'Peru' },
      { value: 'PR', label: 'Puerto Rico' },
      { value: 'QA', label: 'Qatar' },
      { value: 'SA', label: 'Saudi Arabia' },
      { value: 'SG', label: 'Singapore' },
      { value: 'ES', label: 'Spain' },
      { value: 'DO', label: 'Dominican Republic' },
      { value: 'AE', label: 'United Arab Emirates' },
      { value: 'GB', label: 'United Kingdom/England' },
      { value: 'IE', label: 'Ireland' },
      { value: 'IT', label: 'Italy' },
      { value: 'NZ', label: 'New Zealand' },
      { value: 'FR', label: 'France' }
    ],
    divisionRegional: [
      {
        value: 'AK-01 (UFG)',
        label: 'ALASKA'
      },
      {
        value: 'AL-01/MS-02',
        label: 'ALABAMA AND MISSISSIPPI'
      },
      {
        value: 'AR-01',
        label: 'ARKANSAS'
      },
      {
        value: 'AZ-01',
        label: 'ARIZONA'
      },
      {
        value: 'CA-01',
        label: 'CALIFORNIA - ORANGE COUNTY'
      },
      {
        value: 'CA-02',
        label: 'CALIFORNIA - SAN DIEGO'
      },
      {
        value: 'CA-03',
        label: 'CALIFORNIA - SAN JOSE AREA'
      },
      {
        value: 'CA-04',
        label: 'CALIFORNIA - LOS ANGELES'
      },
      {
        value: 'CA-05',
        label: 'CALIFORNIA - SACRAMENTO'
      },
      {
        value: 'CA-06',
        label: 'CALIFORNIA - INLAND EMPIRE (LA)'
      },
      {
        value: 'CA-07/NV-02',
        label: 'CALIFORNIA - SAN FRANCISCO (NORTH BAY AREA)'
      },
      {
        value: 'CO-01',
        label: 'COLORADO'
      },
      {
        value: 'CT-01',
        label: 'CONNECTICUT'
      },
      {
        value: 'DC-01',
        label: 'WASHINGTON DC'
      },
      {
        value: 'DE-01',
        label: 'DELAWARE'
      },
      {
        value: 'FL-01 (UFG)',
        label: 'FLORIDA - SOUTH'
      },
      {
        value: 'FL-02',
        label: 'FLORIDA - TAMPA BAY'
      },
      {
        value: 'FL-03',
        label: 'FLORIDA - CENTRAL AND NORTH '
      },
      {
        value: 'GA-01',
        label: 'GEORGIA'
      },
      {
        value: 'HI-01',
        label: 'HAWAII'
      },
      {
        value: 'IA-01',
        label: 'IOWA'
      },
      {
        value: 'ID/MT-01',
        label: 'IDAHO AND MONTANA'
      },
      {
        value: 'IL-01',
        label: 'ILLINOIS'
      },
      {
        value: 'IN-02',
        label: 'INDIANA'
      },
      {
        value: 'KS/MO-01',
        label: 'KANSAS/MISSOURI'
      },
      {
        value: 'KY/IN-01',
        label: 'KENTUCKY & INDIANA'
      },
      {
        value: 'LA-01',
        label: 'LOUISIANA'
      },
      {
        value: 'MA-01',
        label: 'MASSACHUSETTS - BOSTON'
      },
      {
        value: 'MA-02/RI-01',
        label: 'MASSACHUSETTS - WEST & RHODE ISLAND'
      },
      {
        value: 'MD-01',
        label: 'MARYLAND'
      },
      {
        value: 'ME/NH/VT-01',
        label: 'MAINE, NEW HAMPSHIRE & VERMONT'
      },
      {
        value: 'MI-01',
        label: 'MICHIGAN'
      },
      {
        value: 'MN-01',
        label: 'MINNESOTA'
      },
      {
        value: 'MO-02',
        label: 'MISSOURI - ST. LOUIS'
      },
      {
        value: 'NC-01',
        label: 'NORTH CAROLINA - RALEIGH/GREENSBORO'
      },
      {
        value: 'NC-02/SC-02',
        label: 'NORTH CAROLINA - CHARLOTTE'
      },
      {
        value: 'ND/SD-01',
        label: 'NORTH DAKOTA and SOUTH DAKOTA'
      },
      {
        value: 'NE-01',
        label: 'NEBRASKA'
      },
      {
        value: 'NJ-02',
        label: 'NEW JERSEY - NORTH'
      },
      {
        value: 'NM-01/TX-09',
        label: 'NEW MEXICO & EL PASO, TX'
      },
      {
        value: 'NV-01',
        label: 'NEVADA'
      },
      {
        value: 'NY-01',
        label: 'NEW YORK - Nassau & Suffolk County'
      },
      {
        value: 'NY-02',
        label: 'NEW YORK CITY - Manhattan West'
      },
      {
        value: 'NY-03',
        label: 'NEW YORK - Westchester'
      },
      {
        value: 'NY-04',
        label: 'NEW YORK - Northern'
      },
      {
        value: 'NY-05',
        label: 'NEW YORK CITY - Brooklyn & Queens'
      },
      {
        value: 'NY-06',
        label: 'NEW YORK CITY - Manhattan East'
      },
      {
        value: 'OH-01',
        label: 'OHIO - CINCINNATI & DAYTON'
      },
      {
        value: 'OH-02/WV-01',
        label: 'OHIO - COLUMBUS & TOLEDO'
      },
      {
        value: 'OH-03',
        label: 'OHIO - CLEVELAND'
      },
      {
        value: 'OK-01',
        label: 'OKLAHOMA'
      },
      {
        value: 'OR-01/WA-02',
        label: 'OREGON & CLARK COUNTY, WA'
      },
      {
        value: 'PA/NJ-01',
        label: 'PENNSYLVANIA & NEW JERSEY - SOUTH'
      },
      {
        value: 'PA-02',
        label: 'PENNSYLVANIA'
      },
      {
        value: 'PA-03',
        label: 'PENNSYLVANIA - CENTRAL'
      },
      {
        value: 'SC-01',
        label: 'SOUTH CAROLINA'
      },
      {
        value: 'TN-01/MS-01',
        label: 'TENNESSEE AND MISSISSIPPI'
      },
      {
        value: 'TX-01',
        label: 'TEXAS - AUSTIN'
      },
      {
        value: 'TX-02',
        label: 'TEXAS - HOUSTON'
      },
      {
        value: 'TX-03',
        label: 'TEXAS - DALLAS'
      },
      {
        value: 'TX-04',
        label: 'TEXAS - FORT WORTH'
      },
      {
        value: 'TX-05',
        label: 'TEXAS - SAN ANTONIO'
      },
      {
        value: 'TX-06',
        label: 'TEXAS - WEST'
      },
      {
        value: 'TX-07',
        label: 'TEXAS - CENTRAL'
      },
      {
        value: 'TX-08',
        label: 'TEXAS - SOUTH'
      },
      {
        value: 'UT-01',
        label: 'UTAH'
      },
      {
        value: 'VA-01',
        label: 'VIRGINIA - NORTHERN'
      },
      {
        value: 'VA-02',
        label: 'VIRGINIA - SOUTHERN '
      },
      {
        value: 'WA-01',
        label: 'WASHINGTON'
      },
      {
        value: 'WI-01',
        label: 'WISCONSIN'
      },
      {
        value: 'AUSMFA',
        label: 'Australia'
      },
      {
        value: 'CHLMFA',
        label: 'Chile'
      },
      {
        value: 'COL (UFG)',
        label: 'Colombia'
      },
      {
        value: 'DOM (UFG)',
        label: 'Dominican Republic'
      },
      {
        value: 'GBRMFA',
        label: 'United Kingdom'
      },
      {
        value: 'GCCMFA',
        label: 'GCC'
      },
      {
        value: 'GTM (UFG)',
        label: 'Guatemala'
      },
      {
        value: 'HKGMFA',
        label: 'Hong Kong'
      },
      {
        value: 'ISR (UFG)',
        label: 'Israel'
      },
      {
        value: 'MEX (UFG)',
        label: 'Mexico'
      },
      {
        value: 'NM-01/TX-09',
        label: 'NEW MEXICO & El Paso, TX'
      },
      {
        value: 'OTFC',
        label: 'Canada'
      },
      {
        value: 'OTFJ',
        label: 'Japan'
      },
      {
        value: 'PERMFA',
        label: 'Peru'
      },
      {
        value: 'SGP-01',
        label: 'SINGAPORE'
      },
      {
        value: 'SPAIN',
        label: 'Spain'
      }
    ],
    individualStudios: [
      { value: 'Amherst - The Boulevard', label: 'Amherst - The Boulevard #0001' },
      { value: 'Ahwatukee', label: 'Ahwatukee #0007' },
      { value: 'Wilmington', label: 'Wilmington #0007' }
    ],
    challengeType: [
      { value: 'Fitness Benchmark', label: 'Finess Benchmark' }
    ]
  },
  metricFieldSelect: {
    equipment: [
      { value: 'Treadmill', label: 'Treadmill' },
      { value: 'Row', label: 'Row' },
      { value: 'Striker', label: 'Striker' },
      { value: 'Biker', label: 'Biker' }
    ],
    type: [
      { value: 'Distance', label: 'Distance' },
      { value: 'Time', label: 'Time' },
      { value: 'Reps', label: 'Reps' }
    ]
  },
  initChallengeValue: {
    language: 'En',
    country: '',
    challengeType: 2,
    startDate: new Date(),
    endDate: new Date(),
    unitOfMeasurement: 1,
    numberOfRound: 1
  },
  reportTypes: [
    { value: 'Total_Member_Count', label: 'Total Member Count' },
    { value: 'Participating_Member_Count', label: 'Participating Member Count' },
    { value: 'Repeat_Usage', label: 'Repeat Usage' }
  ],
  typeParticipating: [
    { value: 'Treadmill 24 Min For Distance', label: 'Treadmill 24 Min For Distance' },
    { value: 'Treadmill 12 Min For Distance', label: 'Treadmill 12 Min For Distance' },
    { value: 'Treadmill 3 Miles For Time', label: 'Treadmill 3 Miles For Time' }
  ],
  addressReports: [
    { value: 'Amherst - The Boulevard / 1551 Niagra', label: 'Amherst - The Boulevard / 1551 Niagra' },
    { value: 'Ahwatukee', label: 'Ahwatukee #0007' },
    { value: 'Wilmington', label: 'Wilmington #0007' }
  ],
  corMembers: [
    {
      id: 1,
      username: 'Alice Doe',
      homeStudio: 'Albuquerque',
      visitedStudio: 'Gilbert - East, AZ #0292 / Hendersonville #0366'
    },
    {
      id: 2,
      username: 'Alexander Marolyn',
      homeStudio: 'Belmar CO #0535',
      visitedStudio: 'Gilbert - East, AZ #0292 / Hendersonville #0366'
    },
    {
      id: 3,
      username: 'Alice Doe',
      homeStudio: 'Albuquerque',
      visitedStudio: 'Gilbert - East, AZ #0292 / Hendersonville #0366'
    },
    {
      id: 4,
      username: 'Alice Doe',
      homeStudio: 'Albuquerque',
      visitedStudio: 'Gilbert - East, AZ #0292 / Hendersonville #0366'
    },
    {
      id: 5,
      username: 'Alice Doe',
      homeStudio: 'Albuquerque',
      visitedStudio: 'Gilbert - East, AZ #0292 / Hendersonville #0366'
    },
    {
      id: 6,
      username: 'Alice Doe',
      homeStudio: 'Albuquerque',
      visitedStudio: 'Gilbert - East, AZ #0292 / Hendersonville #0366'
    },
    {
      id: 7,
      username: 'Alice Doe',
      homeStudio: 'Albuquerque',
      visitedStudio: 'Gilbert - East, AZ #0292 / Hendersonville #0366'
    },
    {
      id: 8,
      username: 'Alice Doe',
      homeStudio: 'Albuquerque',
      visitedStudio: 'Gilbert - East, AZ #0292 / Hendersonville #0366'
    },
    {
      id: 9,
      username: 'Alice Doe',
      homeStudio: 'Albuquerque',
      visitedStudio: 'Gilbert - East, AZ #0292 / Hendersonville #0366'
    },
    {
      id: 10,
      username: 'Alice Doe',
      homeStudio: 'Albuquerque',
      visitedStudio: 'Gilbert - East, AZ #0292 / Hendersonville #0366'
    },
    {
      id: 11,
      username: 'Alice Doe',
      homeStudio: 'Albuquerque',
      visitedStudio: 'Gilbert - East, AZ #0292 / Hendersonville #0366'
    },
    {
      id: 12,
      username: 'Alice Doe',
      homeStudio: 'Albuquerque',
      visitedStudio: 'Gilbert - East, AZ #0292 / Hendersonville #0366'
    },
    {
      id: 13,
      username: 'Alice Doe',
      homeStudio: 'Albuquerque',
      visitedStudio: 'Gilbert - East, AZ #0292 / Hendersonville #0366'
    },
    {
      id: 14,
      username: 'Alice Doe',
      homeStudio: 'Albuquerque',
      visitedStudio: 'Gilbert - East, AZ #0292 / Hendersonville #0366'
    }
  ],
  corMemberPermission: [
    { studioName: '14th Street, Washington D.C.#0943 (HQ)' },
    { studioName: 'Alamo Ranch, TX #0676' },
    { studioName: 'Alamo, CA #0453' },
    { studioName: 'Albany NY #0385' },
    { studioName: 'Albuquerque - Westside, NM #0566' },
    { studioName: 'Albuquerque Far Northeast Heights, NM #0567' },
    { studioName: 'Albuquerque Midtown, NM #0569' },
    { studioName: 'Aldgate' },
    { studioName: 'Allen, TX #0205' },
    { studioName: 'Alliance, TX #0832' },
    { studioName: 'Alpharetta #0125' },
    { studioName: 'Altamonte Springs, FL #0167' },
    { studioName: 'Bmes, IA #0886' },
    { studioName: 'Amherst - The Boulevard, NY #0458' },
    { studioName: 'Amherst - Transit Road, NY #0069' },
    { studioName: 'Ancaster CA035' },
    { studioName: '14th Street, Washington D.C.#0943 (HQ)' },
    { studioName: '14th Street, Washington D.C.#0943 (HQ)' },
    { studioName: '14th Street, Washington D.C.#0943 (HQ)' }
  ],
  listPageSizeNumber: [15, 25, 30, 50],
  userPermission: [
    {
      UserName: 1,
      FullName: 'Alice Doe',
      Roles: ['STAFF_USER', 'STAFF_ADMIN']
    },
    {
      UserName: 13,
      FullName: 'Alexander Marolyn',
      Roles: ['STAFF_ADMIN']
    },
    {
      UserNames: 2,
      FullName: 'Anna Sophia',
      Roles: ['STAFF_USER']
    },
    {
      UserNames: 3,
      FullName: 'Bobby Dylan',
      Roles: ['STAFF_ADMIN']
    },
    {
      UserNames: 4,
      FullName: 'Ben Mathew',
      Roles: ['STAFF_USER']
    },
    {
      UserNames: 5,
      FullName: 'Benny Slovakin',
      Roles: ['STAFF_ADMIN']
    },
    {
      UserNames: 6,
      FullName: 'Chlea Popin',
      Roles: ['STAFF_USER']
    },
    {
      UserNames: 7,
      FullName: 'Casandra Dophin',
      Roles: ['STAFF_ADMIN']
    },
    {
      UserNames: 8,
      FullName: 'Dustin Dickson',
      Roles: ['STAFF_USER']
    },
    {
      UserNames: 12,
      FullName: 'Danniel Rex',
      Roles: ['STAFF_ADMIN']
    },
    {
      UserNames: 9,
      FullName: 'Danny Cuel',
      Roles: ['STAFF_USER']
    },
    {
      UserNames: 10,
      FullName: 'David Samuel',
      Roles: ['STAFF_ADMIN']
    },
    {
      UserNames: 11,
      FullName: 'Emily Doe',
      Roles: ['STAFF_USER']
    }
  ],
  userRepeatUsage: [
    {
      UserName: 1,
      FullName: 'Alice Doe',
      NumberOfTimes: 3
    },
    {
      UserName: 13,
      FullName: 'Alexander Marolyn',
      NumberOfTimes: 5
    },
    {
      UserNames: 2,
      FullName: 'Anna Sophia',
      NumberOfTimes: 12
    },
    {
      UserNames: 3,
      FullName: 'Bobby Dylan',
      NumberOfTimes: 7
    },
    {
      UserNames: 4,
      FullName: 'Ben Mathew',
      NumberOfTimes: 10
    },
    {
      UserNames: 5,
      FullName: 'Benny Slovakin',
      NumberOfTimes: 2
    },
    {
      UserNames: 6,
      FullName: 'Chlea Popin',
      NumberOfTimes: 18
    },
    {
      UserNames: 7,
      FullName: 'Casandra Dophin',
      NumberOfTimes: 5
    },
    {
      UserNames: 8,
      FullName: 'Dustin Dickson',
      NumberOfTimes: 3
    },
    {
      UserNames: 12,
      FullName: 'Danniel Rex',
      NumberOfTimes: 3
    },
    {
      UserNames: 9,
      FullName: 'Danny Cuel',
      NumberOfTimes: 2
    },
    {
      UserNames: 10,
      FullName: 'David Samuel',
      NumberOfTimes: 9
    },
    {
      UserNames: 11,
      FullName: 'Emily Doe',
      NumberOfTimes: 7
    }
  ],
  studioNotifications: [
    {
      UserName: 'OTF STAFF',
      ImageUrl: 'icon_female.svg',
      Message: 'Tuesday and Thursday\'s workouts will include a 2000 Meter Row for time',
      DateCreated: (new Date()).setMinutes((new Date()).getMinutes() - 6),
      isRead: false
    },
    {
      UserName: 'OTF STAFF',
      ImageUrl: 'icon_male.svg',
      Message: 'In studio Dri-Tri this upcoming Saturday October 28, 2017, please remind members!',
      DateCreated: (new Date()).setHours((new Date()).getHours() - 12),
      isRead: true
    },
    {
      UserName: 'OTF STAFF',
      ImageUrl: 'icon_female.svg',
      Message: 'Congrats on your 1-year studio anniversary!',
      DateCreated: (new Date()).setDate((new Date()).getDate() - 2),
      isRead: true
    }
  ]
};

module.exports = AppConstants;

/**
 * Define list of menu item for profile dropdown menu on Header component
 */
export const MenuItems = [
  {
    name: 'Settings',
    i18nKey: 'Menu.Studio.Settings',
    key: 'settings',
    className: 'settings',
    childMenus: [
      {
        name: 'Languages',
        i18nKey: 'Menu.Studio.Setting.Languages',
        key: 'languages',
        to: '/studio/settings/languages'
      }
    ]
  },
  // {
  //   name: 'Measurement Unit',
  //   i18nKey: 'Menu.Studio.Setting.Units',
  //   key: 'measurement-unit',
  //   className: 'settings',
  //   childMenus: [
  //     {
  //       name: 'Weight Floor',
  //       i18nKey: 'Equipment.WF.Title',
  //       key: 'weight-floor',
  //       renderFunc: 'renderMeasurements'
  //     },
  //     {
  //       name: 'Treadmill',
  //       i18nKey: 'Menu.Studio.Setting.DistanceUnits',
  //       key: 'treadmill',
  //       renderFunc: 'renderDistanceMeasurements'
  //     }
  //   ]
  // },
  {
    name: 'Logout',
    i18nKey: 'Menu.Studio.Logout',
    key: 'logout',
    funcName: 'logout',
    className: 'log-out'
  }
];

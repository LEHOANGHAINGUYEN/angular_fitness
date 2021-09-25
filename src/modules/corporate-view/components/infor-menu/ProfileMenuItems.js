/**
 * Define list of menu item for profile dropdown menu on Header component
 */
export const ProfileMenuItems = [
  {
    name: 'My Account',
    to: '/corporate/profiles',
    className: 'my-account'
  },
  {
    name: 'Permission',
    to: '/corporate/permission',
    className: 'permission'
  },
  {
    name: 'Settings',
    to: '/corporate/settings',
    className: 'settings'
  },
  {
    name: 'Logout',
    funcName: 'logout',
    className: 'log-out'
  }
];

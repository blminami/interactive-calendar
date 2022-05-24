export const config = {
  appId: '3895f47b-7727-4284-806b-624a9fca3145',
  redirectUri: 'http://localhost:3000',
  scopes: ['user.read', 'mailboxsettings.read', 'calendars.readwrite']
};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'fds-sidenav': any;
      'fds-app-bar': any;
      'mwc-icon-button': any;
      'fds-user-profile': any;
      'fds-button': any;
      'mwc-list': any;
      'mwc-list-item': any;
      'fds-logo': any;
      'mwc-icon': any;
      'fds-switch': any;
      'mwc-formfield': any;
    }
  }
}

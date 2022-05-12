import React from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { NavItem } from 'reactstrap';
import './NavBar.scss';
import '@finastra/sidenav';
import '@finastra/app-bar';
import '@finastra/avatar';
import '@finastra/user-profile';
import '@finastra/button';
import '@finastra/brand-card';
import '@finastra/launchpad';
import '@material/mwc-drawer';

interface NavBarProps {
  isAuthenticated: boolean;
  authButtonMethod: any;
  user: any;
}

const UserAvatar = (props: any) => {
  return props.isAuthenticated ? (
    <fds-user-profile slot='actions' username='Narcisa Minca'>
      <div slot='userInfo'>narcisa.minca@finastra.com</div>
      <div slot='actions'>
        <fds-button fullwidth='' label='Logout' icon='logout'></fds-button>
        <fds-button text='' fullwidth='' label='View profile'></fds-button>
      </div>
    </fds-user-profile>
  ) : null;
};

const AuthMwcListItem = (prop: any) => {
  return prop.isAuthenticated ? (
    <mwc-list-item graphic='icon'>
      <span>Calendar</span>
      <mwc-icon slot='graphic'>calendar</mwc-icon>
    </mwc-list-item>
  ) : null;
};

const NavbarActions = (prop: any) => {
  if (prop.isAuthenticated) {
    return (
      <fds-button label='Logout' icon='logout' slot='actions'></fds-button>
    );
  } else {
    return <fds-button label='Sign in' slot='actions'></fds-button>;
  }
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
    }
  }
}

export default class NavBar extends React.Component<NavBarProps> {
  constructor(props: NavBarProps) {
    super(props);
  }

  render(): JSX.Element {
    let calendarLink = null;
    if (this.props.isAuthenticated) {
      calendarLink = (
        <NavItem>
          <RouterNavLink to='/calendar' className='nav-link' exact>
            Calendar
          </RouterNavLink>
        </NavItem>
      );
    }

    return (
      <fds-sidenav type='modal'>
        <div slot='sidenavContent'>
          <div className='fds-sidenav-header'>
            <fds-logo></fds-logo>
          </div>
          <div className='fds-sidenav-list'>
            <mwc-list activatable=''>
              <mwc-list-item selected='' activated='' graphic='icon'>
                <span>Home</span>
                <mwc-icon slot='graphic'>home</mwc-icon>
              </mwc-list-item>
              <AuthMwcListItem isAuthenticated={this.props.isAuthenticated} />
            </mwc-list>
          </div>
        </div>
        <div slot='appContent'>
          <fds-app-bar logoredirecturi=''>
            <mwc-icon-button
              icon='menu'
              slot='navigationIcon'
            ></mwc-icon-button>
            <UserAvatar isAuthenticated={this.props.isAuthenticated} />
            <NavbarActions isAuthenticated={this.props.isAuthenticated} />
          </fds-app-bar>
        </div>
      </fds-sidenav>
    );
  }
}

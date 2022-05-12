import React from 'react';
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

const NavbarActions = (props: any) => {
  if (props.isAuthenticated) {
    return (
      <fds-button
        label='Logout'
        slot='actions'
        onClick={props.handleUserAction}
      ></fds-button>
    );
  } else {
    return (
      <fds-button
        label='Sign in'
        slot='actions'
        onClick={props.handleUserAction}
      ></fds-button>
    );
  }
};

export default class NavBar extends React.Component<NavBarProps> {
  constructor(props: NavBarProps) {
    super(props);
  }

  handleLogout() {
    console.log('ajunge in logOut');
  }

  handleSignIn() {
    console.log('ajunge in login');
  }

  render(): JSX.Element {
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
            <NavbarActions
              isAuthenticated={this.props.isAuthenticated}
              handleUserAction={this.props.authButtonMethod}
            />
          </fds-app-bar>
        </div>
      </fds-sidenav>
    );
  }
}

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
  authAction: any;
  user: any;
}

const UserAvatar = (props: any) => {
  console.log('User props:', props.user);
  return props.isAuthenticated ? (
    <fds-user-profile slot='actions' username={props.user.displayName}>
      <div slot='userInfo'>{props.user.email}</div>
      <div slot='actions'>
        <fds-button fullwidth='' label='Logout'></fds-button>
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
        onClick={props.handleAuthAction}
      ></fds-button>
    );
  } else {
    return (
      <fds-button
        label='Sign in'
        slot='actions'
        onClick={props.handleAuthAction}
      ></fds-button>
    );
  }
};

export default class NavBar extends React.Component<NavBarProps> {
  constructor(props: NavBarProps) {
    super(props);
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
            <UserAvatar
              isAuthenticated={this.props.isAuthenticated}
              user={this.props.user}
            />
            <NavbarActions
              isAuthenticated={this.props.isAuthenticated}
              handleAuthAction={this.props.authAction}
            />
          </fds-app-bar>
        </div>
      </fds-sidenav>
    );
  }
}
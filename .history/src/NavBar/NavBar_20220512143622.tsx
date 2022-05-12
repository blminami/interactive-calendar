import React from 'react';
import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom';
import Calendar from '../calendar/Calendar';
import Home from '../home/Home';

import './NavBar.scss';
import '@finastra/sidenav';
import '@finastra/app-bar';
import '@finastra/avatar';
import '@finastra/user-profile';
import '@finastra/button';
import '@material/mwc-drawer';

interface NavBarProps {
  isAuthenticated: boolean;
  authAction: any;
  user: any;
}

const UserAvatar = (props: any) => {
  return props.isAuthenticated ? (
    <fds-user-profile slot='actions' username={props.user.displayName}>
      <div slot='userInfo'>{props.user.email}</div>
      <div slot='actions'>
        <fds-button fullwidth='' label='Logout'></fds-button>
      </div>
    </fds-user-profile>
  ) : null;
};

const AuthMwcListItem = (props: any) => {
  return props.isAuthenticated ? (
    <mwc-list-item graphic='icon' action={props.navigateTo('calendar')}>
      <span>Calendar</span>
      <mwc-icon slot='graphic'>event</mwc-icon>
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
    this.navigateTo = this.navigateTo.bind(this);
  }

  navigateTo(path: string) {
    console.log('path: ', path);
  }

  render(): JSX.Element {
    return (
      <Router>
        <fds-sidenav type='modal'>
          <div slot='sidenavContent'>
            <div className='fds-sidenav-header'>
              <fds-logo></fds-logo>
            </div>
            <div className='fds-sidenav-list'>
              <mwc-list activatable=''>
                <mwc-list-item
                  selected=''
                  activated=''
                  graphic='icon'
                  onClick={() => this.navigateTo('home')}
                >
                  <span>Home</span>
                  <mwc-icon slot='graphic'>home</mwc-icon>
                </mwc-list-item>
                <AuthMwcListItem
                  isAuthenticated={this.props.isAuthenticated}
                  navigateTo={this.navigateTo}
                />
              </mwc-list>
            </div>
          </div>
          <div slot='appContent'>
            <fds-app-bar logoredirecturi=''>
              <mwc-icon-button
                icon='menu'
                slot='navigationIcon'
              ></mwc-icon-button>
              <mwc-icon-button
                icon='event'
                slot='actions'
                onClick={() => this.navigateTo('calendar')}
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
            <div className='main-content'>
              <Route
                exact
                path='/'
                render={() => (
                  <Home
                    isAuthenticated={this.props.isAuthenticated}
                    user={this.props.user}
                  />
                )}
              />
              <Route
                exact
                path='/calendar'
                render={(props) =>
                  this.props.isAuthenticated ? (
                    <Calendar {...props} />
                  ) : (
                    <Redirect to='/' />
                  )
                }
              />
            </div>
          </div>
        </fds-sidenav>
      </Router>
    );
  }
}
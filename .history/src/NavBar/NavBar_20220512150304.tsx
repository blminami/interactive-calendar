import React from 'react';
import { BrowserRouter as Router, Route, useHistory } from 'react-router-dom';
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
    <mwc-list-item graphic='icon' onClick={() => props.navigateTo('calendar')}>
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

const NavigationItem = (props: any) => {
  const history = useHistory();
  const handleClick = (path: string) => history.push(path);

  if (props.type === 'button') {
    return (
      <mwc-icon-button
        icon='event'
        slot='actions'
        onClick={() => handleClick(props.path)}
      ></mwc-icon-button>
    );
  } else if (props.type === 'list-item') {
    return props.isAuthenticated ? (
      <mwc-list-item graphic='icon' onClick={() => handleClick(props.path)}>
        <span>{props.label}</span>
        <mwc-icon slot='graphic'>{props.icon}</mwc-icon>
      </mwc-list-item>
    ) : null;
  } else return null;
};

export default class NavBar extends React.Component<NavBarProps> {
  constructor(props: NavBarProps) {
    super(props);
  }

  render(): JSX.Element {
    return (
      <Router>
        <fds-sidenav type='none'>
          <div slot='appContent'>
            <fds-app-bar logoredirecturi=''>
              <mwc-icon-button
                icon='menu'
                slot='navigationIcon'
              ></mwc-icon-button>
              <NavigationItem type='button' path='/calendar' />
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
                render={(props) => <Calendar {...props} />}
              />
            </div>
          </div>
        </fds-sidenav>
      </Router>
    );
  }
}

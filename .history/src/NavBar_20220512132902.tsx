import React from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import {
  Button,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
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

interface NavBarState {
  isOpen: boolean;
}

function UserAvatar(props: any) {
  if (props.user.avatar) {
    return (
      <img
        src={props.user.avatar}
        alt='user'
        className='rounded-circle align-self-center mr-2'
        style={{ width: '32px' }}
      ></img>
    );
  }

  return (
    <i
      className='far fa-user-circle fa-lg rounded-circle align-self-center mr-2'
      style={{ width: '32px' }}
    ></i>
  );
}

function AuthNavItem(props: NavBarProps) {
  // If authenticated, return a dropdown with the user's info and a
  // sign out button
  if (props.isAuthenticated) {
    return (
      <UncontrolledDropdown>
        <DropdownToggle nav caret>
          <UserAvatar user={props.user} />
        </DropdownToggle>
        <DropdownMenu right>
          <h5 className='dropdown-item-text mb-0'>{props.user.displayName}</h5>
          <p className='dropdown-item-text text-muted mb-0'>
            {props.user.email}
          </p>
          <DropdownItem divider />
          <DropdownItem onClick={props.authButtonMethod}>Sign Out</DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    );
  }

  // Not authenticated, return a sign in link
  return (
    <NavItem>
      <Button
        onClick={props.authButtonMethod}
        className='btn-link nav-link border-0'
        color='link'
      >
        Sign In
      </Button>
    </NavItem>
  );
}

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

export default class NavBar extends React.Component<NavBarProps, NavBarState> {
  constructor(props: NavBarProps) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render(): JSX.Element {
    // Only show calendar nav item if logged in
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
              this.props.isAuthenticated ?
              <mwc-list-item graphic='icon'>
                <span>Calendar</span>
                <mwc-icon slot='graphic'>calendar</mwc-icon>
              </mwc-list-item>
              : ''
            </mwc-list>
          </div>
        </div>
        <div slot='appContent'>
          <fds-app-bar logoredirecturi=''>
            <mwc-icon-button
              icon='menu'
              slot='navigationIcon'
            ></mwc-icon-button>

            <fds-user-profile slot='actions' username='Narcisa Minca'>
              <div slot='userInfo'>narcisa.minca@finastra.com</div>
              <div slot='actions'>
                <fds-button
                  fullwidth=''
                  label='Logout'
                  icon='logout'
                ></fds-button>
                <fds-button
                  text=''
                  fullwidth=''
                  label='View profile'
                ></fds-button>
              </div>
            </fds-user-profile>
            <fds-button
              label='Logout'
              icon='logout'
              slot='actions'
            ></fds-button>
          </fds-app-bar>
        </div>
      </fds-sidenav>
    );
  }
}
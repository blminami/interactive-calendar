import React, { DOMAttributes } from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import {
  Button,
  Collapse,
  Container,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
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
import '@material/mwc-drawer';
import '@material/mwc-icon-button';

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
        <div slot='appContent'>
          <fds-app-bar appname='Calendar' logoredirecturi=''>
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
            <mwc-icon-button icon='more_vert' slot='actions'></mwc-icon-button>
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

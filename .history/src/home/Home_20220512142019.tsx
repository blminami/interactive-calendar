import React from 'react';

interface HomeProps {
  isAuthenticated: boolean;
  authButtonMethod: any;
  user: any;
}

export default class Home extends React.Component<HomeProps> {
  render() {
    if (this.props.isAuthenticated) {
      return (
        <div>
          <h4>Welcome {this.props.user.displayName}!</h4>
          <p>Use the navigation bar at the top of the page to get started.</p>
        </div>
      );
    }
    return (
      <div>
        <p>
          This sample app shows how to use the Microsoft Graph API to access
          Outlook and OneDrive data from React. Sign In for accessing your
          calendar's events.
        </p>
      </div>
    );
  }
}
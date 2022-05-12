import React from 'react';
import { Button, Jumbotron } from 'reactstrap';

interface WelcomeProps {
  isAuthenticated: boolean;
  authButtonMethod: any;
  user: any;
}

function WelcomeContent(props: WelcomeProps) {
  if (props.isAuthenticated) {
    return (
      <div>
        <h4>Welcome {props.user.displayName}!</h4>
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

export default class Welcome extends React.Component<WelcomeProps> {
  render() {
    return (
      <WelcomeContent
        isAuthenticated={this.props.isAuthenticated}
        user={this.props.user}
        authButtonMethod={this.props.authButtonMethod}
      />
    );
  }
}

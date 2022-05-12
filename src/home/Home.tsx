import React from 'react';

interface HomeProps {
  isAuthenticated: boolean;
  user: any;
}

export default class Home extends React.Component<HomeProps> {
  constructor(props: HomeProps) {
    super(props);
  }

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
        <p>Sign In for accessing your calendar's events.</p>
      </div>
    );
  }
}

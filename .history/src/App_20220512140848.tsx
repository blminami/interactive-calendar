import { Component } from 'react';
import withAuthProvider, { AuthComponentProps } from './AuthProvider';
import NavBar from './NavBar';

class App extends Component<AuthComponentProps> {
  render() {
    return (
      <NavBar
        isAuthenticated={this.props.isAuthenticated}
        authAction={
          this.props.isAuthenticated ? this.props.logout : this.props.login
        }
        user={this.props.user}
      />
    );
  }
}

export default withAuthProvider(App);

import { Component } from 'react';
import withAuthProvider, { AuthComponentProps } from './services/AuthProvider';
import NavBar from './navbar/NavBar';

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

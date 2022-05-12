import { Component } from 'react';
import withAuthProvider, { AuthComponentProps } from './AuthProvider';
import NavBar from './NavBar';
import ErrorMessage from './ErrorMessage';
import './App.scss';

class App extends Component<AuthComponentProps> {
  render() {
    let error = null;
    if (this.props.error) {
      error = (
        <ErrorMessage
          message={this.props.error.message}
          debug={this.props.error.debug}
        />
      );
    }

    return (
      <NavBar
        isAuthenticated={this.props.isAuthenticated}
        authButtonMethod={
          this.props.isAuthenticated ? this.props.logout : this.props.login
        }
        user={this.props.user}
      />
    );
  }
}

export default withAuthProvider(App);

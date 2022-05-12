import { Component } from 'react';
import withAuthProvider, { AuthComponentProps } from './AuthProvider';
import NavBar from './NavBar';
import ErrorMessage from './ErrorMessage';
import './App.scss';

class App extends Component<AuthComponentProps> {
  render() {
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

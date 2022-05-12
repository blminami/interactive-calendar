import { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { Container } from 'reactstrap';
import withAuthProvider, { AuthComponentProps } from './AuthProvider';
import NavBar from './NavBar';
import ErrorMessage from './ErrorMessage';
import Welcome from './Welcome';
import Calendar from './Calendar';
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
      <Router>
        <NavBar
          isAuthenticated={this.props.isAuthenticated}
          authButtonMethod={
            this.props.isAuthenticated ? this.props.logout : this.props.login
          }
          user={this.props.user}
        />
      </Router>
    );
  }
}

export default withAuthProvider(App);

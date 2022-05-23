import React from 'react';
import withAuthProvider, { AuthComponentProps } from '../services/AuthProvider';
import './Events.scss';

class Events extends React.Component<AuthComponentProps> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <div className='events-form-container fds-subtitle-2'>
        Calendar ({this.props.user.email})
        <div className='input-form'>
          <mwc-icon-button icon='edit'></mwc-icon-button>
          <input className='input-field' placeholder='New event'></input>
        </div>
        <div className='input-form'>
          <mwc-icon-button icon='person_add'></mwc-icon-button>
          <input className='input-field' placeholder='Add people'></input>
        </div>
        <div className='input-form'>
          <mwc-icon-button icon='location_on'></mwc-icon-button>
          <input className='input-field' placeholder='Location'></input>
        </div>
        <div className='input-form'>
          <mwc-icon-button icon='notifications_none'></mwc-icon-button>
          <input
            className='input-field'
            placeholder='15 minutes before'
          ></input>
        </div>
        <div className='input-form'>
          <mwc-icon-button icon='subject'></mwc-icon-button>
          <textarea
            rows={7}
            className='input-field notes'
            placeholder='Add notes'
          ></textarea>
        </div>
        <div className='form-actions'>
          <fds-button label='Discard' outlined secondary></fds-button>
          <fds-button label='Save' secondary></fds-button>
        </div>
      </div>
    );
  }
}

export default withAuthProvider(Events);

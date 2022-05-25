import { Event } from 'microsoft-graph';
import React from 'react';
import './EventsTimeline.scss';
import '@finastra/switch';
import '@material/mwc-formfield';

interface EventsTimelineProps {
  // events: Event[];
  navigateToEvents: any;
}

export default class EventsTimeline extends React.Component<EventsTimelineProps> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <div className='events-timeline-container fds-subtitle-2'>
        <mwc-icon-button
          icon='chevron_right'
          onClick={this.props.navigateToEvents}
        ></mwc-icon-button>
        Here's the timeline for the events :) TBD
      </div>
    );
  }
}

import React from 'react';
import {Text} from "native-base";
const timer = require('react-native-timer');


import moment from 'moment/min/moment-with-locales';

export default class TimeAgo extends React.Component {

  props: {
    time: string,
    interval?: number,
    hideAgo?: boolean,
    name: string,
  };

  state: { timer: null | number } = {timer: null};

  static defaultProps = {
    hideAgo: false,
    interval: 60000
  };

  constructor(props) {
    super(props);
    timer.setInterval(this, this.props.name, this.update, this.props.interval);
  }

  async componentWillMount() {
    let locale = await Expo.Util.getCurrentLocaleAsync();
    moment.locale(locale);
  }

  componentWillUnmount() {
    if(timer.intervalExists(this, this.props.name)) {
      timer.clearInterval(this, this.props.name);
    }
  }

  update = () => {
    this.forceUpdate();
  };

  render() {
    const {time, hideAgo} = this.props;
    return (
      <Text {...this.props}>
        {moment(time).fromNow(hideAgo)}
      </Text>
    );
  }
}

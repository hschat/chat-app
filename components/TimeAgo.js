import React from 'react';
import {Text} from "native-base";

import moment from 'moment/min/moment-with-locales';

export default class TimeAgo extends React.Component {

  props: {
    time: string,
    interval?: number,
    hideAgo?: boolean
  };

  state: { timer: null | number } = {timer: null};

  static defaultProps = {
    hideAgo: false,
    interval: 60000
  };

  constructor(props) {
    super(props);
    this.state = {text: ''};

  }

  async componentWillMount() {
    let locale = await Expo.Util.getCurrentLocaleAsync();
    moment.locale(locale);
  }

  componentDidMount() {
    this.createRenderTimer();
  }

  componentWillUnmount() {
    clearTimeout(this.state.timer);
  }

  createRenderTimer = () => {
    this.setState({
      timer: setTimeout(() => {
        this.update();
      }, this.props.interval)
    });
  };

  update = () => {
    this.forceUpdate();
    this.createRenderTimer();
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

import React, { Component } from 'react';
import {
  StyleSheet, Image, Alert, Dimensions, TouchableOpacity, Text,
} from 'react-native';
import i18n from '../translation/i18n';

const styles = StyleSheet.create({});

UNITS = {
  cm: {
    short: i18n.t('Distance-cmShort'),
    long: i18n.t('Distance-cmShort'),
  },
  m: {
    short: i18n.t('Distance-mShort'),
    long: i18n.t('Distance-mLong'),
  },
  km: {
    short: i18n.t('Distance-kmShort'),
    long: i18n.t('Distance-kmLong'),
  },
};

export default class Distance extends Component {
  constructor(props) {
    super(props);
    this.unit = UNITS.m;
    this.distance = this.props.distance;
  }

  componentWillMount() {
    if (this.distance > 1000) {
      this.unit = UNITS.km;
      this.distance = this.distance / 1000;
    }
    if (this.distance < 1) {
      this.unit = UNITS.cm;
      this.distance = this.distance * 100;
    }
  }

  render() {
    const d = Math.round(this.distance);

    return (
      <Text>
        {d}
        {' '}
        {this.props.long ? this.unit.long : this.unit.short}
      </Text>
    );
  }
}

import React from 'react';
import i18n from '../../translation/i18n';

export default class SearchScreen extends React.Component {
  render() {
    return (
      <Text>{i18n.t('InviteScreen-Invite')}</Text>
    );
  }
}

/*
 * AddMeetingSchedule Messages
 *
 * This contains all the text for the AddMeetingSchedule container.
 */

import { defineMessages } from 'react-intl';
import { getDataI18N } from '../../utils/common';
const data = require('../../translations/vi/AddCustomerPage.json');
export const scope1 = 'crm.AddCustomerPage';
export const scope = 'app.containers.AddMeetingSchedule';

export default defineMessages(getDataI18N(scope1, data),{
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the AddMeetingSchedule container!',
  },
});

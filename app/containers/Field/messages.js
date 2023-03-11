/*
 * AddKpiConfig Messages
 *
 * This contains all the text for the AddKpiConfig container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.AddKpiConfig';
import { getDataI18N } from '../../utils/common';
const data = require('../../translations/vi/AddCustomerPage.json');
export const scope1 = 'crm.AddCustomerPage';
export default defineMessages(getDataI18N(scope1, data),{
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the AddKpiConfig container!',
  },
});

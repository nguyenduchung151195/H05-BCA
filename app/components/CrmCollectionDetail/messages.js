/*
 * CrmCollectionDetail Messages
 *
 * This contains all the text for the CrmCollectionDetail component.
 */

import { defineMessages } from 'react-intl';
import { getDataI18N } from '../../utils/common';
export const scope1 = 'app.containers.AddContract';
const data = require('../../translations/vi/AddContract.json');

export const scope = 'app.components.CrmCollectionDetail';

export default defineMessages(getDataI18N(scope1, data),{
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the CrmCollectionDetail component!',
  },
});

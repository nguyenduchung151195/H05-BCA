/*
 * Location Messages
 *
 * This contains all the text for the Location container.
 */

import { defineMessages } from 'react-intl';
import { getDataI18N } from '../../utils/common';
const data = require('../../translations/vi/Location.json');
export const scope = 'crm.Location';

export default defineMessages(getDataI18N(scope, data));

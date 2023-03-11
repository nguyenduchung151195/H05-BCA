/*
 * Tax Messages
 *
 * This contains all the text for the Tax container.
 */

import { defineMessages } from 'react-intl';
import { getDataI18N } from '../../utils/common';
const data = require('../../translations/vi/Tax.json');
export const scope = 'crm.Tax';

export default defineMessages(getDataI18N(scope, data));

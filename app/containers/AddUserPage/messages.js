/*
 * AddUserPage Messages
 *
 * This contains all the text for the AddUserPage container.
 */

import { defineMessages } from 'react-intl';
import { getDataI18N } from '../../utils/common';
const data = require('../../translations/vi/AddUserPage.json');
export const scope = 'setting.Employee';

export default defineMessages(getDataI18N(scope, data));

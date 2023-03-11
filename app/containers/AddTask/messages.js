/*
 * AddTask Messages
 *
 * This contains all the text for the AddTask container.
 */

import { defineMessages } from 'react-intl';
import { getDataI18N } from '../../utils/common';
const data = require('../../translations/vi/AddTask.json');
export const scope = 'task.AddTask';

export default defineMessages(getDataI18N(scope, data));

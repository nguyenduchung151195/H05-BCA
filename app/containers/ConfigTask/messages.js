/*
 * ConfigTask Messages
 *
 * This contains all the text for the ConfigTask container.
 */

import { defineMessages } from 'react-intl';
import { getDataI18N } from '../../utils/common';
const data = require('../../translations/vi/ConfigTask.json');
export const scope = 'task.ConfigTask';

export default defineMessages(getDataI18N(scope, data));

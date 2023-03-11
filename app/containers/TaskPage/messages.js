/*
 * TaskPage Messages
 *
 * This contains all the text for the TaskPage container.
 */

import { defineMessages } from 'react-intl';
import { getDataI18N } from '../../utils/common';
const data = require('../../translations/vi/TaskPage.json');
export const scope = 'task.TaskPage';

export default defineMessages(getDataI18N(scope, data));

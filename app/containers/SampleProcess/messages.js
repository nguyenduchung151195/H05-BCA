/*
 * SampleProcess Messages
 *
 * This contains all the text for the SampleProcess container.
 */

import { defineMessages } from 'react-intl';
import { getDataI18N } from '../../utils/common';
const data = require('../../translations/vi/SampleProcess.json');
export const scope = 'task.SampleProcess';

export default defineMessages(getDataI18N(scope, data));

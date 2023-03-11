/*
 * ProjectDetail Messages
 *
 * This contains all the text for the ProjectDetail container.
 */

import { defineMessages } from 'react-intl';
import { getDataI18N } from '../../utils/common';

export const scope = 'task.ProjectDetail';
const data = require('../../translations/vi/ProjectDetail.json');

export default defineMessages(getDataI18N(scope, data));

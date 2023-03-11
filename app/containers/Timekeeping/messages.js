/*
 * MeetingPage Messages
 *
 * This contains all the text for the MeetingPage container.
 */
import { defineMessages } from 'react-intl';
import { getDataI18N } from '../../utils/common';
const data = require('../../translations/vi/Calendar.json');
export const scope = 'app.container.Calendar';

export default defineMessages(getDataI18N(scope, data));

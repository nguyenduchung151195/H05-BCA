/*
 * TaxVat Messages
 *
 * This contains all the text for the TaxVat container.
 */

import { defineMessages } from 'react-intl';
import { getDataI18N } from '../../utils/common';
const data = require('../../translations/vi/TaxVat.json');
export const scope = 'crm.TaxVat';

export default defineMessages(getDataI18N(scope, data));

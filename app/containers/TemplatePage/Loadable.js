/**
 *
 * Asynchronously loads the component for TemplatePage
 *
 */

import loadable from 'loadable-components';

export default loadable(() => import('./index'));

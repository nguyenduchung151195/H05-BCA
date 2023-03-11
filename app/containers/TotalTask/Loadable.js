/**
 *
 * Asynchronously loads the component for TotalTask
 *
 */

import loadable from 'loadable-components';

export default loadable(() => import('./index'));

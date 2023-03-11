/**
 *
 * Asynchronously loads the component for AddTask
 *
 */

import loadable from 'loadable-components';

export default loadable(() => import('./index'));

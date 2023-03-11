/**
 *
 * Asynchronously loads the component for Planner
 *
 */

import loadable from 'loadable-components';

export default loadable(() => import('./index'));

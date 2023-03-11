/**
 *
 * Asynchronously loads the component for Drive
 *
 */

import loadable from 'loadable-components';

export default loadable(() => import('./index'));

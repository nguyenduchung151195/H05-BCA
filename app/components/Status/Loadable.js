/**
 *
 * Asynchronously loads the component for Source
 *
 */

import loadable from 'loadable-components';

export default loadable(() => import('./index'));

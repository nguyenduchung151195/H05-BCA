/**
 *
 * Asynchronously loads the component for FileManager
 *
 */

import loadable from 'loadable-components';

export default loadable(() => import('./index'));

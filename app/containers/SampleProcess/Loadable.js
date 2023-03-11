/**
 *
 * Asynchronously loads the component for SampleProcess
 *
 */

import loadable from 'loadable-components';

export default loadable(() => import('./index'));

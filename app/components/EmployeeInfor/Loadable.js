/**
 *
 * Asynchronously loads the component for EmployeeDetail
 *
 */

import loadable from 'loadable-components';

export default loadable(() => import('./index'));

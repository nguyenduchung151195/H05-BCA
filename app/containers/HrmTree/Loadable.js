/**
 *
 * Asynchronously loads the component for KanbanPlugin
 *
 */

import loadable from 'loadable-components';

export default loadable(() => import('./index'));

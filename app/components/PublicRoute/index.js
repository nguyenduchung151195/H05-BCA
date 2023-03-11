/**
 *
 * PublicRoute
 *
 */

import React from 'react';
import { Route } from 'react-router-dom';

const PublicRoute = ({ component: Component, layout: Layout, ...rest }) => (
  <Route
    {...rest}
    render={({ match, history }) => (
      <Layout>
        <Component match={match} history={history} />{' '}
      </Layout>
    )}
  />
);

export default PublicRoute;

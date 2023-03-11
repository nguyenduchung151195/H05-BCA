import React from 'react';
import BreadcrumbsUi from '@material-ui/lab/Breadcrumbs';
import { Link } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import Paper from './Paper';

export default function Breadcrumbs({ links, title }) {
  return (
    <Paper className="headerBreadcrumb" style={{ marginBottom: 20 }}>
      <BreadcrumbsUi aria-label="Breadcrumb">
        {links.map(item => (
          <Link style={{ color: '#0795db', textDecoration: 'none' }} to={item.to}>
            {item.title}
          </Link>
        ))}
        <Typography color="textPrimary">{title}</Typography>
      </BreadcrumbsUi>
    </Paper>
  );
}

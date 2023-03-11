import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

export default function CustomExpand({ children, getState }) {
  const [expand, setExpand] = React.useState(false);
  const handleClick = () => {
    setExpand(!expand);
  };
  React.useEffect(
    () => {
      getState(expand);
    },
    [expand],
  );

  return (
    <>
      <Button onClick={handleClick} color="primary" style={{ width: '100%', padding: 10, color: 'inherit', textTransform: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          {expand && <ExpandLessIcon />}
          {!expand && <ExpandMoreIcon />}
          <div style={{ marginLeft: 5 }} />
          {children}
        </div>
      </Button>
    </>
  );
}

CustomExpand.defaultProps = {
  getState: () => {},
};

CustomExpand.propTypes = {
  getState: PropTypes.func,
  children: PropTypes.node,
};

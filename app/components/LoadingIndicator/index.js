import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';

// import Circle from './Circle';
// import Wrapper from './Wrapper';
// import logo from '../../images/logo.png';
const LoadingIndicator = () => (
  <div
    style={{
      width: '100%',
      // height:10,
      // height: '100%',
      position: 'fixed',
      left: 0,
      top: 0,
      // backgroundColor: 'rgba(138, 138, 138, 0.3)',
      zIndex: 10000,
    }}
  >
    {/* <Wrapper>
      <Circle />
      <Circle rotate={30} delay={-1.1} />
      <Circle rotate={60} delay={-1} />
      <Circle rotate={90} delay={-0.9} />
      <Circle rotate={120} delay={-0.8} />
      <Circle rotate={150} delay={-0.7} />
      <Circle rotate={180} delay={-0.6} />
      <Circle rotate={210} delay={-0.5} />
      <Circle rotate={240} delay={-0.4} />
      <Circle rotate={270} delay={-0.3} />
      <Circle rotate={300} delay={-0.2} />
      <Circle rotate={330} delay={-0.1} />
    </Wrapper> */}
    <LinearProgress />
  </div>
);

export default LoadingIndicator;

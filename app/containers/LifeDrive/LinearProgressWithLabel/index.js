import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
// import { unstable_Box as Box } from '@material-ui/core/Box';
import { Grid } from '@material-ui/core';
export default function LinearProgressWithLabel(props) {
  const { progress = 0, allProcess = 1 } = props
  return (
    <>
      {/* <Box display="flex" alignItems="center" width="100%"> */}
      {/* <Box width="100%" mr={1}> */}
      <Grid item md={12} container style={{marginTop:20}}>
        <Grid item md={8} container>
          {/* <LinearProgress variant="buffer" {...props} /> */}
          <div style={{width: "100%"}}>
          <LinearProgress variant="determinate" value={progress/allProcess} />
          </div>
        </Grid>
        <Grid item md={4} container>
          <Typography variant="body2" color="primary">{`Đang tải ${progress}/${allProcess} tập tin.`}</Typography>

        </Grid>
      </Grid>
      {/* <LinearProgress variant="buffer" {...props} /> */}
      {/* </Box> */}
      {/* <Box minWidth={35}> */}
      {/* <Typography variant="body2" color="primary">{`Đang tải ${progress}/${allProcess} tập tin.`}</Typography> */}
      {/* </Box> */}
      {/* </Box> */}
    </>

  );
}
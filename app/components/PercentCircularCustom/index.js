import { CircularProgress, Typography } from '@material-ui/core';
// import { CircularProgress, Typography, Box } from '@material-ui/core';
// import { Box } from 'devextreme-react';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';

export default function PercentCircularCustom(props) {
  const {value} = props;
  const [progress, setProgress] = useState(value);

  useEffect(() => {
    setProgress(value);
  }, [value]);

  const renderCircleAndNumberPercent = () => {
    if (progress < 0) {
      return null;
    // 0 : VÌ CircularProgress "HIỂN THỊ KHÔNG CHÍNH XÁC VALUE" - NÊN PHẢI CHỈNH LẠI CHO HỢP LÝ
    } else if(0 === progress){
      return (<div style={{ position:"relative", display:"inline-flex" }}>
      <CircularProgress variant="determinate" value={0} style={{ transform: 'rotate(-98deg)', border: '1px solid lightgray', borderRadius: '20px', backgroundColor: '#c7e5ff', color: '#007bff'}} />
      <div style={{  top: '0px', left: '0px', bottom: '0px', right: '0px', position: "absolute", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography variant="caption" component="div" color="textSecondary" style={{color:'#0000f0', fontWeight:'bolder', position: 'relative', top: '1px', left: '1px'}}>{`${Math.round(progress)}%`}</Typography>
      </div>
    </div>)
    } else if(0 < progress && progress < 5){
      return (<div style={{ position:"relative", display:"inline-flex" }}>
      <CircularProgress variant="determinate" value={1} style={{ transform: 'rotate(-98deg)', border: '1px solid lightgray', borderRadius: '20px', backgroundColor: '#c7e5ff', color: '#007bff'}} />
      <div style={{  top: '0px', left: '0px', bottom: '0px', right: '0px', position: "absolute", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography variant="caption" component="div" color="textSecondary" style={{color:'#0000f0', fontWeight:'bolder', position: 'relative', top: '1px', left: '1px'}}>{`${Math.round(progress)}%`}</Typography>
      </div>
    </div>)
    } else if(5 <= progress && progress < 10){
      return (<div style={{ position:"relative", display:"inline-flex" }}>
      <CircularProgress variant="determinate" value={2} style={{ transform: 'rotate(-98deg)', border: '1px solid lightgray', borderRadius: '20px', backgroundColor: '#c7e5ff', color: '#007bff'}} />
      <div style={{  top: '0px', left: '0px', bottom: '0px', right: '0px', position: "absolute", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography variant="caption" component="div" color="textSecondary" style={{color:'#0000f0', fontWeight:'bolder', position: 'relative', top: '1px', left: '1px'}}>{`${Math.round(progress)}%`}</Typography>
      </div>
    </div>)
    } else if(10 <= progress && progress < 12){
      return (<div style={{ position:"relative", display:"inline-flex" }}>
      <CircularProgress variant="determinate" value={3} style={{ transform: 'rotate(-98deg)', border: '1px solid lightgray', borderRadius: '20px', backgroundColor: '#c7e5ff', color: '#007bff'}} />
      <div style={{  top: '0px', left: '0px', bottom: '0px', right: '0px', position: "absolute", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography variant="caption" component="div" color="textSecondary" style={{color:'#0000f0', fontWeight:'bolder', position: 'relative', top: '1px', left: '1px'}}>{`${Math.round(progress)}%`}</Typography>
      </div>
    </div>)
    } else if(12 <= progress && progress < 25){
      return (<div style={{ position:"relative", display:"inline-flex" }}>
      <CircularProgress variant="determinate" value={progress -9} style={{ transform: 'rotate(-98deg)', border: '1px solid lightgray', borderRadius: '20px', backgroundColor: '#c7e5ff', color: '#007bff'}} />
      <div style={{  top: '0px', left: '0px', bottom: '0px', right: '0px', position: "absolute", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography variant="caption" component="div" color="textSecondary" style={{color:'#0000f0', fontWeight:'bolder', position: 'relative', top: '1px', left: '1px'}}>{`${Math.round(progress)}%`}</Typography>
      </div>
    </div>)
    // 25 : VÌ CircularProgress "HIỂN THỊ KHÔNG CHÍNH XÁC VALUE" - NÊN PHẢI CHỈNH LẠI CHO HỢP LÝ
    } else if(25 <= progress && progress < 30){
      return (<div style={{ position:"relative", display:"inline-flex" }}>
      <CircularProgress variant="determinate" value={progress -10} style={{ transform: 'rotate(-98deg)', border: '1px solid lightgray', borderRadius: '20px', backgroundColor: '#c7e5ff', color: '#007bff'}} />
      <div style={{  top: '0px', left: '0px', bottom: '0px', right: '0px', position: "absolute", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography variant="caption" component="div" color="textSecondary" style={{color:'#0000f0', fontWeight:'bolder', position: 'relative', top: '1px', left: '1px'}}>{`${Math.round(progress)}%`}</Typography>
      </div>
    </div>)
    } else if(30 <= progress && progress < 40){
      return (<div style={{ position:"relative", display:"inline-flex" }}>
      <CircularProgress variant="determinate" value={progress -14} style={{ transform: 'rotate(-98deg)', border: '1px solid lightgray', borderRadius: '20px', backgroundColor: '#c7e5ff', color: '#007bff'}} />
      <div style={{  top: '0px', left: '0px', bottom: '0px', right: '0px', position: "absolute", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography variant="caption" component="div" color="textSecondary" style={{color:'#0000f0', fontWeight:'bolder', position: 'relative', top: '1px', left: '1px'}}>{`${Math.round(progress)}%`}</Typography>
      </div>
    </div>)
    } else if(40 <= progress && progress < 50){
      return (<div style={{ position:"relative", display:"inline-flex" }}>
      <CircularProgress variant="determinate" value={progress -16} style={{ transform: 'rotate(-98deg)', border: '1px solid lightgray', borderRadius: '20px', backgroundColor: '#c7e5ff', color: '#007bff'}} />
      <div style={{  top: '0px', left: '0px', bottom: '0px', right: '0px', position: "absolute", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography variant="caption" component="div" color="textSecondary" style={{color:'#0000f0', fontWeight:'bolder', position: 'relative', top: '1px', left: '1px'}}>{`${Math.round(progress)}%`}</Typography>
      </div>
    </div>)
    // 50 : VÌ CircularProgress "HIỂN THỊ KHÔNG CHÍNH XÁC VALUE" - NÊN PHẢI CHỈNH LẠI CHO HỢP LÝ
    } else if(50 <= progress && progress < 60){
      return (<div style={{ position:"relative", display:"inline-flex" }}>
      <CircularProgress variant="determinate" value={progress -18} style={{ transform: 'rotate(-98deg)', border: '1px solid lightgray', borderRadius: '20px', backgroundColor: '#c7e5ff', color: '#007bff'}} />
      <div style={{  top: '0px', left: '0px', bottom: '0px', right: '0px', position: "absolute", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography variant="caption" component="div" color="textSecondary" style={{color:'#0000f0', fontWeight:'bolder', position: 'relative', top: '1px', left: '1px'}}>{`${Math.round(progress)}%`}</Typography>
      </div>
    </div>)
    } else if(60 <= progress && progress < 75){
      return (<div style={{ position:"relative", display:"inline-flex" }}>
      <CircularProgress variant="determinate" value={progress -19} style={{ transform: 'rotate(-98deg)', border: '1px solid lightgray', borderRadius: '20px', backgroundColor: '#c7e5ff', color: '#007bff'}} />
      <div style={{  top: '0px', left: '0px', bottom: '0px', right: '0px', position: "absolute", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography variant="caption" component="div" color="textSecondary" style={{color:'#0000f0', fontWeight:'bolder', position: 'relative', top: '1px', left: '1px'}}>{`${Math.round(progress)}%`}</Typography>
      </div>
    </div>)
    // 75 : VÌ CircularProgress "HIỂN THỊ KHÔNG CHÍNH XÁC VALUE" - NÊN PHẢI CHỈNH LẠI CHO HỢP LÝ
    } else if(75 <= progress && progress < 90){
      return (<div style={{ position:"relative", display:"inline-flex" }}>
      <CircularProgress variant="determinate" value={progress -20} style={{ transform: 'rotate(-98deg)', border: '1px solid lightgray', borderRadius: '20px', backgroundColor: '#c7e5ff', color: '#007bff'}} />
      <div style={{  top: '0px', left: '0px', bottom: '0px', right: '0px', position: "absolute", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography variant="caption" component="div" color="textSecondary" style={{color:'#0000f0', fontWeight:'bolder', position: 'relative', top: '1px', left: '1px'}}>{`${Math.round(progress)}%`}</Typography>
      </div>
    </div>)
    } else if(90 <= progress && progress < 100){
      return (<div style={{ position:"relative", display:"inline-flex" }}>
      <CircularProgress variant="determinate" value={progress -20} style={{ transform: 'rotate(-98deg)', border: '1px solid lightgray', borderRadius: '20px', backgroundColor: '#c7e5ff', color: '#007bff'}} />
      <div style={{  top: '0px', left: '0px', bottom: '0px', right: '0px', position: "absolute", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography variant="caption" component="div" color="textSecondary" style={{color:'#0000f0', fontWeight:'bolder', position: 'relative', top: '1px', left: '1px'}}>{`${Math.round(progress)}%`}</Typography>
      </div>
    </div>)
    // 100 : VÌ CircularProgress "HIỂN THỊ KHÔNG CHÍNH XÁC VALUE" - NÊN PHẢI CHỈNH LẠI CHO HỢP LÝ
    } else if(100 <= progress){
      return (<div style={{ position:"relative", display:"inline-flex" }}>
      <CircularProgress variant="determinate" value={100}  style={{ transform: 'rotate(-98deg)', border: '1px solid lightgray', borderRadius: '20px', backgroundColor: '#c7e5ff', color: '#007bff'}}/>
      <div style={{  top: '0px', left: '0px', bottom: '0px', right: '0px', position: "absolute", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography variant="caption" component="div" color="textSecondary" style={{color:'#0000f0', fontWeight:'bolder', position: 'relative', top: '1px', left: '1px'}}>{`${Math.round(progress)}%`}</Typography>
      </div>
    </div>)
    }
  }

  return renderCircleAndNumberPercent();
}
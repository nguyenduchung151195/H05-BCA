import React from 'react';

export default function PercentBarCustom(props) {
  const {value} = props;

  const renderBarAndNumberPercent = () => {
    if (value < 0) {
      return null;
    } else if(0 <= value && value < 10){
      return (<React.Fragment>
        <div style={{display:'inline-block', width: `${value}%`, height:'20px', color:'white', backgroundColor:'#4ca4f0', margin:'8px 10px 0px 0px'}}></div>
        <span style={{color:'#4ca4f0', fontWeight:'bolder', textAlign:'left', position: 'relative', top: '-5px'}}>{Math.round(value)} %</span>
      </React.Fragment>)
    } else if(10 <= value){
      return (<React.Fragment>
        <div style={{width: ((value>100) ? `100%` : `${value}%`), height:'20px', color:'white', fontWeight:'bolder', backgroundColor:'#4ca4f0', textAlign:'center'}}>
          {Math.round(value)} %
        </div>
      </React.Fragment>)
    }
  }

  return renderBarAndNumberPercent();
}

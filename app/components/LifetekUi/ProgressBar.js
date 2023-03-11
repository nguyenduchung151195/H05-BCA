import React, { useEffect } from 'react';
import './progress.css';

export default function ProgressBar(props) {
  const [progress, setProgress] = React.useState(0);
  useEffect(
    () => {
      const max = -219.99078369140625;
      const progress = ((100 - props.progress) / 100) * max;
      setProgress(progress);
    },
    [props.fillColor, props.progress],
  );
  return (
    <div id="wrapper" className="center">
      <svg className={`progress fill noselect ${props.fillColor}`} data-progress={progress} x="0px" y="0px" viewBox="0 0 80 80">
        <path className="track" d="M5,40a35,35 0 1,0 70,0a35,35 0 1,0 -70,0" />
        <path style={{ strokeDashoffset: progress }} className="fill" d="M5,40a35,35 0 1,0 70,0a35,35 0 1,0 -70,0" />
        <text className="value" x="50%" y="55%">
          {props.textCenter}
        </text>
        <text className="text" x="50%" y="115%">
          {props.text}
        </text>
      </svg>
    </div>
  );
}

ProgressBar.defaultProps = { textCenter: '%', fillColor: 'blue' };
// var forEach = function (array, callback, scope) {
// 	for (var i = 0; i < array.length; i++) {
// 		callback.call(scope, i, array[i]);
// 	}
// };
// window.onload = function(){
// 	var max = -219.99078369140625;
// 	forEach(document.querySelectorAll('.progress'), function (index, value) {
// 	percent = value.getAttribute('data-progress');
// 		value.querySelector('.fill').setAttribute('style', 'stroke-dashoffset: ' + ((100 - percent) / 100) * max);
// 		value.querySelector('.value').innerHTML = percent + '%';
// 	});
// }

/**
 *
 * ImportFile
 *
 */

 import React from 'react';
 // import PropTypes from 'prop-types';
 // import styled from 'styled-components';
 
 // function setDescendantProp(options, value, obj) {
 //   options.split('.').reduce((r, a, index) => {
 //     if (typeof r[a] === 'object') return r[a];
 //     if (options.split('.').length - 1 === index) {
 //       return (r[a] = value);
 //     }
 //     return (r[a] = {});
 //   }, obj);
 //   return obj;
 // }
 /* list of supported file types */
 const SheetJSFT = [
   'xlsx',
   'xlsb',
   'xlsm',
   'xls',
   'xml',
   'csv',
   'txt',
   'ods',
   'fods',
   'uos',
   'sylk',
   'dif',
   'dbf',
   'prn',
   'qpw',
   '123',
   'wb*',
   'wq*',
   'html',
   'htm',
 ]
   .map(x => `.${x}`)
   .join(',');
 
 // eslint-disable-next-line react/no-multi-comp
 class ImportFile extends React.Component {
   constructor(props) {
     super(props);
     this.state = {};
     this.handleChange = this.handleChange.bind(this);
   }
 
   handleChange(e) {
     // eslint-disable-next-line prefer-destructuring
     const files = e.target.files;
     if (files && files[0]) this.props.handleFile(files[0]);
   }
 
   render() {
     return (
       <div
         style={{
           width: '80%',
           margin: '10px',
           height: '70px',
           fontSize: '20px',
           //   background: '#fff',
           display: 'flex',
           justifyContent: 'space-between',
           alignItems: 'center',
         }}
       >
         {/* <p
           style={{ fontFamily: 'Roboto, Arial, sans-serif' }}
           //   htmlFor="file"
         >
           Đường dẫn đến tập tin :
         </p> */}
         <div
           style={{
             border: '1px solid #c2cad8',
             width: '70%',
             display: 'flex',
             justifyContent: 'inherit',
             padding: ' 6px 16px',
           }}
         >
           <input
             type="file"
             style={{ display: 'none' }}
             // style={{ width: '50%', border: '1px solid' }}
             id="file"
             name="file"
             accept={SheetJSFT}
             // value="Upload Now"
             onChange={this.handleChange}
           />
           <input
             type="text"
             disabled
             id="file"
             name="file"
             style={{
               width: '-webkit-fill-available',
               //   zIndex: '-1',
               fontFamily: 'Roboto, Arial, sans-serif',
               paddingLeft: '20px',
               fontSize: '18px',
               cursor: 'not-allowed',
             }}
             value={this.props.fileName}
           />
           <div
             style={{
               width: '15%',
               //   border: '1px solid',
               height: '100%',
               color: '#FFF',
               display: 'flex',
               justifyContent: 'center',
               // background: '#f2784b',
               border: '#f2784b',
               fontFamily: 'Roboto, Arial, sans-serif',
             }}
           >
             <label
               style={{
                 width: '-webkit-fill-available',
                 textAlign: 'center',
                 cursor: 'pointer',
               }}
               htmlFor="file"
             >
               Chọn tập tin
             </label>
           </div>
         </div>
       </div>
       // </div>
     );
   }
 }
 
 ImportFile.propTypes = {};
 
 export default ImportFile;
 
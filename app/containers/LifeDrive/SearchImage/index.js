/* eslint-disable react/prop-types */
/* eslint-disable indent */
/**
 *
 * CreateProjectContentDialog
 *
 */

 import React from 'react';
 // import PropTypes from 'prop-types';
 // import styled from 'styled-components';
 // import AsyncSelect from 'react-select/async';
 import { TextField, Grid, Button } from '@material-ui/core';
 
 import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
 //  import AsyncSelect from '../AsyncComponent';
 import { API_USERS } from 'config/urlConfig';
 /* eslint-disable react/prefer-stateless-function */
 import CustomInputBase from '../../../components/Input/CustomInputBase';
 const blockInvalidChar = e => ['e', 'E', '+', '-', '.'].includes(e.key) && e.preventDefault();
 import { OutlinedInput, MenuItem, Select, CircularProgress } from '@material-ui/core';
 
 class SearchImage extends React.Component {
   state = {
     project: {
       fullPath: '',
     },
     number: 10,
     type: '',
   };
 
   handleChangeSelect = (selectedOption, key) => {
     const { project } = this.state;
     project[key] = selectedOption;
     this.setState({ project });
     this.props.onChangeNewProject(project);
   };
   handleChange = e => {
     const value = e.target.value;
     this.setState({ number: value });
     this.props.handleChangeTypeSearchImage({numberImage: value});
   };
 
   render() {
     const { project, number } = this.state;
     return (
           <Grid container>
             <Grid item sm={12} className="my-2">
               <input
                 type="file"
                 id="fileUpload"
                 name="fileUpload"
                 onChange={event => {
                   project.fullPath = event.target.value;
                   this.setState({ project });
                  //  this.props.onChangeNewProject(project);
                 }}
                //  value={project.fullPath}
                 accept=".jpg,.jpeg,.png,.pdf"
               />
             </Grid>
             <Grid item sm={6} md={6} style={{ display: 'flex', justifyContent: 'center',marginBottom :5 }}>
               <Select
                 style={{ height: '38px', width: '100%' }}
                 name="type"
                 title="Lựa chọn type"
                 value={this.state.type}
                 onChange={e => {
                   this.setState({
                     type: e.target.value,
                   });
                   this.props.handleChangeTypeSearchImage({typeSearch: e.target.value});

                 }}
                 input={<OutlinedInput name="age" id="outlined-age-simple" />}
               >
                 <MenuItem value="">Chọn kết quả tìm kiếm</MenuItem>
                 <MenuItem value="image">Hình ảnh</MenuItem>
                 <MenuItem value="video">Video</MenuItem>
               </Select>
             </Grid>
             {this.state.type === 'image' ? (
               <Grid item sm={12} md={12}>
                 <label for="number">Số ảnh liên quan</label>
                 <input name="number" type="number" value={number} onKeyDown={blockInvalidChar} onChange={this.handleChange} />
               </Grid>
             ) : (
               ''
             )}
           
           </Grid>
      
     );
   }
 }
 
 SearchImage.propTypes = {};
 
 export default SearchImage;
 
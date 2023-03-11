// import React from 'react';
// import ListPage from 'components/List';
// import { Info, Edit, ModeComment, SaveAlt, Add } from '@material-ui/icons';
// import {
//   MenuItem,
//   Button,
//   Avatar,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   TableRow,
//   TableCell,
//   TableHead,
//   Table,
//   TableBody,
// } from '@material-ui/core';

// import { supplierColumns, progressColumns, approvedColumns, historyColumns, replaceColumns } from 'variable';


// import { Grid, Paper, Typography, TextField, Autocomplete, Tabs, Tab } from '../../components/LifetekUi';
// import { API_PROGRESS, API_TRANFER, GET_CONTRACT, API_TASK_PROJECT } from '../../config/urlConfig';

// function EditProject({ intl, addProjects, mergeData, ...props }) {
//   const [state, setSt] = React.useState({ tabIndex: 0, tab: 0, openDialog: false, openDialogProgress: false, tabContract: 0 });
//   function setState(data) {
//     const newSt = { ...state, ...data };
//     setSt(newSt);
//   }
//   return (
//     <div>
//       <Paper>
//         <Grid>
//           <Typography variant="h5" color="primary">
//             <Edit /> {addProjects.name}
//           </Typography>
//           <div>
//             <Tabs
//               value={state.tabIndex}
//               onChange={(event, value) => {
//                 setState({ tabIndex: value });
//                 mergeData({ type: 1 });
//               }}
//             >
//               <Tab value={0} label={intl.formatMessage(messages.coban || { id: 'coban', defaultMessage: 'coban' })} />
//               <Tab value={1} label={intl.formatMessage(messages.tiendo || { id: 'tiendo', defaultMessage: 'tiendo' })} />
//               <Tab value={2} label={intl.formatMessage(messages.tailieu || { id: 'tailieu', defaultMessage: 'tailieu' })} />
//               <Tab value={3} label={intl.formatMessage(messages.chuyencongviec || { id: 'chuyencongviec', defaultMessage: 'chuyencongviec' })} />
//               <Tab value={4} label={intl.formatMessage(messages.hopdong || { id: 'hopdong', defaultMessage: 'hopdong' })} />
//               <Tab value={5} label={intl.formatMessage(messages.chitiet || { id: 'chitiet', defaultMessage: 'chitiet' })} />
//               <Tab value={6} label={intl.formatMessage(messages.tytrongcongviec || { id: 'tytrongcongviec', defaultMessage: 'tytrongcongviec' })} />
//             </Tabs>

//             {state.tabIndex === 0 && (
//               <div
//                 className="my-3"
//                 style={{
//                   display: 'flex',
//                 }}
//               >
//                 <Grid container>
//                   <Grid item md={12} spacing={4}>
//                     <TextField
//                       fullWidth
//                       required
//                       label={props.names.name}
//                       onChange={e => mergeData({ name: e.target.value })}
//                       value={addProjects.name}
//                       name="name"
//                     />
//                     <TextField
//                       multiline
//                       rowsMax="4"
//                       fullWidth
//                       label={props.names.description}
//                       name="description"
//                       value={addProjects.description}
//                       onChange={e => mergeData({ description: e.target.value })}
//                     />
//                     <Grid item md={12}>
//                       <Typography variant="body1" color="primary" style={{ margin: '20px 0' }}>
//                         <Info />
//                         {intl.formatMessage(messages.thongtin || { id: 'thongtin', defaultMessage: 'thongtin' })}
//                       </Typography>
//                       <TextField
//                         required
//                         InputLabelProps={{ shrink: true }}
//                         fullWidth
//                         type="date"
//                         label={props.names.startDate}
//                         value={addProjects.startDate}
//                         name="startDate"
//                         onChange={e => mergeData({ startDate: e.target.value })}
//                       />
//                       <TextField
//                         required
//                         InputLabelProps={{ shrink: true }}
//                         fullWidth
//                         type="date"
//                         label={props.names.endDate}
//                         value={addProjects.endDate}
//                         name="endDate"
//                         onChange={e => mergeData({ endDate: e.target.value })}
//                       />
//                       <Autocomplete
//                         name="Chọn khách hàng..."
//                         label={props.names.customer}
//                         onChange={value => mergeData({ customer: value })}
//                         suggestions={customers.data}
//                         value={addProjects.customer}
//                       />
//                       <Autocomplete
//                         isMulti
//                         name="Chọn người được xem..."
//                         label={props.names.viewable}
//                         onChange={value => mergeData({ viewable: value })}
//                         suggestions={props.employees.data}
//                         value={addProjects.viewable}
//                       />
//                       <Autocomplete
//                         isMulti
//                         name="Chọn người tham gia..."
//                         label={props.names.join}
//                         onChange={value => mergeData({ join: value })}
//                         suggestions={props.employees.data}
//                         value={addProjects.join}
//                         helperText="Không được bỏ trống"
//                       />
//                       <Autocomplete
//                         isMulti
//                         name="Chọn người phụ trách... "
//                         label={props.names.inCharge}
//                         onChange={value => mergeData({ inCharge: value })}
//                         suggestions={props.employees.data}
//                         value={addProjects.inCharge}
//                       />
//                       <Autocomplete
//                         isMulti
//                         name="Chọn người hỗ trợ... "
//                         label={props.names.support}
//                         onChange={value => mergeData({ support: value })}
//                         suggestions={props.employees.data}
//                         value={addProjects.support}
//                       />
//                       <Autocomplete
//                         isMulti
//                         name="Chọn người phê duyệt..."
//                         label={props.names.approved}
//                         suggestions={props.employees.data}
//                         onChange={value => mergeData({ approved: value })}
//                         value={addProjects.approved}
//                       />
//                     </Grid>
//                   </Grid>
//                 </Grid>
//               </div>
//             )}
//             {tabIndex === 1 && (
//               <div
//                 className="my-3"
//                 style={{
//                   display: 'flex',
//                 }}
//               >
//                 <Grid container>
//                   <Grid item md={10} spacing={4} style={{ display: 'flex', alignItems: 'center' }}>
//                     <TextField
//                       style={{ width: '70%' }}
//                       id="standard-select-currency"
//                       select
//                       label="Chọn công việc và dự án"
//                       name="idSelect"
//                       value={addProjects.idSelect ? addProjects.idSelect : addProjects._id}
//                       onChange={e => this.handleChange('idSelect', e.target.value)}
//                       SelectProps={{
//                         MenuProps: {},
//                       }}
//                       margin="normal"
//                     >
//                       {this.mapItem(this.findChildren(addProjects.projects.data).filter(item => item._id === addProjects._id))}
//                     </TextField>
//                     <Button variant="contained" color="primary" onClick={this.handleOpenDialogProgress} style={{ padding: '1.1%' }}>
//                       {intl.formatMessage(messages.capnhat || { id: 'capnhat', defaultMessage: 'capnhat' })}
//                     </Button>
//                     <Button variant="contained" color="secondary" style={{ marginLeft: 20, padding: '1.1%' }} onClick={this.handleComplete}>
//                       {intl.formatMessage(messages.hoanthanh || { id: 'hoanthanh', defaultMessage: 'hoanthanh' })}
//                     </Button>
//                   </Grid>
//                   <Grid item md={12} spacing={4} style={{ display: 'flex' }}>
//                     <Typography style={{ fontWeight: 'bold' }}>
//                       {intl.formatMessage(messages.tiendovapheduyet || { id: 'tiendovapheduyet', defaultMessage: 'tiendovapheduyet' })}
//                     </Typography>
//                   </Grid>
//                   <Grid item md={12} spacing={4}>
//                     <Tabs
//                       value={tab}
//                       onChange={(event, value) => {
//                         setState({ tab: value });
//                       }}
//                     >
//                       <Tab value={0} label={intl.formatMessage(messages.tiendo || { id: 'tiendo', defaultMessage: 'tiendo' })} />
//                       <Tab value={1} label={intl.formatMessage(messages.lichsu || { id: 'lichsu', defaultMessage: 'lichsu' })} />
//                       <Tab value={2} label={intl.formatMessage(messages.phesuyet || { id: 'phesuyet', defaultMessage: 'phesuyet' })} />
//                     </Tabs>
//                   </Grid>
//                   {tab === 0 && (
//                     <Grid container md={12} spacing={4}>
//                       <ListPage
//                         disableEdit
//                         disableAdd
//                         columns={progressColumns}
//                         apiUrl={`${API_TASK_PROJECT}/${addProjects._id}`}
//                         mapFunction={this.mapFunction}
//                         filter={{ isProject: true }}
//                       />
//                     </Grid>
//                   )}
//                   {tab === 1 && (
//                     <Grid item md={12} spacing={4}>
//                       <ListPage
//                         disableEdit
//                         disableAdd
//                         // settingBar={[this.addItem()]}
//                         columns={historyColumns}
//                         // disableConfig
//                         // code="Currency"
//                         apiUrl={`${API_PROGRESS}/${addProjects._id}`}
//                         mapFunction={this.mapFunction1}
//                       />
//                     </Grid>
//                   )}
//                   {tab === 2 && (
//                     <Grid item md={12} spacing={4}>
//                       <ListPage
//                         disableEdit
//                         disableAdd
//                         // deleteOption="ids"
//                         // settingBar={[this.addItem()]}
//                         columns={approvedColumns}
//                         // disableConfig
//                         // code="Currency"
//                         apiUrl={API_TASK_PROJECT}
//                         mapFunction={this.mapFunction2}
//                       />
//                     </Grid>
//                   )}
//                 </Grid>
//                 <Dialog open={openDialogProgress} onClose={this.handleDialogProgress}>
//                   <DialogTitle id="alert-dialog-title">
//                     {intl.formatMessage(messages.capnhattiendo || { id: 'capnhattiendo', defaultMessage: 'capnhattiendo' })}
//                   </DialogTitle>
//                   <DialogContent style={{ width: 600 }}>
//                     <TextField
//                       fullWidth
//                       select
//                       label={names.taskStatus}
//                       value={addProjects.taskStatus}
//                       name="taskStatus"
//                       onChange={e => this.handleChange('taskStatus', e.target.value)}
//                     >
//                       <MenuItem value={1}>Đang thực hiện</MenuItem>
//                       <MenuItem value={2}>Hoàn thành</MenuItem>
//                       <MenuItem value={3}>Đóng dừng</MenuItem>
//                       <MenuItem value={4}>Không thực thiện</MenuItem>
//                     </TextField>
//                     {addProjects.projects.data.find(item => item.parentId === addProjects.idSelect) ? null : (
//                       <TextField
//                         fullWidth
//                         id="standard-name"
//                         label={names.progress}
//                         margin="normal"
//                         name="progress"
//                         onChange={e => this.handleChange('progress', e.target.value)}
//                         value={addProjects.progress}
//                         type="number"
//                       />
//                     )}

//                     <TextField
//                       fullWidth
//                       select
//                       label={names.priority}
//                       value={addProjects.priority}
//                       name="priority"
//                       onChange={e => this.handleChange('priority', e.target.value)}
//                     >
//                       <MenuItem value={1}> {intl.formatMessage(messages.ratcao || { id: 'ratcao', defaultMessage: 'ratcao' })}</MenuItem>
//                       <MenuItem value={2}> {intl.formatMessage(messages.cao || { id: 'cao', defaultMessage: 'cao' })}</MenuItem>
//                       <MenuItem value={3}>{intl.formatMessage(messages.trungbinh || { id: 'trungbinh', defaultMessage: 'trungbinh' })}</MenuItem>
//                       <MenuItem value={4}> {intl.formatMessage(messages.thap || { id: 'thap', defaultMessage: 'thap' })}</MenuItem>
//                       <MenuItem value={5}>{intl.formatMessage(messages.ratthap || { id: 'ratthap', defaultMessage: 'ratthap' })}</MenuItem>
//                     </TextField>
//                     <TextField
//                       fullWidth
//                       id="standard-name"
//                       label="Ghi chú"
//                       margin="normal"
//                       name="note"
//                       onChange={e => this.handleChange('note', e.target.value)}
//                       value={addProjects.note}
//                     />
//                   </DialogContent>
//                   <DialogActions>
//                     <Button onClick={this.onSaveProgress} variant="contained" color="primary" autoFocus>
//                       {intl.formatMessage(messages.luu || { id: 'luu', defaultMessage: 'luu' })}
//                     </Button>
//                   </DialogActions>
//                 </Dialog>
//               </div>
//             )}
//             {tabIndex === 2 && (
//               <div
//                 className="my-3"
//                 style={{
//                   display: 'flex',
//                 }}
//               >
//                 <Grid item md={12} spacing={4}>
//                   <Typography style={{ fontWeight: 'bold', fontSize: 18 }}>
//                     {intl.formatMessage(messages.danhsachtailieu || { id: 'danhsachtailieu', defaultMessage: 'danhsachtailieu' })}
//                   </Typography>
//                   <Button variant="contained" color="primary" style={{ marginLeft: '85%', marginBottom: '30px' }} onClick={this.handleDialog}>
//                     {intl.formatMessage(messages.themmoifile || { id: 'themmoifile', defaultMessage: 'themmoifile' })}
//                   </Button>
//                   <Table>
//                     <TableHead>
//                       <TableRow>
//                         <TableCell>{intl.formatMessage(messages.tentailieu || { id: 'tentailieu', defaultMessage: 'tentailieu' })}</TableCell>
//                         <TableCell>{intl.formatMessage(messages.tenfile || { id: 'tenfile', defaultMessage: 'tenfile' })}</TableCell>
//                         <TableCell>{intl.formatMessage(messages.ngaytao || { id: 'ngaytao', defaultMessage: 'ngaytao' })}</TableCell>
//                         <TableCell>{intl.formatMessage(messages.ghichu || { id: 'ghichu', defaultMessage: 'ghichu' })}</TableCell>
//                         <TableCell>{intl.formatMessage(messages.taixuong || { id: 'taixuong', defaultMessage: 'taixuong' })}</TableCell>
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>
//                       {addProjects.file.length > 0
//                         ? addProjects.file.map(item => (
//                             <TableRow>
//                               <TableCell>{item.name}</TableCell>
//                               <TableCell>{item.fileName}</TableCell>
//                               <TableCell>{addProjects.createdAt}</TableCell>
//                               <TableCell>{item.description}</TableCell>
//                               <TableCell>
//                                 <SaveAlt style={{ color: '#0795db', cursor: 'pointer' }} onClick={() => window.open(item.url)} />
//                               </TableCell>
//                             </TableRow>
//                           ))
//                         : ''}
//                     </TableBody>
//                   </Table>
//                 </Grid>
//                 <Dialog open={openDialog} onClose={this.handleDialogAdd}>
//                   <DialogTitle id="alert-dialog-title">
//                     {intl.formatMessage(messages.themmoifile || { id: 'themmoifile', defaultMessage: 'themmoifile' })}
//                   </DialogTitle>
//                   {/* {addProjects.file.map(item => ( */}
//                   <DialogContent style={{ width: 600 }}>
//                     <TextField
//                       fullWidth
//                       id="standard-name"
//                       label="Tên tài liệu"
//                       margin="normal"
//                       name="name"
//                       onChange={e => this.handleChange('name', e.target.value)}
//                       value={addProjects.name}
//                     />
//                     <TextField
//                       fullWidth
//                       id="standard-name"
//                       label="File Upload"
//                       margin="normal"
//                       name="url"
//                       type="file"
//                       // value={addProjects.url}
//                       onChange={this.handleChangeInputFile}
//                       InputLabelProps={{
//                         shrink: true,
//                       }}
//                     />
//                     <TextField
//                       fullWidth
//                       id="standard-name"
//                       label="Tên file"
//                       margin="normal"
//                       name="fileName"
//                       onChange={e => this.handleChange('fileName', e.target.value)}
//                       value={addProjects.fileName}
//                     />
//                     <TextField
//                       fullWidth
//                       id="standard-name"
//                       label="Mô tả"
//                       margin="normal"
//                       name="description"
//                       onChange={e => this.handleChange('description', e.target.value)}
//                       value={addProjects.description}
//                     />
//                   </DialogContent>
//                   <DialogActions>
//                     <Button onClick={this.onSaveFile} variant="contained" color="primary" autoFocus>
//                       {intl.formatMessage(messages.luu || { id: 'luu', defaultMessage: 'luu' })}
//                     </Button>
//                   </DialogActions>
//                 </Dialog>
//               </div>
//             )}
//             {tabIndex === 3 && (
//               <div>
//                 <Grid container md={12} spacing={4}>
//                   <Typography style={{ fontWeight: 'bold', fontSize: 18 }}>
//                     {' '}
//                     {intl.formatMessage(messages.chonnguoithaythe || { id: 'chonnguoithaythe', defaultMessage: 'chonnguoithaythe' })}
//                   </Typography>
//                   <Grid container md={12} spacing={4}>
//                     <Grid item md={12} spacing={4}>
//                       <Tabs value={addProjects.type} onChange={(e, type) => mergeData({ type })}>
//                         <Tab
//                           value={1}
//                           label={intl.formatMessage(messages.nguoiphutrach || { id: 'nguoiphutrach', defaultMessage: 'nguoiphutrach' })}
//                         />
//                         <Tab value={2} label={intl.formatMessage(messages.nguoithamgia || { id: 'nguoithamgia', defaultMessage: 'nguoithamgia' })} />
//                       </Tabs>
//                     </Grid>
//                     {addProjects.type === 1 && (
//                       <Grid item md={12} spacing={4}>
//                         <Autocomplete
//                           isMulti
//                           name="Chọn "
//                           label={names.inCharge}
//                           suggestions={addProjects.listInCharge}
//                           onChange={this.selectcurrentEmployees}
//                           value={addProjects.currentEmployees}
//                         />
//                         <Autocomplete
//                           isMulti
//                           name="Chọn "
//                           label="Người thay thế"
//                           suggestions={employees.data}
//                           onChange={this.selectTranferEmployees}
//                           value={addProjects.tranferEmployees}
//                         />
//                         <Button variant="contained" color="primary" style={{ marginLeft: '90%' }} onClick={this.onSaveTranfer}>
//                           {intl.formatMessage(messages.capnhat || { id: 'capnhat', defaultMessage: 'capnhat' })}
//                         </Button>
//                         <ListPage
//                           disableEdit
//                           disableAdd
//                           disableDot
//                           columns={replaceColumns}
//                           apiUrl={`${API_TRANFER}/${addProjects._id}`}
//                           mapFunction={this.mapFunctionTranfer1}
//                         />
//                       </Grid>
//                     )}
//                     {addProjects.type === 2 && (
//                       <Grid item md={12} spacing={4}>
//                         <Autocomplete
//                           isMulti
//                           name="Chọn "
//                           label={names.join}
//                           suggestions={addProjects.listJoin}
//                           onChange={this.selectcurrentEmployees}
//                           value={addProjects.currentEmployees}
//                         />
//                         <Autocomplete
//                           isMulti
//                           name="Chọn "
//                           label="Người thay thế"
//                           suggestions={employees.data}
//                           onChange={this.selectTranferEmployees}
//                           value={addProjects.tranferEmployees}
//                         />
//                         <Button variant="contained" color="primary" style={{ marginLeft: '90%' }} onClick={this.onSaveTranfer}>
//                           {intl.formatMessage(messages.capnhat || { id: 'capnhat', defaultMessage: 'capnhat' })}
//                         </Button>
//                         <ListPage
//                           disableEdit
//                           disableAdd
//                           deleteOption="ids"
//                           columns={replaceColumns}
//                           apiUrl={`${API_TRANFER}/${addProjects._id}`}
//                           mapFunction={this.mapFunctionTranfer1}
//                         />
//                       </Grid>
//                     )}
//                   </Grid>
//                 </Grid>
//               </div>
//             )}
//             {tabIndex === 4 && (
//               <div>
//                 <div>
//                   <Bt tabContract={0}>
//                     {intl.formatMessage(messages.hopdongnhacungcap || { id: 'hopdongnhacungcap', defaultMessage: 'hopdongnhacungcap' })}
//                   </Bt>
//                   <Bt tabContract={1}>
//                     {intl.formatMessage(messages.hopdongkhachhang || { id: 'hopdongkhachhang', defaultMessage: 'hopdongkhachhang' })}
//                   </Bt>
//                 </div>
//                 {tabContract === 0 ? (
//                   <Grid container md={12} spacing={4}>
//                     <ListPage
//                       disableEdit
//                       disableAdd
//                       disableDot
//                       columns={supplierColumns}
//                       apiUrl={GET_CONTRACT}
//                       filter={{ typeContract: 2 }}
//                       mapFunction={this.mapFunctionContract}
//                     />
//                   </Grid>
//                 ) : null}
//                 {tabContract === 1 ? (
//                   <Grid container md={12} spacing={4}>
//                     <ListPage
//                       disableEdit
//                       disableAdd
//                       disableDot
//                       columns={supplierColumns}
//                       apiUrl={GET_CONTRACT}
//                       filter={{ typeContract: 1 }}
//                       mapFunction={this.mapFunctionContract}
//                     />
//                   </Grid>
//                 ) : null}
//               </div>
//             )}

//             {tabIndex === 5 && (
//               <div className="my-3">
//                 <Grid container spacing={3}>
//                   <Grid item md={6}>
//                     <Grid item style={{ display: 'flex', alignItems: 'center' }}>
//                       <Edit />
//                       <Typography style={{ fontWeight: 'bold', fontSize: 18 }}>
//                         {intl.formatMessage(messages.thongtinchitiet || { id: 'thongtinchitiet', defaultMessage: 'thongtinchitiet' })}
//                       </Typography>
//                     </Grid>
//                     <TextField required InputLabelProps={{ shrink: true }} fullWidth label={names.name} value={addProjects.name} name="name" />
//                     <TextField
//                       required
//                       InputLabelProps={{ shrink: true }}
//                       fullWidth
//                       label={names.customer}
//                       value={addProjects.customer ? addProjects.customer.name : null}
//                       name="customer"
//                     />
//                     <TextField
//                       required
//                       InputLabelProps={{ shrink: true }}
//                       fullWidth
//                       type="date"
//                       label={names.startDate}
//                       value={addProjects.startDate}
//                       name="startDate"
//                     />
//                     <TextField
//                       required
//                       InputLabelProps={{ shrink: true }}
//                       fullWidth
//                       type="date"
//                       label={names.endDate}
//                       value={addProjects.endDate}
//                       name="endDate"
//                     />
//                     <TextField
//                       fullWidth
//                       label={names.taskStatus}
//                       value={
//                         addProjects.taskStatus === '1'
//                           ? intl.formatMessage(messages.dangthuchien || { id: 'dangthuchien', defaultMessage: 'dangthuchien' })
//                           : addProjects.taskStatus === '2'
//                             ? intl.formatMessage(messages.hoanthanh || { id: 'hoanthanh', defaultMessage: 'hoanthanh' })
//                             : addProjects.taskStatus === '3'
//                               ? intl.formatMessage(messages.dongdung || { id: 'dongdung', defaultMessage: 'dongdung' })
//                               : intl.formatMessage(messages.khongthuchien || { id: 'khongthuchien', defaultMessage: 'khongthuchien' })
//                       }
//                       name="taskStatus"
//                     />
//                     <TextField
//                       InputLabelProps={{ shrink: true }}
//                       fullWidth
//                       label="Dự án"
//                       value={projects.data ? projects.data.find(item => item._id === addProjects.projectId).name : null}
//                       name="projectId"
//                     />
//                     <TextField InputLabelProps={{ shrink: true }} value={addProjects.progress} fullWidth label={names.progress} />
//                     <TextField
//                       fullWidth
//                       label={names.priority}
//                       value={
//                         // eslint-disable-next-line eqeqeq
//                         addProjects.priority == 1
//                           ? intl.formatMessage(messages.ratcao || { id: 'ratcao', defaultMessage: 'ratcao' })
//                           : // eslint-disable-next-line eqeqeq
//                             addProjects.priority == 2
//                             ? intl.formatMessage(messages.cao || { id: 'cao', defaultMessage: 'cao' })
//                             : // eslint-disable-next-line eqeqeq
//                               addProjects.priority == 3
//                               ? intl.formatMessage(messages.trungbinh || { id: 'trungbinh', defaultMessage: 'trungbinh' })
//                               : // eslint-disable-next-line eqeqeq
//                                 addProjects.priority == 4
//                                 ? intl.formatMessage(messages.thap || { id: 'thap', defaultMessage: 'thap' })
//                                 : intl.formatMessage(messages.ratthap || { id: 'ratthap', defaultMessage: 'ratthap' })
//                       }
//                       name="priority"
//                     />
//                     <TextField fullWidth label={names.viewable} value={this.mapPeople(addProjects.viewable)} name="viewable" />
//                     <TextField fullWidth label={names.inCharge} value={this.mapPeople(addProjects.inCharge)} name="inCharge" />
//                     <TextField fullWidth label={names.join} value={this.mapPeople(addProjects.join)} name="join" />
//                     <TextField
//                       fullWidth
//                       label={names.createdBy}
//                       value={addProjects.createdBy ? addProjects.createdBy.name : null}
//                       name="createdBy"
//                       InputLabelProps={{ shrink: true }}
//                     />

//                     <TextField
//                       InputLabelProps={{ shrink: true }}
//                       fullWidth
//                       label={names.description}
//                       value={addProjects.description}
//                       name="description"
//                     />
//                     <TextField fullWidth InputLabelProps={{ shrink: true }} type="file" label="Tài liệu đính kèm" />
//                   </Grid>
//                   <Grid container md={6} style={{ display: 'block' }}>
//                     <Grid item style={{ display: 'flex', alignItems: 'center' }}>
//                       <ModeComment />
//                       <Typography style={{ fontWeight: 'bold', fontSize: 16 }}>
//                         {intl.formatMessage(messages.ykienthaoluan || { id: 'ykienthaoluan', defaultMessage: 'ykienthaoluan' })}
//                       </Typography>
//                     </Grid>
//                     <Avatar style={{ width: '50px', height: '50px' }} alt="Remy Sharp" src={profile.avatar} />
//                     <TextField id="outlined-multiline-flexible" multiline rows="4" margin="normal" variant="outlined" style={{ width: '100%' }} />
//                     <Button variant="contained" color="primary" style={{ width: '15%', marginLeft: '85%' }}>
//                       {intl.formatMessage(messages.binhluan || { id: 'binhluan', defaultMessage: 'binhluan' })}
//                     </Button>
//                   </Grid>
//                 </Grid>
//               </div>
//             )}

//             {tabIndex === 6 && (
//               <div className="my-3">
//                 <Paper>
//                   <Grid sm={10}>
//                     <Table>
//                       <TableHead>
//                         <TableRow>
//                           <TableCell style={{ fontWeight: 'bold' }}>
//                             {intl.formatMessage(messages.stt || { id: 'stt', defaultMessage: 'stt' })}
//                           </TableCell>
//                           <TableCell align="left" style={{ fontWeight: 'bold' }}>
//                             {intl.formatMessage(messages.tencongviec || { id: 'tencongviec', defaultMessage: 'tencongviec' })}
//                           </TableCell>
//                           <TableCell align="left" style={{ fontWeight: 'bold' }}>
//                             {intl.formatMessage(messages.ngay || { id: 'ngay', defaultMessage: 'ngay' })}
//                           </TableCell>
//                           <TableCell align="left" style={{ fontWeight: 'bold' }}>
//                             {intl.formatMessage(messages.tyle || { id: 'tyle', defaultMessage: 'tyle' })}
//                           </TableCell>
//                           <TableCell align="left" style={{ fontWeight: 'bold' }}>
//                             {intl.formatMessage(messages.tytrong || { id: 'tytrong', defaultMessage: 'tytrong' })}
//                           </TableCell>
//                         </TableRow>
//                       </TableHead>
//                       <TableBody>
//                         {projects.data.filter(item => item.level === 1).map((item, index) => (
//                           <TableRow>
//                             <TableCell component="th" scope="row">
//                               {index + 1}
//                             </TableCell>
//                             <TableCell align="left">{item.name}</TableCell>
//                             <TableCell align="left">{this.currentDate(item.startDate, item.endDate)}</TableCell>
//                             <TableCell align="left">
//                               {Math.floor((this.currentDate(item.startDate, item.endDate) / this.totalDate()) * 100)}
//                             </TableCell>
//                             <TableCell align="left">
//                               <TextField
//                                 InputLabelProps={{ shrink: true }}
//                                 label="Tỷ trọng"
//                                 value={addProjects[item._id]}
//                                 name={item._id}
//                                 onChange={e => this.handleChange(item._id, e.target.value)}
//                               />
//                             </TableCell>
//                           </TableRow>
//                         ))}
//                         <TableRow>
//                           <TableCell align="left" />
//                           <TableCell align="left" />
//                           <TableCell align="right">
//                             <Button variant="contained" color="primary" onClick={this.onSaveRatio} a>
//                               {intl.formatMessage(messages.capnhattytrong || { id: 'capnhattytrong', defaultMessage: 'capnhattytrong' })}
//                             </Button>
//                           </TableCell>
//                           <TableCell align="left" />
//                           <TableCell align="left">{intl.formatMessage(messages.tong || { id: 'tong', defaultMessage: 'tong' })} :100</TableCell>
//                         </TableRow>
//                       </TableBody>
//                     </Table>
//                   </Grid>
//                 </Paper>
//               </div>
//             )}
//           </div>
//         </Grid>
//       </Paper>
//       <div style={{ marginTop: 25, float: 'right' }}>
//         <Button variant="contained" color="primary" style={{ marginRight: 25 }} onClick={this.onSave}>
//           {intl.formatMessage(messages.luu || { id: 'luu', defaultMessage: 'luu' })}
//         </Button>
//         <Button variant="contained" color="secondary" onClick={this.onCloseProject}>
//           {intl.formatMessage(messages.huy || { id: 'huy', defaultMessage: 'huy' })}
//         </Button>
//       </div>
//     </div>
//   );
// }

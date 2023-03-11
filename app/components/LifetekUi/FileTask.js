/* eslint-disable func-names */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-console */
/* eslint-disable no-alert */
import React, { useEffect } from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Checkbox } from '@material-ui/core';
import { CloudUpload, Folder, Add, CloudDownload } from '@material-ui/icons';
import { Dialog } from '.';
import { fetchData, isArray } from '../../helper';
import { UPLOAD_APP_URL } from '../../config/urlConfig';
import { clientId } from '../../variable';

function downloadFile(url, fileName) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'blob';
  xhr.onload = function () {
    const urlCreator = window.URL || window.webkitURL;
    const imageUrl = urlCreator.createObjectURL(this.response);
    const tag = document.createElement('a');
    tag.href = imageUrl;
    tag.download = fileName;
    document.body.appendChild(tag);
    tag.click();
    document.body.removeChild(tag);
  };
  xhr.send();
}

// const listFolder = [
//   { type: 1, name: 'Thư mục 1' },
//   { type: 1, name: 'Thư mục 2' },
//   { type: 1, name: 'Thư mục 3' },
//   { type: 1, name: 'Thư mục 4' },
//   { type: 1, name: 'Thư mục 5' },
// ];
function FileTask({ code, id, name }) {
  const [files, setFiles] = React.useState([]);
  const [list, setList] = React.useState([]);
  const [state, setState] = React.useState({ display: false, select: 0, type: 0, name: 'root', dialog: false, img: false });
  // const []
  // const [fileUpload, setFileUpload] = React.useState(null);

  async function getFiles() {
    try {
      if (!code || !id || id === 'add') return;
      const url = `${UPLOAD_APP_URL}/file-system/company?clientId=${clientId}&code=${code}&id=${id}`;
      const result = await fetchData(url, 'GET', null, 'token_03');
      const midPath = result.find(i => i.mid);
      const listFiles = result.filter(i => i.parentPath === midPath.fullPath && !i.isFile);
      if (listFiles.length) setList(listFiles);
      if (isArray(result)) setFiles(result.filter(i => i.isFile));
    } catch (error) {
      // console.log(error);
    }
  }

  // async function deleteFile(id) {
  //   const answer = confirm('Đồng chí có chắc chắc muốn xóa file này không?');
  //   if (!answer) return;
  //   try {
  //     const url = `${UPLOAD_APP_URL}/file-system/company?clientId=${clientId}&code=${code}&id=${id}`;
  //     await fetchData(url, 'DELETE', { id }, 'token_03');
  //     await getFiles();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // async function openFolder(){
  //   await fetchData(url, 'DELETE', { id }, 'token_03');
  // }

  async function uploadFile(e) {
    if (!code || !id || !name || id === 'add') return;
    const form = new FormData();
    form.append('fileUpload', e.target.files[0]);
    const url = `${UPLOAD_APP_URL}/file-system/company/Upload?clientId=${clientId}&code=${code}&mid=${id}&mname=${name}&fname=${state.name}&ftype=${state.type
      }`;
    const head = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token_03')}`,
      },
      body: form,
    };
    await fetch(url, head);
    await getFiles();
  }

  useEffect(
    () => {
      getFiles();
    },
    [code, id],
  );

  return (
    <React.Fragment>
      {' '}
      {!code || !id || !name || id === 'add' ? null : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <input onChange={uploadFile} id="fileUpload" style={{ display: 'none' }} name="fileUpload" type="file" />
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tên file</TableCell>
                <TableCell>Tải file</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {files.map(file => (
                <TableRow>
                  <TableCell>{file.name}</TableCell>
                  {/* <TableCell>{file.username}</TableCell>
                  <TableCell>{file.type}</TableCell>
                  <TableCell>
                    <Visibility
                      onClick={() => {
                        let url;
                        let img;
                        if (['.jpg', '.png', '.jpeg'].includes(file.type)) {
                          url = `${UPLOAD_APP_URL}/file-system/GetImage/${clientId}?id=${file._id}`;
                          img = true;
                        } else {
                          url = `https://docs.google.com/viewer?url=${UPLOAD_APP_URL}/file-system/GetImage/${clientId}?id=${file._id}`;
                          img = false;
                        }

                        setState({
                          ...state,
                          dialog: true,
                          url,
                          img,
                        });
                      }}
                    />
                  </TableCell> */}
                  <TableCell>
                    <CloudDownload onClick={() => downloadFile(`${UPLOAD_APP_URL}/file-system/GetImage/${clientId}?id=${file._id}`, file.name)} />
                  </TableCell>
                  {/* <TableCell>
                    <Delete onClick={() => deleteFile(file._id)} />
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {clientId === '20_CRM' && code === 'Task' ? (
            <div style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>
                  <Add style={{ fontSize: '1rem' }} onClick={() => setState({ ...state, display: !state.display })} />

                  <Folder />
                </span>
                {name} <Checkbox checked={state.select === 0} onClick={() => setState({ ...state, select: 0, type: 0 })} />
              </div>
              {state.display
                ? list.map((i, idx) => (
                  <div style={{ marginLeft: 20, display: 'flex', justifyContent: 'space-between' }}>
                    <Folder />
                    {i.name}{' '}
                    <Checkbox checked={state.select === idx + 1} onClick={() => setState({ ...state, select: idx + 1, type: 1, name: i.name })} />
                  </div>
                ))
                : null}
            </div>
          ) : null}

          <label htmlFor="fileUpload">
            <CloudUpload color="primary" />
          </label>
        </div>
      )}
      <Dialog maxWidth={false} fullScreen open={state.dialog} onClose={() => setState({ ...state, dialog: false })}>
        <div style={{ height: '1000px' }}>
          {state.img ? (
            <img alt="HHH" src={state.url} />
          ) : (
            <iframe title="Excel" src={`${state.url}&embedded=true`} width="100%" style={{ height: '100%' }} value="file" />
          )}
        </div>
      </Dialog>
    </React.Fragment>
  );
}

export default FileTask;

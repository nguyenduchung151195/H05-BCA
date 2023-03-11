
import { API_GET_FILENAME_BY_ID, API_UPLOAD_SINGLE, API_PREVIEW_TEXT_TO_PDF } from 'config/urlConfig';
import request from 'utils/request';
import { serialize } from '../../helper';
import { svb } from '../../variable';


export const getFilename = async (id) => {
    try {
        let url = `${API_GET_FILENAME_BY_ID}`;
        const newBody = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        };

        const response = await request(url, newBody);
        if (response._id) return response
    } catch (err) { }
}


export const addSingle = async (data) => {
    try {
        const formData = new FormData();
        formData.append('file', data);
        const upload = await request(API_UPLOAD_SINGLE, {
            method: 'POST',
            body: formData,
        });
        return upload.url
    } catch (err) { }
}

export const previewTextToPdf = async (body) => {
    try {
        let url = `${API_PREVIEW_TEXT_TO_PDF}`;
        const newBody = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...svb.A4,
                ...body
            }),
        };

        const res = await request(url, newBody);
        return res.data
    } catch (err) { }
}


import { API_INSERT_TEXT_TO_PDF, API_UPDATE_APOSTROPHE_STATUS, API_CHANGE_DIGITAL_SIGN } from 'config/urlConfig';
import request from 'utils/request';
import { svb } from '../../variable';


export const insertTextToPdf = async (body) => {
    try {
        let url = `${API_INSERT_TEXT_TO_PDF}`;
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

        const response = await request(url, newBody);
        return response
    } catch (err) { }
}


export const updateApostropheStatus = async (docIds) => {
    try {
        let url = `${API_UPDATE_APOSTROPHE_STATUS}`;
        const newBody = {
            method: 'POST',
            body: JSON.stringify({ docIds }),
            headers: {
                'Content-Type': 'application/json',
            }
        };

        const response = await request(url, newBody);
        return response
    } catch (err) { }
}

export const updateSignStatus = async (docIds) => {
    try {
        let url = `${API_CHANGE_DIGITAL_SIGN}/${docIds}`;
        const newBody = {
            method: 'POST',
        };

        const response = await request(url, newBody);
        return response
    } catch (err) { }
}
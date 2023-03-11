import { API_MEETING_CALEN_DETAIL, API_MEETING_RETURN_DOC, API_MEETING_UPDATE_CALEN_DETAIL, API_MEETING, API_MEETING_APPROVE, API_MEETING_PUBLISH, API_MEETING_CANLEN_RETURN_DOC } from 'config/urlConfig';
import request from 'utils/request';
import { serialize } from '../../helper';


export const addMeeting = async (body) => {
    try {
        let url = `${API_MEETING}`;
        const newBody = {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const response = await request(url, newBody);
        return response
    } catch (err) {
        return err
    }
    return null
}

export const setProcessor = async (body) => {
    try {
        let url = `${API_MEETING}/set-processor`;
        const newBody = {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const response = await request(url, newBody);
        return response
    } catch (err) { }
    return null
}

export const meetingReturnDoc = async (body) => {
    try {
        let url = `${API_MEETING_RETURN_DOC}`;
        const newBody = {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const response = await request(url, newBody);
        return response
    } catch (err) { }
    return null
}

export const meetingCalenReturnDoc = async (body) => {
    try {
        let url = `${API_MEETING_CANLEN_RETURN_DOC}`;
        const newBody = {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const response = await request(url, newBody);
        return response
    } catch (err) { }
    return null
}



export const addCalenDetail = async (body) => {
    try {
        let url = `${API_MEETING_UPDATE_CALEN_DETAIL}`;
        const newBody = {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const response = await request(url, newBody);
        return response
    } catch (err) { }
    return null
}

export const updateCalenDetail = async (id, body) => {
    try {
        let url = `${API_MEETING_UPDATE_CALEN_DETAIL}/${id}`;
        const newBody = {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const response = await request(url, newBody);
        console.log(response, "response")
        return response
    } catch (err) { }
    return null
}

export const sendProcessor = async (body) => {
    try {
        let url = `${API_MEETING_UPDATE_CALEN_DETAIL}/set-processor`;
        const newBody = {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const response = await request(url, newBody);
        return response
    } catch (err) { console.log(err) }
    return null
}

export const sendApprove = async (body) => {
    try {
        let url = `${API_MEETING_APPROVE}`;
        const newBody = {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const response = await request(url, newBody);
        return response
    } catch (err) { console.log(err) }
    return null
}
export const sendPublish = async (body) => {
    try {
        let url = `${API_MEETING_PUBLISH}`;
        const newBody = {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const response = await request(url, newBody);
        return response
    } catch (err) { console.log(err) }
    return null
}

export const getById = async (filter) => {
    try {
        let url = `${API_MEETING_CALEN_DETAIL}?${serialize(filter)}`;
        const body = { method: 'GET' };
        const response = await request(url, body);
        if (Array.isArray(response)) return response
    } catch (err) { }
    return {}
}

export const getAll = async () => {
    try {
        let url = `${API_MEETING_CALEN_DETAIL} `;
        const body = { method: 'GET' };
        const response = await request(url, body);
        if (response) return response
    } catch (err) { }
    return {}
}

export const deleteById = async (ids) => {
    try {
        let url = `${API_MEETING_UPDATE_CALEN_DETAIL} `;
        const body = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ids })
        };

        const response = await request(url, body);
        if (response) return response
    } catch (err) { }
    return {}
}

import { API_OAUTH_GET_TOKEN_INFO, API_OAUTH_GET_USER } from 'config/urlConfig';
import request from 'utils/request';
import { serialize } from '../../helper';

export const getTokenInfo = async (body) => {
    try {
        let url = `${API_OAUTH_GET_TOKEN_INFO}?${serialize(body)}`;
        const newBody = {
            method: 'GET',
            // body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const response = await request(url, newBody);
        if (response.emailToken) return response
    } catch (err) { }
    return {}
}

export const getUser = async (body) => {
    try {
        let url = `${API_OAUTH_GET_USER}?${serialize(body)}`;
        const newBody = {
            method: 'GET',
            // body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const res = await request(url, newBody);
        if (res.username && res.password) return res
    } catch (err) { }
}
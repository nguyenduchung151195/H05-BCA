import { API_USERS_UPDATE_INFO, API_UPDATE_APOSTROPHE_STATUS } from 'config/urlConfig';
import request from 'utils/request';
import { serialize } from '../../helper';

export const updateInfo = async (body) => {
    try {
        let url = `${API_USERS_UPDATE_INFO}`;
        const newBody = {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                // Authorization: `Bearer bdb8bbcce1db415004e46f32f5243d17e8dfdc5c`
            }
        };

        const response = await request(url, newBody);
        return response
    } catch (err) { }
}
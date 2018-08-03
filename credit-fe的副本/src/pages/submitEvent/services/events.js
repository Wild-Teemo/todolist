import request from '../../../utils/request';
import { PAGE_SIZE } from '../components/constants';
import requests from '../../../utils/postRequest';

export function fetch({ page = 1, params }) {
    return request(
        `/credit/events/my/report?pageNum=${page}&pageRow=${PAGE_SIZE}${params}`
    );
}


export function postForm(payload) {
    let options = {
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
        method: 'POST'
    };

    return requests('/credit/event', options);
}

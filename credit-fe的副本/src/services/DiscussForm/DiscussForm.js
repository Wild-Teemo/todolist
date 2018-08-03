import request from '../../utils/request';
import requests from '../../utils/postRequest';
// let url = window.location.origin+ '/api/user/search?keywords=';
// let token = localStorage.getItem('token');
export function fetch() {
    return request('/users');
}

export function getCommentList(payload) {
    let targetUrl = '/credit/event/comment/' + payload;
    let opts = { headers: { 'content-type': 'application/json' } };
    return request(targetUrl, opts);
}

export function addComment(payload) {
    let targetUrl = '/credit/events/comment';
    let opts = {
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
        method: 'POST'
    };
    return requests(targetUrl, opts);
}

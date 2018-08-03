import request from '../../../utils/request';

export function getAuditUser() {
    return request('/credit/audit/user', {
        headers: { 'content-type': 'application/json' }
    });
}

export function deleteAuditUser(payload) {
    let targetUrl = '/credit/audit/user/' + payload;
    let opts = {
        method: 'DELETE',
        headers: {
            'content-type': 'application/json'
        }
    };
    return request(targetUrl, opts);
}

export function addAuditUser(payload) {
    let targetUrl = '/credit/audit/user/' + payload;
    let opts = {
        body: payload,
        method: 'PUT',
        headers: {
            'content-type': 'text/html'
        }
    };
    return request(targetUrl, opts);
}

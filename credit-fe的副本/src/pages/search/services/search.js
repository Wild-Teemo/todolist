import request from '../../../utils/request';

export function fetchMember(searchKey) {
    return request(`/user/search?keywords=${searchKey.searchKey.searchKey}`);
}

export function fetchEventAdd(params) {
    return request(`/credit/events/${params.keyword}/bonus`);
}

export function fetchEventMinus(params) {
    return request(`/credit/events/${params.keyword}/minus`);
}

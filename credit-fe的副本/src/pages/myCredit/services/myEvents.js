import request from '../../../utils/request';
export function fetchMyAddEvent() {
    return request('/credit/events/my/bonus');
}

export function fetchMyMinusEvent() {
    return request('/credit/events/my/minus');
}

export function fetchAboutMeAddEvent() {
    return request('/credit/events/my/relation/bonus');
}

export function fetchAboutMeMinusEvent() {
    return request('/credit/events/my/relation/minus');
}

import request from '../../../utils/request';
import { _getUrl } from '../../../utils/mytool';
import requests from '../../../utils/postRequest';

const targetUrl = '/credit/events/my/audit/unarchive';

//邀请评分人组件中模糊查询用户 @parm String keywords
// @auth wency0
export function seachUsers(keywords) {
    return request(`/user/search?keywords=${keywords}`, {
        method: 'GET',
        body: {},
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
//邀请评分人请求 @parm String email,@parm Integer eventId
//@auth wency0
export function sendInvite(payload) {
    let options = {
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
        method: 'PUT'
    };

    return requests('/credit/audit/invition', options);
}

// 已评分
export function _getData(payload = {}) {
    // console.log(payload);
    // let url = _getUrl('/credit/events/my/audit/archive', obj);
    const params = Object.keys(payload)
        .filter(key => payload[key] !== undefined && payload[key] !== '')
        .map(key => `${key}=${payload[key]}`)
        .join('&');
    const paramsUrl = params
        ? `/credit/events/my/audit/archive?${params}`
        : '/credit/events/my/audit/archive';
    return request(paramsUrl);
}

export function getAuditMsg(payload) {
    // const {
    //     auditStatus,
    //     pageNum,
    //     pageRow,
    //     startDate,
    //     searchId,
    //     endDate
    // } = payload;
    // let paramsUrl =
    //     targetUrl +
    //     '?auditStatus=' +
    //     auditStatus +
    //     '&pageNum=' +
    //     pageNum +
    //     '&pageRow=' +
    //     pageRow +
    //     '&startDate=' +
    //     startDate +
    //     '&searchId=' +
    //     searchId +
    //     '&endDate=' +
    //     endDate;
    // 去除硬编码
    const params = Object.keys(payload)
        .filter(key => payload[key] !== undefined && payload[key] !== '')
        .map(key => `${key}=${payload[key]}`)
        .join('&');
    const paramsUrl = params ? `${targetUrl}?${params}` : targetUrl;
    return request(paramsUrl);
}

// 获取已评分成就
export function _getHasAuditedEvent(eventID) {
    return request(`/credit/event/${eventID}`);
}

// 提交
export function _submitAudited(obj) {
    let opts = {
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(obj),
        method: 'POST'
    };
    return requests('/credit/audit/info', opts);
}

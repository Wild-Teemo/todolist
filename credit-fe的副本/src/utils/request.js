import fetch from 'dva/fetch';
import { API } from './config';
import { message } from 'antd';
import redirectHome from './redirect';

sessionStorage.token =
    new URL(window.location).searchParams.get('token') ||
    sessionStorage.token ||
    '';

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default async function request(url, options = { headers: {} }) {
    Object.assign(options.headers, {
        Authorization: `Bearer ${sessionStorage.token}`
    });

    const response = await fetch(`${API}${url}`, options);

    if (response.status < 200 || response.status > 299) {
        message.config({
            top: '90%',
            maxCount: 2
        });

        if (response.status === 401 && sessionStorage.token !== '') {
            sessionStorage.removeItem('token');
            message.info(
                '您的token已过期，5秒后自动跳转到首页以重新获取最新的token，请重新操作！',
                5,
                redirectHome
            );
            return;
        }

        let error = new Error(response.statusText);

        error.response = response;

        throw error;
    }

    var data = await response.json();

    if (!data.success) {
        let error = new URIError(data.message);

        error.code = data.code;

        throw error;
    }

    return data.data instanceof Array ? data : data.data;
}

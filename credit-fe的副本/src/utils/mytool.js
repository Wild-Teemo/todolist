// get拼接地址
export function _getUrl(url, obj) {
    if (Object.prototype.toString.call(obj) === '[object Object]') {
        if (Object.keys(obj).length !== 0) {
            url += '?';
            for (let k in obj) {
                url += `${k}=${obj[k]}&`;
            }
            return url.substring(0, url.length - 1);
        } else {
            return url;
        }
    } else {
        throw new Error('参数obj is not Object');
    }
}

// 评审结果 计算属性
export function changeScore(num) {
    switch (num) {
        case 0:
            return '评分中';
        case 1:
            return '大';
        case 2:
            return '中';
        case 3:
            return '小';
        case 4:
            return '无效';
        case 5:
            return '弃权';
        default:
            return '未定义';
    }
}

// 格式化时间
export function formatDate(fmt, date) {
    var o = {
        'M+': date.getMonth() + 1, //月份
        'd+': date.getDate(), //日
        'h+': date.getHours(), //小时
        'm+': date.getMinutes(), //分
        's+': date.getSeconds(), //秒
        'q+': Math.floor((date.getMonth() + 3) / 3), //季度
        S: date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(
            RegExp.$1,
            (date.getFullYear() + '').substr(4 - RegExp.$1.length)
        );
    for (var k in o)
        if (new RegExp('(' + k + ')').test(fmt))
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length === 1
                    ? o[k]
                    : ('00' + o[k]).substr(('' + o[k]).length)
            );
    return fmt;
}

// 处理时间 xx年xx月 =>   xx-xx
export function updateDate(date) {
    let str = date.replace(/[\u4e00-\u9fa5]/g, '-');
    return str.substring(0, str.length);
}

// 合并 评分返回索引
export function score2Index(num) {
    switch (num) {
        case '大':
            return 0;
        case '中':
            return 1;
        case '小':
            return 2;
        case '无效':
            return 3;
        case '弃权':
            return 4;
        default:
            return -1;
    }
}

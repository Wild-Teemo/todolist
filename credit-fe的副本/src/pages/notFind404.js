import React from 'react';
import notFindImg from '../assets/images/404.png';
function NotFind(props) {
    return (
        <div
            style={{
                textAlign: 'center',
                background: '#FFFFFF',
                width: '100vw',
                height: '100vh',
                paddingTop: 203
            }}
        >
            <p style={{ color: '#F18D55', fontSize: '40px' }}>
                糟糕，出错了！&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </p>
            <img src={notFindImg} alt="" />
            <p style={{ color: '#333333', fontSize: '20px' }}>
                你访问的页面不存在或已被删除
            </p>
        </div>
    );
}

export default NotFind;

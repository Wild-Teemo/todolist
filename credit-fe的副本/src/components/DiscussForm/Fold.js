import React from 'react';
import { Icon } from 'antd';

export default function(props) {
    return props.fold ? (
        <span style={props.style}>
            展开所有评论
            <Icon type="down" style={{ marginLeft: 7 }} />
        </span>
    ) : (
        <span style={props.style}>
            收起所有评论
            <Icon type="up" style={{ marginLeft: 7 }} />
        </span>
    );
}

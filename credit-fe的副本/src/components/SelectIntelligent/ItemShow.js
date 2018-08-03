import React from 'react';
const ItemShow = props => {
    let department = props.userdata.departName;
    // console.log(department)
    if (department !== null && department.indexOf('-') > -1) {
        let indexParam = department.indexOf('-');
        department = department.substring(0, indexParam);
    }
    return (
        <div userdata={props.userdata}>
            <span className="itemName">{props.userdata.name}</span>
            &nbsp;
            <span className="itemDesc">
                {props.userdata.career ? props.userdata.career : ''}
                {!props.userdata.career || !department ? '' : '/'}
                {department ? department : ''}
            </span>
        </div>
    );
};

export default ItemShow;

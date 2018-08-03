import React from 'react';

const ItemShow = props => {
    let department = props.department;
    if (department !== null && department.indexOf('-') > -1) {
        let indexParam = department.indexOf('-');
        department = department.substring(0, indexParam);
    }
    return (
        <div>
            <span className="itemName">{props.name}</span>
            &nbsp;
            {props.showDetail && (
                <span style={props.style} className="itemDesc">
                    {props.position ? props.position : ''}
                    {!props.position || !department ? '' : '/'}
                    {department ? department : ''}
                </span>
            )}
        </div>
    );
};

export default ItemShow;

import React from 'react';
import Unaudited from './components/Unaudited';

export default ({ location }) => {
    /*let showViCard = (e) => {
        this.props.dispatch({
            type: 'audit/save',
            payload: {showVisitCard: ''}
        })
    }*/
    return (
        <div
            className="card-container"
            style={{ marginTop: 25, padding: '0 50px' }}
        >
            <Unaudited />
        </div>
    );
};

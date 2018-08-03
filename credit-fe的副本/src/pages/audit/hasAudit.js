import React from 'react';
import HasAudited from './components/HasAudited';

export default ({ location }) => {
    return (
        <div
            className="card-container"
            style={{ marginTop: 25, padding: '0 50px' }}
        >
            <HasAudited />
        </div>
    );
};

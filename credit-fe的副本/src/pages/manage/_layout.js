import React from 'react';
import { Layout } from 'antd';
import Header from './Header';

function Layouter({ children, location }) {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header location={location} />
            <div>
                <div>{children}</div>
            </div>
        </Layout>
    );
}

export default Layouter;

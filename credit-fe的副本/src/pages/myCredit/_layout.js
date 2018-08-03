import React from 'react';
import withRouter from 'umi/withRouter';
import { Layout } from 'antd';
import Header from './Header';
import styles from './index.css';

function Layouter({ children, location }) {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header location={location} />
            <div className={styles.content}>
                <div className={styles.main}>{children}</div>
            </div>
        </Layout>
    );
}

export default withRouter(Layouter);

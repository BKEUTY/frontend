
import React from 'react';
import { Empty } from 'antd';

const Placeholder = ({ title }) => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', flexDirection: 'column' }}>
        <Empty description={`${title} Management Module`} />
        <p>This feature mock-up is under development.</p>
    </div>
);

export default Placeholder;

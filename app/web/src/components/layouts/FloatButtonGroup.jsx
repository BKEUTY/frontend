import React from 'react';
import { FloatButton } from 'antd';
import { MessageOutlined } from '@ant-design/icons';

const FloatButtonGroup = ({ onChatOpen }) => {
  return (
    <FloatButton.Group style={{ right: 24, bottom: 24 }}>
      <FloatButton.BackTop visibilityHeight={400} />
      <FloatButton 
        icon={<MessageOutlined />} 
        type="primary"
        onClick={onChatOpen}
        tooltip={<div>Bkeuty AI Assistant</div>}
      />
    </FloatButton.Group>
  );
};

export default FloatButtonGroup;

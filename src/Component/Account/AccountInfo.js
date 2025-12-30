import React, { useRef, useState } from 'react';
import './Account.css';

const AccountInfo = ({ onUpdate }) => {
    // Using refs or state to handle form data. For simplicity, just unmanaged inputs 
    // or mocks as requested visuals are main focus.

    // Hardcoded initial values based on image
    const [avatar, setAvatar] = useState(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setAvatar(URL.createObjectURL(e.target.files[0]));
        }
    };

    return (
        <div>
            <div className="info-header">
                <h2>Thông tin tài khoản</h2>
                <span className="premium-badge">PREMIUM</span>
            </div>
            <p className="greeting-text">Chào Thanh Phong,</p>

            <div className="info-form-layout">
                <div className="form-fields">
                    <div className="form-group">
                        <label>Tên của bạn</label>
                        <input type="text" className="form-input" defaultValue="Thanh Phong" />
                    </div>
                    <div className="form-group">
                        <label>Giới tính</label>
                        <select className="form-select" defaultValue="Nam">
                            <option value="Nam">Nam</option>
                            <option value="Nu">Nữ</option>
                            <option value="Khac">Khác</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" className="form-input" defaultValue="phongdeptrai28@gmail.com" />
                    </div>
                    <div className="form-group">
                        <label>SĐT</label>
                        <input type="tel" className="form-input" defaultValue="0376929681" />
                    </div>
                    <div className="form-group">
                        <label>Ngày sinh</label>
                        <input type="date" className="form-input" defaultValue="2004-08-28" />
                    </div>
                    <div className="form-group">
                        <label>Địa chỉ</label>
                        <input type="text" className="form-input" defaultValue="xã Long Phước, tỉnh Đồng Nai" />
                    </div>
                    <div className="form-group full-width">
                        <label>Ngày tham gia: 20/10/2025</label>
                    </div>

                    <button className="button" style={{ marginTop: '20px', width: 'fit-content' }} onClick={onUpdate}>Cập nhật thông tin</button>
                </div>

                <div className="avatar-section">
                    <div className="avatar-preview">
                        {avatar ? <img src={avatar} alt="Avatar" /> : <div style={{ width: '100%', height: '100%', background: '#eee' }}></div>}
                    </div>
                    <label className="button" style={{ fontSize: '14px', padding: '10px 20px', cursor: 'pointer', textAlign: 'center' }}>
                        Cập nhật ảnh đại diện
                        <input type="file" hidden onChange={handleFileChange} accept="image/*" />
                    </label>
                </div>
            </div>
        </div>
    );
};
export default AccountInfo;

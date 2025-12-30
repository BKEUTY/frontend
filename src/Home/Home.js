import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import hero_bg from '../Assets/Images/Banners/blog image.svg';

const Home = () => {
    return (
        <div className="home-container">
            <section className="hero-section" style={{ backgroundImage: `url("${hero_bg}")` }}>
                <div className="hero-overlay"></div>

                {/* Visual arrows to mimic carousel */}
                <button className="carousel-arrow arrow-left">❮</button>
                <button className="carousel-arrow arrow-right">❯</button>

                <div className="hero-content">
                    <h1 className="hero-title">
                        Chào Mừng Đến Với <span className="hero-brand">BKEUTY</span>
                    </h1>

                    <div className="hero-buttons">
                        <Link to="/login" className="btn-hero-primary">
                            Đăng Nhập
                        </Link>

                        <div className="link-hero-text">
                            Chưa có tài khoản? <Link to="/register" className="link-hero-secondary">Đăng Ký</Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;

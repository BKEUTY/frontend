import React, { useState, useEffect, useRef } from 'react';
import './SearchBar.css';
import searchIcon from '../../Assets/Images/Icons/icon_search.svg'; // Assuming this exists or I'll use text 

const MOCK_SUGGESTIONS = [
    "Sữa Chống Nắng Anessa",
    "Nước Hoa Hồng Obagi",
    "Kem Dưỡng Ẩm Neutrogena",
    "Son Mac Ruby Woo",
    "Phấn Phủ Innisfree",
    "Serum Vitamin C La Roche-Posay"
];

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleInput = (e) => {
        const val = e.target.value;
        setQuery(val);

        if (val.length > 0) {
            const filtered = MOCK_SUGGESTIONS.filter(item =>
                item.toLowerCase().includes(val.toLowerCase())
            );
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    return (
        <div className="search-bar-modern" ref={wrapperRef}>
            <div className="input-group">
                <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={query}
                    onChange={handleInput}
                    onFocus={() => query.length > 0 && setShowSuggestions(true)}
                />
                <button className="search-button">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </button>
            </div>

            {showSuggestions && suggestions.length > 0 && (
                <ul className="suggestions-list">
                    {suggestions.map((item, index) => (
                        <li key={index} onClick={() => {
                            setQuery(item);
                            setShowSuggestions(false);
                        }}>
                            <span className="search-icon-small">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                            </span>
                            {item}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchBar;

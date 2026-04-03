import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import useClickOutside from '../../hooks/useClickOutside';
import { useDebounce } from '../../hooks/useDebounce';
import { SearchOutlined } from '@ant-design/icons';
import './SearchBar.css';

const MOCK_SUGGESTIONS = [
    "Sữa Chống Nắng Anessa",
    "Nước Hoa Hồng Obagi",
    "Kem Dưỡng Ẩm Neutrogena",
    "Son Mac Ruby Woo",
    "Phấn Phủ Innisfree",
    "Serum Vitamin C La Roche-Posay"
];

const SearchBar = () => {
    const { t } = useLanguage();
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef(null);

    useClickOutside(wrapperRef, () => setShowSuggestions(false));

    const debouncedQuery = useDebounce(query, 500);

    useEffect(() => {
        if (debouncedQuery.length > 0) {
            const filtered = MOCK_SUGGESTIONS.filter(item =>
                item.toLowerCase().includes(debouncedQuery.toLowerCase())
            );
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    }, [debouncedQuery]);

    const handleInput = (e) => {
        setQuery(e.target.value);
    };

    return (
        <div className="search-bar-modern" ref={wrapperRef}>
            <div className="input-group">
                <input
                    type="text"
                    placeholder={t('search_placeholder')}
                    value={query}
                    onChange={handleInput}
                    onFocus={() => query.length > 0 && setShowSuggestions(true)}
                />
                <button className="search-button">
                    <SearchOutlined style={{ fontSize: '18px', color: '#c2185b' }} />
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
                                <SearchOutlined style={{ fontSize: '14px', color: '#999' }} />
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


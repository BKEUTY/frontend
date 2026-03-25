import "./Product.css";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageContext";
import { Skeleton, Pagination, ProductCard, CButton } from "../../Component/Common";
import { SearchOutlined, MenuOutlined, DownOutlined } from '@ant-design/icons';
import productApi from "../../api/productApi";
import useClickOutside from "../../hooks/useClickOutside";
import { useDebounce } from "../../hooks/useDebounce";
import { useProducts } from "../../hooks/useProducts";

export default function Product() {
  const { t, language } = useLanguage();
  const dropdownRef = useRef(null);
  const pageSize = 20;

  const [categories, setCategories] = useState([]);
  const [isMobileCatOpen, setIsMobileCatOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [isPaginationMode, setIsPaginationMode] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('default');
  const [activeCategory, setActiveCategory] = useState(null);

  const debouncedSearch = useDebounce(searchTerm, 500);
  const { products, isLoading, error, totalPages, fetchProducts } = useProducts(pageSize);

  useClickOutside(dropdownRef, () => setIsMobileCatOpen(false));

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await productApi.getCategories();
        if (res.data) setCategories(res.data);
      } catch (err) {}
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    setPage(0);
    const isFiltering = debouncedSearch.length > 0 || activeCategory !== null;
    setIsPaginationMode(isFiltering);
    fetchProducts(0, false, debouncedSearch, activeCategory, sortOption);
  }, [debouncedSearch, activeCategory, sortOption, fetchProducts]);

  const handleCategorySelect = (id) => {
    setActiveCategory(id);
    setIsMobileCatOpen(false);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(nextPage, true, debouncedSearch, activeCategory, sortOption);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchProducts(newPage, false, debouncedSearch, activeCategory, sortOption);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = () => {
    setIsPaginationMode(true);
    setPage(0);
    fetchProducts(0, false, searchTerm, activeCategory, sortOption);
  };

  const getCurrentCategoryName = () => {
    if (!activeCategory) return t('all_products');
    const cat = categories.find(c => c.id === activeCategory);
    return cat ? cat.categoryName : t('all_products');
  };

  return (
    <main className="product-page-wrapper">
      <div className="product-top-bar">
        <div className="top-bar-left">
          <div className="cat-dropdown-container" ref={dropdownRef}>
            <div 
              className="cat-dropdown-trigger"
              onClick={() => setIsMobileCatOpen(!isMobileCatOpen)}
            >
              <MenuOutlined className="menu-icon" />
              <span>{t('categories')}</span>
              <DownOutlined className={`arrow-icon ${isMobileCatOpen ? 'open' : ''}`} />
            </div>

            <div className={`cat-mega-menu ${isMobileCatOpen ? 'mobile-open' : ''}`}>
              <div className="mega-grid">
                <div
                  className={`mega-item ${activeCategory === null ? 'active' : ''}`}
                  onClick={() => handleCategorySelect(null)}
                >
                  {t('all_products')}
                </div>
                {categories.map(cat => (
                  <div
                    key={cat.id}
                    className={`mega-item ${activeCategory === cat.id ? 'active' : ''}`}
                    onClick={() => handleCategorySelect(cat.id)}
                  >
                    {cat.categoryName}
                  </div>
                ))}
              </div>
              <div className="mega-promo">
                <div className="promo-badge">HOT DEAL</div>
                <h4>{t('mega_promo_title')}</h4>
                <p>{t('mega_promo_desc')}</p>
                <Link to="/product" className="promo-link">{t('explore_more')}</Link>
              </div>
            </div>
          </div>
          
          <div className="quick-links">
            <span className="quick-link-item">{t('best_sellers')}</span>
            <span className="quick-link-item">{t('hot_deals')}</span>
            <span className="quick-link-item">{t('new_arrivals')}</span>
          </div>
        </div>

        <div className="prod-search-bar-wrapper">
          <button className="prod-search-btn" onClick={handleSearchSubmit}>
            <SearchOutlined className="prod-search-icon" />
          </button>
          <input
            type="text"
            placeholder={t('search_hint')}
            className="prod-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
          />
        </div>
      </div>

      <div className="product-page">
        <div className="product-container">
          <section className="product-main-content">
            <div className="product-header-bar product-header-flex">
              <div className="product-breadcrumb">
                <span className="current">{getCurrentCategoryName()}</span>
                <span className="count-badge">({products.length}{!isPaginationMode && products.length > 0 ? '+' : ''})</span>
              </div>
              <div className="product-sort">
                <select 
                  value={sortOption} 
                  onChange={handleSortChange}
                  className="sort-select"
                >
                  <option value="default">{t('default_sort')}</option>
                  <option value="price_asc">{t('price_low_high')}</option>
                  <option value="price_desc">{t('price_high_low')}</option>
                </select>
              </div>
            </div>

            {isLoading && page === 0 ? (
              <div className="product-grid">
                {Array(10).fill(0).map((_, i) => (
                  <div key={i} className="product-card-skeleton" >
                    <Skeleton width="100%" height="220px" />
                    <div className="skeleton-info-wrap">
                      <Skeleton width="40%" height="15px" className="skeleton-line-1" />
                      <Skeleton width="90%" height="20px" className="skeleton-line-2" />
                      <Skeleton width="60%" height="20px" className="skeleton-line-3" />
                      <Skeleton width="100%" height="40px" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="no-products">{t(error)}</div>
            ) : products.length === 0 ? (
              <div className="no-products">{t('no_products_found')}</div>
            ) : (
              <>
                <div className="product-grid">
                  {products.map((product, idx) => (
                    <ProductCard
                      key={`${product.productId || product.id}-${idx}`}
                      product={product}
                      t={t}
                      language={language}
                      onClickData={{
                          category: getCurrentCategoryName(),
                          from: '/product'
                      }}
                    />
                  ))}
                </div>

                <div className="pagination-wrapper-container">
                  {!isPaginationMode ? (
                    <div className="load-more-container">
                      {isLoading && page > 0 ? (
                        <p>{t('loading')}</p>
                      ) : (
                        page < totalPages - 1 && (
                          <CButton type="outline" onClick={handleLoadMore}>
                            {t('load_more')}
                          </CButton>
                        )
                      )}
                    </div>
                  ) : (
                    <Pagination
                      page={page}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  )}
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

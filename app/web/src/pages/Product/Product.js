import "./Product.css";
import { useEffect, useState, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageContext";
import Skeleton from "../../Component/Common/Skeleton";
import ProductCard from "../../Component/Common/ProductCard";
import Pagination from "../../Component/Common/Pagination";
import { SearchOutlined, MenuOutlined, DownOutlined } from '@ant-design/icons';
import productApi from "../../api/productApi";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobileCatOpen, setIsMobileCatOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isPaginationMode, setIsPaginationMode] = useState(false);
  const pageSize = 20;

  const [searchTerm, setSearchTerm] = useState('');
  const { t, language } = useLanguage();

  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await productApi.getCategories();
        if (res.data) {
          setCategories(res.data);
        }
      } catch (err) {
        setError(t('api_error_fetch_categories') || 'Failed to fetch categories');
      }
    };
    fetchCategories();
  }, [t]);

  const fetchProducts = useCallback((pageIndex, append, catId = activeCategory) => {
    setIsLoading(true);
    setError(null);
    const params = { page: pageIndex, size: pageSize };
    if (searchTerm) params.name = searchTerm;
    if (catId) params.categoryId = catId;

    productApi.getAll(params)
      .then((res) => {
        const data = res.data;
        let rawContent = data.content || [];

        const filteredContent = rawContent.filter(product => {
          if (!product.variants || product.variants.length === 0) {
            return (product.price > 0 || product.minPrice > 0) && (product.stockQuantity > 0 || product.totalStock > 0);
          }
          return product.variants.some(v => v.price > 0 && v.stockQuantity > 0);
        });

        if (append) {
          setProducts(prev => [...prev, ...filteredContent]);
        } else {
          setProducts(filteredContent);
        }
        setTotalPages(data.totalPages);
      })
      .catch(() => {
        setError(t('api_error_fetch_products'));
      })
      .finally(() => {
        setTimeout(() => setIsLoading(false), 500);
      });
  }, [searchTerm, activeCategory, t]);

  useEffect(() => {
    setPage(0);
    setIsPaginationMode(false);
    fetchProducts(0, false);
  }, [fetchProducts]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMobileCatOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCategorySelect = (id) => {
    setActiveCategory(id);
    setPage(0);
    setError(null);
    setIsPaginationMode(true);
    setIsMobileCatOpen(false);
    fetchProducts(0, false, id);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(nextPage, true);
  };

  const handleSearchSubmit = () => {
    setIsPaginationMode(true);
    setPage(0);
    setError(null);
    fetchProducts(0, false);
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
            <SearchOutlined style={{ fontSize: '18px', color: '#c2185b' }} />
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
            <div className="product-header-bar">
              <div className="product-breadcrumb">
                <span className="current">{getCurrentCategoryName()}</span>
                <span className="count-badge">({products.length}{!isPaginationMode && products.length > 0 ? '+' : ''})</span>
              </div>
            </div>

            {isLoading && page === 0 ? (
              <div className="product-grid">
                {Array(10).fill(0).map((_, i) => (
                  <div key={i} className="product-card-skeleton">
                    <Skeleton width="100%" height="220px" />
                    <div style={{ padding: '20px' }}>
                      <Skeleton width="40%" height="15px" style={{ marginBottom: '5px' }} />
                      <Skeleton width="90%" height="20px" style={{ marginBottom: '10px' }} />
                      <Skeleton width="60%" height="20px" style={{ marginBottom: '15px' }} />
                      <Skeleton width="100%" height="40px" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="no-products">{t('api_error_fetch_products')}</div>
            ) : products.length === 0 ? (
              <div className="no-products">{t('no_products_found')}</div>
            ) : (
              <>
                <div className="product-grid">
                  {products.map((product, idx) => (
                    <ProductCard
                      key={`${product.productId}-${idx}`}
                      product={product}
                      t={t}
                      language={language}
                    />
                  ))}
                </div>

                <div className="pagination-wrapper-container">
                  {!isPaginationMode ? (
                    <div style={{ textAlign: 'center', marginTop: '30px' }}>
                      {isLoading && page > 0 ? (
                        <p>{t('loading')}</p>
                      ) : (
                        page < totalPages - 1 && (
                          <button className="btn-view-more" onClick={handleLoadMore}>
                            {t('load_more')}
                          </button>
                        )
                      )}
                    </div>
                  ) : (
                    <Pagination
                      page={page}
                      totalPages={totalPages}
                      onPageChange={(newPage) => {
                        setPage(newPage);
                        fetchProducts(newPage, false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
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

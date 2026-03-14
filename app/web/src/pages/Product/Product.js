import "./Product.css";
import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageContext";
import Skeleton from "../../Component/Common/Skeleton";
import ProductCard from "../../Component/Common/ProductCard";
import Pagination from "../../Component/Common/Pagination";
import {
  SearchOutlined,
  MenuOutlined,
  DownOutlined,
  ExperimentOutlined,
  SmileOutlined,
  ThunderboltOutlined,
  SafetyOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import productApi from "../../api/productApi";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [isMobileCatOpen, setIsMobileCatOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isPaginationMode, setIsPaginationMode] = useState(false);
  const pageSize = 20;

  const [searchTerm, setSearchTerm] = useState('');

  const { t, language } = useLanguage();


  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await productApi.getCategories();
      if (res.data) {
        setCategories(res.data);
      }
    } catch (err) {
      console.error("Fetch categories error:", err);
      setError(true);
    }
  }, []);

  const fetchProducts = useCallback((pageIndex, append, catId = activeCategory) => {
    setIsLoading(true);
    setError(null);
    const params = { page: pageIndex, size: pageSize };
    if (searchTerm) params.name = searchTerm;
    if (catId) params.categoryId = catId;

    productApi.getAll(params)
      .then((res) => {
        const data = res.data;
        let newContent = data.content || [];

        if (append) {
          setProducts(prev => [...prev, ...newContent]);
        } else {
          setProducts(newContent);
        }
        setTotalPages(data.totalPages);
      })
      .catch((err) => {
        console.error(err);
        setError(true);
      })
      .finally(() => {
        setTimeout(() => setIsLoading(false), 500);
      });
  }, [searchTerm, activeCategory]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    setPage(0);
    setIsPaginationMode(false);
    fetchProducts(0, false);
  }, [fetchProducts]);

  const handleCategorySelect = (id) => {
    setActiveCategory(id);
    setPage(0);
    setError(null);
    setIsPaginationMode(true);
    fetchProducts(0, false, id);
    setIsMobileCatOpen(false);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(nextPage, true);
  };

  const handleResetFilter = () => {
    setIsPaginationMode(true);
    setPage(0);
    fetchProducts(0, false);
  };

  const handleSearchSubmit = () => {
    setIsPaginationMode(true);
    setPage(0);
    setError(null);
    fetchProducts(0, false);
  };




  return (
    <main className="product-page-wrapper">
      <div className="category-bar">
        <div
          className="prod-mobile-cat-header"
          onClick={() => setIsMobileCatOpen(!isMobileCatOpen)}
        >
          <span><MenuOutlined /> {t('categories')}</span>
          <span className={`arrow ${isMobileCatOpen ? 'open' : ''}`}><DownOutlined /></span>
        </div>

        <div className={`category-list ${isMobileCatOpen ? 'mobile-open' : ''}`}>
          <div className="cat-item cancel-hover">
            <span className="cat-trigger"><MenuOutlined /> {t('categories')} Prime</span>
            <div className="mega-menu">
              <div className="mega-menu-left">
                <div className="mega-column">
                  <h3>{t('all_categories')}</h3>
                  <div 
                    onClick={() => {
                      setActiveCategory(null);
                      handleResetFilter();
                    }} 
                    className={`mega-item ${activeCategory === null ? 'active' : ''}`}
                    style={{ cursor: 'pointer' }}
                  >
                    {t('all_products')}
                  </div>
                  {categories.map(cat => (
                    <div 
                      key={cat.id} 
                      onClick={() => handleCategorySelect(cat.id)} 
                      className={`mega-item ${activeCategory === cat.id ? 'active' : ''}`}
                      style={{ cursor: 'pointer' }}
                    >
                      {cat.categoryName}
                    </div>
                  ))}
                </div>
              </div>
              <div className="mega-menu-right">
                <div className="mega-promo-card">
                  <div className="promo-tag">MEGA SALE</div>
                  <h4>{t('mega_promo_title')}</h4>
                  <p>{t('mega_promo_desc')}</p>
                  <Link to="/product" className="promo-btn">{t('buy_now')}</Link>
                </div>
              </div>
            </div>
          </div>
          <span className="cat-item">{t('brands')}</span>
          <span className="cat-item">{t('best_sellers')}</span>
          <span className="cat-item">{t('hot_deals')}</span>
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
                <span className="current">{t('all_products')}</span>
                <span className="count-badge">({products.length}{isPaginationMode ? '' : '+'})</span>
              </div>
            </div>

            {isLoading && page === 0 ? (
              <div className="product-grid">
                {Array(10).fill(0).map((_, i) => (
                  <div key={i} className="product-card">
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
                        window.scrollTo(0, 0);
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

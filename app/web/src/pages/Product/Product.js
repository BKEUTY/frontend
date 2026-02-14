import "./Product.css";
import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageContext";
import Skeleton from "../../Component/Common/Skeleton";
import ProductCard from "../../Component/Common/ProductCard";
import Pagination from "../../Component/Common/Pagination";
import search_image from "../../Assets/Images/Icons/icon_search.svg";
import productApi from "../../api/productApi";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [isMobileCatOpen, setIsMobileCatOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isPaginationMode, setIsPaginationMode] = useState(false);
  const pageSize = 20;

  const [searchTerm, setSearchTerm] = useState('');

  const { t, language } = useLanguage();


  const fetchProducts = useCallback((pageIndex, append) => {
    setIsLoading(true);
    productApi.getAll({ page: pageIndex, size: pageSize })
      .then((res) => {
        const data = res.data;
        let newContent = data.content || [];

        if (searchTerm) {
          newContent = newContent.filter(p => {
            return p.name.toLowerCase().includes(searchTerm.toLowerCase());
          });
        }

        if (append) {
          setProducts(prev => [...prev, ...newContent]);
        } else {
          setProducts(newContent);
        }
        setTotalPages(data.totalPages);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setTimeout(() => setIsLoading(false), 500);
      });
  }, [searchTerm]);

  useEffect(() => {
    setPage(0);
    setIsPaginationMode(false);
    fetchProducts(0, false);
  }, [fetchProducts]);

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
    fetchProducts(0, false);
  };




  return (
    <main className="product-page-wrapper">
      <div className="category-bar">
        <div
          className="prod-mobile-cat-header"
          onClick={() => setIsMobileCatOpen(!isMobileCatOpen)}
        >
          <span>☰ {t('categories')}</span>
          <span className={`arrow ${isMobileCatOpen ? 'open' : ''}`}>▼</span>
        </div>

        <div className={`category-list ${isMobileCatOpen ? 'mobile-open' : ''}`}>
          <div className="cat-item cancel-hover">
            <span className="cat-trigger">☰ {t('categories')}</span>
            <div className="mega-menu">
              <div className="mega-column">
                <h3>{t('makeup')}</h3>
                <Link to="/product" onClick={handleResetFilter}>{t('makeup_face')}</Link>
                <Link to="/product" onClick={handleResetFilter}>{t('makeup_lips')}</Link>
                <Link to="/product" onClick={handleResetFilter}>{t('makeup_eyes')}</Link>
              </div>
              <div className="mega-column">
                <h3>{t('skincare')}</h3>
                <Link to="/product" onClick={handleResetFilter}>{t('cleanser')}</Link>
                <Link to="/product" onClick={handleResetFilter}>{t('toner')}</Link>
                <Link to="/product" onClick={handleResetFilter}>{t('serum')}</Link>
              </div>
              <div className="mega-column">
                <h3>{t('body_care')}</h3>
                <Link to="/product">{t('shower_gel')}</Link>
              </div>
              <div className="mega-column">
                <h3>{t('hair_care')}</h3>
                <Link to="/product">{t('shampoo')}</Link>
              </div>
            </div>
          </div>
          <span className="cat-divider">|</span>
          <span className="cat-item">{t('brands')}</span>
          <span className="cat-divider">|</span>
          <span className="cat-item">{t('best_sellers')}</span>
          <span className="cat-divider">|</span>
          <span className="cat-item">{t('hot_deals')}</span>
        </div>
        <div className="prod-search-bar-wrapper">
          <button className="prod-search-btn" onClick={handleSearchSubmit}>
            <img src={search_image} alt="search" style={{ width: '18px' }} />
          </button>
          <input
            type="text"
            placeholder={t('search_hint') || "Tìm kiếm..."}
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
            ) : products.length === 0 ? (
              <div className="no-products">{t('no_products_found') || "Không tìm thấy sản phẩm"}</div>
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
                        <p>Loading more...</p>
                      ) : (
                        page < totalPages - 1 && (
                          <button className="btn-view-more" onClick={handleLoadMore}>
                            {t('load_more') || "Xem thêm"}
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

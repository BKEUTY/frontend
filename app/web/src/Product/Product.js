import "./Product.css";
import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useNotification } from "../Context/NotificationContext";
import { useLanguage } from "../i18n/LanguageContext";
import { useCart } from "../Context/CartContext";
import Skeleton from "../Component/Common/Skeleton";
import best_selling_image from "../Assets/Images/Products/product_placeholder.svg";
import search_image from "../Assets/Images/Icons/icon_search.svg";
import starIcon from "../Assets/Images/Icons/icon_star.svg";

export default function Product() {
  // State
  const [products, setProducts] = useState([]);
  const [isMobileCatOpen, setIsMobileCatOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isPaginationMode, setIsPaginationMode] = useState(false);
  const pageSize = 20;

  const [searchTerm, setSearchTerm] = useState('');

  const notify = useNotification();
  const { t } = useLanguage();
  const { addToCart } = useCart();


  const fetchProducts = useCallback((pageIndex, append) => {
    setIsLoading(true);
    fetch(
      `${process.env.REACT_APP_API_URL}/product?page=${pageIndex}&size=${pageSize}`
    )
      .then((res) => res.json())
      .then((data) => {
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
        // Add fake delay for smoothness
        setTimeout(() => setIsLoading(false), 500);
      });
  }, [searchTerm]);

  // Initial Load
  useEffect(() => {
    setPage(0);
    setIsPaginationMode(false);
    fetchProducts(0, false);
  }, [fetchProducts]);

  // Handlers
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


  const handleAddToCart = async (e, product) => {
    // If passed only ID (legacy or from DOM), try to find it (simplified: just assume product obj passed)
    if (!product) return;

    // UI Immediate Feedback
    addToCart({
      id: product.productId || product.id,
      name: product.name,
      price: product.price, // Keep number
      image: 'placeholder', // we don't have real image url in product obj yet usually
      quantity: 1
    });

    try {
      // Backend Sync
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/cart`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: product.productId || product.id,
            userId: 1,
          }),
        }
      );

      if (!response.ok) {
        // console.error("Sync failed"); 
      }
      // await response.json();
      notify(t('add_cart_success'), "success");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="product-page-wrapper">
      <div className="category-bar">
        {/* Mobile Toggle */}
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
            {/* Mega Menu Dropdown */}
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

          {/* Main Content */}
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
                    <div key={`${product.productId}-${idx}`} className="product-card" id={product.productId}>
                      <Link to={`/product/${product.productId}`} className="card-image-wrapper" style={{ display: 'block' }}>
                        <img src={best_selling_image} alt={product.name} />
                      </Link>
                      <div className="card-info">
                        <p className="card-brand">BKEUTY</p>
                        <h3 className="card-name">
                          <Link to={`/product/${product.productId}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                            {product.name}
                          </Link>
                        </h3>
                        <div className="card-meta">
                          <span className="star-icon" style={{ maskImage: `url(${starIcon})`, WebkitMaskImage: `url(${starIcon})` }}></span>
                          <span className="rating">4.8/5</span>
                          <span className="sold">(120 đã bán)</span>
                        </div>
                        <div className="card-price">{product.price.toLocaleString("vi-VN")}đ</div>

                        <button className="btn-add-cart" onClick={(e) => handleAddToCart(e, product)}>
                          {t('add_to_cart') || "Thêm vào giỏ"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Controls */}
                <div className="pagination-wrapper">
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
                    <div className="pagination">
                      <button
                        className="page-btn"
                        disabled={page === 0}
                        onClick={() => {
                          setPage(p => p - 1);
                          fetchProducts(page - 1, false);
                          window.scrollTo(0, 0);
                        }}
                      >
                        ❮
                      </button>
                      <span className="page-info">
                        Page {page + 1} of {totalPages}
                      </span>
                      <button
                        className="page-btn"
                        disabled={page >= totalPages - 1}
                        onClick={() => {
                          setPage(p => p + 1);
                          fetchProducts(page + 1, false);
                          window.scrollTo(0, 0);
                        }}
                      >
                        ❯
                      </button>
                    </div>
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

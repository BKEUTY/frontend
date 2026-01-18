import "./Product.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNotification } from "../Context/NotificationContext";
import { useLanguage } from "../i18n/LanguageContext";
import best_selling_image from "../Assets/Images/Products/product_placeholder.svg";
import search_image from "../Assets/Images/Icons/icon_search.svg";
import starIcon from "../Assets/Images/Icons/icon_star.svg";

export default function Product() {
  // State
  const [products, setProducts] = useState([]);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isPaginationMode, setIsPaginationMode] = useState(false);
  const pageSize = 20;

  const [searchTerm, setSearchTerm] = useState('');

  const notify = useNotification();
  const { t } = useLanguage();

  // Initial Load
  useEffect(() => {
    setPage(0);
    setIsPaginationMode(false);
    fetchProducts(0, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Keep empty for initial load only, disable lint if needed, OR fix fetchProducts.

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

  const fetchProducts = (pageIndex, append) => {
    fetch(
      `${process.env.REACT_APP_API_URL}/product?page=${pageIndex}&size=${pageSize}`
    )
      .then((res) => res.json())
      .then((data) => {
        let newContent = data.content || [];

        // Simulating Filter (Client-side)
        if (searchTerm) {
          newContent = newContent.filter(p => {
            return p.name.toLowerCase().includes(searchTerm.toLowerCase());
          });
        }

        // Note: minPrice/maxPrice removed

        if (append) {
          setProducts(prev => [...prev, ...newContent]);
        } else {
          setProducts(newContent);
        }
        setTotalPages(data.totalPages);
      })
      .catch((err) => console.error(err));
  };


  const handleAddToCart = async (e, productId) => {
    if (!productId) {
      productId = e.currentTarget.closest(".product_item").getAttribute("id");
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/cart`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: productId,
            userId: 1,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Thêm vào giỏ hàng thất bại");
      }

      const data = await response.json();
      console.log("Thêm vào giỏ hàng thành công:", data);
      notify(t('add_cart_success'), "success");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="product-page-wrapper">
      {/* Category Bar from Home Page */}
      <div className="category-bar">
        <div className="category-list">
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
        <div className="search-bar-wrapper">
          <input
            type="text"
            placeholder={t('search_hint') || "Tìm kiếm..."}
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
          />
          <button className="search-btn" onClick={handleSearchSubmit}>
            <img src={search_image} alt="search" style={{ width: '20px' }} />
          </button>
        </div>
      </div>

      <div className="product-page">
        <div className="product-container">
          {/* Sidebar Removed */}

          {/* Main Content */}
          <section className="product-main-content">
            <div className="product-header-bar">
              <h2>{t('all_products') || "Tất cả sản phẩm"} ({products.length}{isPaginationMode ? '' : '+'})</h2>
            </div>

            {products.length === 0 ? (
              <div className="no-products">{t('no_products_found') || "Không tìm thấy sản phẩm"}</div>
            ) : (
              <>
                <div className="product-grid">
                  {products.map((product, idx) => (
                    <div key={`${product.productId}-${idx}`} className="product-card" id={product.productId}>
                      <div className="card-image-wrapper">
                        <img src={best_selling_image} alt={product.name} />
                      </div>
                      <div className="card-info">
                        <p className="card-brand">BKEUTY</p>
                        <h3 className="card-name">{product.name}</h3>
                        <div className="card-meta">
                          <span className="star-icon" style={{ maskImage: `url(${starIcon})`, WebkitMaskImage: `url(${starIcon})` }}></span>
                          <span className="rating">4.8/5</span>
                          <span className="sold">(120 đã bán)</span>
                        </div>
                        <div className="card-price">{product.price.toLocaleString("vi-VN")}đ</div>

                        <button className="btn-add-cart" onClick={(e) => handleAddToCart(e, product.productId)}>
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
                      {page < totalPages - 1 && (
                        <button className="btn-view-more" onClick={handleLoadMore}>
                          {t('load_more') || "Xem thêm"}
                        </button>
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

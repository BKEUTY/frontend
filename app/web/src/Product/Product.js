import "./Product.css";
import { useEffect, useState } from "react";
import { useNotification } from "../Context/NotificationContext";
import { useLanguage } from "../i18n/LanguageContext"; // Add import
import best_selling_image from "../Assets/Images/Products/product_placeholder.svg";
import search_image from "../Assets/Images/Icons/icon_search.svg";
import starIcon from "../Assets/Images/Icons/icon_star.svg";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');


  const notify = useNotification();
  const { t } = useLanguage();

  useEffect(() => {
    fetch(
      `${process.env.REACT_APP_API_URL}/product`
    )
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    let result = products;

    // Filter by Price
    if (minPrice !== '') {
      result = result.filter(p => p.price >= Number(minPrice));
    }
    if (maxPrice !== '') {
      result = result.filter(p => p.price <= Number(maxPrice));
    }

    // Filter by Category (Mock logic as data might not have category)
    // Assuming product description or name might contain keywords, or just mock it.
    // Since we don't have real categories in data, we will skip category logic 
    // or strictly filter if we had the field. 
    // Let's rely on search text if we want to simulate "Category" or just show UI.
    // For now, I will implement Price and Search (Name) filtering.

    setFilteredProducts(result);
  }, [products, minPrice, maxPrice]);

  const handleAddToCart = async (e, productId) => {
    // Use productId passed directly or find it
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

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = products.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.description?.toLowerCase().includes(term)
    );
    setFilteredProducts(filtered);
  };

  return (
    <main className="product-page">
      <div className="product-container">
        {/* Sidebar */}
        <aside className="product-sidebar">
          <div className="sidebar-section">
            <h3 className="sidebar-title">{t('search')}</h3>
            <div className="sidebar-search-box">
              <input
                type="text"
                placeholder={t('search_placeholder')}
                onChange={handleSearch}
              />
              <img src={search_image} alt="search" />
            </div>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-title">{t('price_range')}</h3>
            <div className="price-inputs">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <span className="separator">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-title">{t('filter')}</h3>
            <label className="filter-item">
              <input type="checkbox" />
              <span className="checkmark"></span> Skincare
            </label>
            <label className="filter-item">
              <input type="checkbox" />
              <span className="checkmark"></span> Makeup
            </label>
            <label className="filter-item">
              <input type="checkbox" />
              <span className="checkmark"></span> Body Care
            </label>
          </div>
        </aside>

        {/* Main Content */}
        <section className="product-main-content">
          <div className="product-header-bar">
            <h2>{t('all_products') || "Tất cả sản phẩm"} ({filteredProducts.length})</h2>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="no-products">{t('no_products_found') || "Không tìm thấy sản phẩm"}</div>
          ) : (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <div key={product.productId} className="product-card" id={product.productId}>
                  <div className="card-image-wrapper">
                    <img src={best_selling_image} alt={product.name} />
                  </div>
                  <div className="card-info">
                    <p className="card-brand">BKEUTY</p>
                    <h3 className="card-name">{product.name}</h3>
                    <div className="card-meta">
                      <span className="star-icon" style={{ maskImage: `url(${starIcon})`, WebkitMaskImage: `url(${starIcon})` }}></span>
                      <span className="rating">4.8 (120)</span>
                    </div>
                    <div className="card-price">{product.price.toLocaleString("vi-VN")}đ</div>

                    <button className="btn-add-cart" onClick={(e) => handleAddToCart(e, product.productId)}>
                      {t('add_to_cart') || "Thêm vào giỏ"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

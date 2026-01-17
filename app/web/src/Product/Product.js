import "./Product.css";
import { useEffect, useState } from "react";
import { useNotification } from "../Context/NotificationContext";
import { useLanguage } from "../i18n/LanguageContext"; // Add import
import banner_image from "../Assets/Images/Banners/image_84.svg";
import best_selling_image from "../Assets/Images/Products/product image.svg";
import about_image from "../Assets/Images/Banners/Frame 26085715.svg";
import blog_image from "../Assets/Images/Banners/blog image.svg";
import search_image from "../Assets/Images/Icons/Vector.svg";
import cart_icon from "../Assets/Images/Icons/flowbite_cart-outline.svg";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

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
    <main>
      <section className="section1">
        <img
          className="banner_image"
          loading="lazy"
          decoding="async"
          src={banner_image}
          alt="icon"
        />
      </section>

      <section className="section2">
        <section className="section2_row1">
          <img
            className="search_image"
            loading="lazy"
            decoding="async"
            src={search_image}
            alt="icon"
          />
          <input
            className="search_bar"
            type="text"
            placeholder={t('search_placeholder')}
            onChange={handleSearch}
          />
        </section>

        <section className="section2_row2">
          <span className="indicator active"></span>
          <span className="indicator"></span>
          <span className="indicator"></span>
        </section>

        <section className="section2_row3">
          <section className="section2_row3_col1">
            <div className="price_range">
              <h2 className="price_range_title">{t('price_range')}</h2>

              <input
                className="price_range_input"
                type="number"
                placeholder={t('min_price') || "Tối thiểu"}
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <span className="price_separator">-</span>
              <input
                className="price_range_input"
                type="number"
                placeholder={t('max_price') || "Tối đa"}
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>

            <div className="filter">
              <h2 className="filter_title">{t('filter')}</h2>
              {/* Mock Categories */}
              <label className="filter_item">
                <input type="checkbox" />
                <span className="checkmark"></span>
                Skincare
              </label>

              <label className="filter_item">
                <input type="checkbox" />
                <span className="checkmark"></span>
                Makeup
              </label>

              <label className="filter_item">
                <input type="checkbox" />
                <span className="checkmark"></span>
                Body Care
              </label>
            </div>
          </section>
          <section className="section2_row3_col2">
            {filteredProducts.length === 0 ? <p>No products found</p> : filteredProducts.map((product) => (
              <div id={product.productId} className="product_item" key={product.productId}>
                <img
                  className="product_image"
                  loading="lazy"
                  decoding="async"
                  src={best_selling_image}
                  alt="icon"
                />

                <div className="product_text ">
                  <h4 className="product_name">{product.name}</h4>
                  <h5 className="product_description">{product.description}</h5>
                  <div className="product_bottom">
                    <h4 className="product_price">
                      {product.price.toLocaleString("vi-VN")}đ
                    </h4>
                    <span className="add_cart" onClick={(e) => handleAddToCart(e, product.productId)}>
                      <img src={cart_icon} alt="Add to cart" className="product-cart-icon" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </section>
        </section>
      </section>

      <section className="section3">
        <h1 className="section3_title">{t('best_selling')}</h1>
        <div className="best_selling_list ">
          <div className="best_selling_item ">
            <img
              className="best_selling_image"
              loading="lazy"
              decoding="async"
              src={best_selling_image}
              alt="icon"
            />

            <div className="best_selling_text ">
              <div className="best_selling_name">
                Beautya Capture Total Dreamskin Care & Perfect
              </div>
              <p className="best_selling_description">
                Son bóng làm đầy môi - Hiệu quả tức thì và lâu dài - Dưỡng ẩm 24h
              </p>
              <h3 className="best_selling_price">76000đ</h3>
            </div>
          </div>

          <div className="best_selling_item ">
            <img
              className="best_selling_image"
              loading="lazy"
              decoding="async"
              src={best_selling_image}
              alt="icon"
            />

            <div className="best_selling_text ">
              <div className="best_selling_name">
                Beautya Capture Total Dreamskin Care & Perfect
              </div>
              <h5 className="best_selling_description">
                Son bóng làm đầy môi - Hiệu quả tức thì và lâu dài - Dưỡng ẩm 24h
              </h5>
              <h3 className="best_selling_price">76000đ</h3>
            </div>
          </div>

          <div className="best_selling_item ">
            <img
              className="best_selling_image"
              loading="lazy"
              decoding="async"
              src={best_selling_image}
              alt="icon"
            />

            <div className="best_selling_text ">
              <div className="best_selling_name">
                Beautya Capture Total Dreamskin Care & Perfect
              </div>
              <h5 className="best_selling_description">
                Son bóng làm đầy môi - Hiệu quả tức thì và lâu dài - Dưỡng ẩm 24h
              </h5>
              <h3 className="best_selling_price">76000đ</h3>
            </div>
          </div>

          <div className="best_selling_item ">
            <img
              className="best_selling_image"
              loading="lazy"
              decoding="async"
              src={best_selling_image}
              alt="icon"
            />

            <div className="best_selling_text ">
              <div className="best_selling_name">
                Beautya Capture Total Dreamskin Care & Perfect
              </div>
              <h5 className="best_selling_description">
                Son bóng làm đầy môi - Hiệu quả tức thì và lâu dài - Dưỡng ẩm 24h
              </h5>
              <h3 className="best_selling_price">76000đ</h3>
            </div>
          </div>
        </div>
      </section>

      <section className="section4">
        <section className="section4_col1">
          <h1>{t('brand_story')}</h1>
          <p>
            {t('brand_desc')}
          </p>
          <button className="section4_col1_bt button">Khám Phá Thêm</button>
        </section>
        <section className="section4_col2">
          <img
            className="ablout_image"
            loading="lazy"
            decoding="async"
            src={about_image}
            alt="icon"
          />
        </section>
      </section>

      <section className="section5">
        <h1 className="section5_title">Góc Làm Đẹp</h1>

        <div className="section5_more_view">
          <div>Xem Tất Cả</div>
        </div>

        <div className="blog_list ">
          <div className="blog_item ">
            <img
              className="blog_image"
              loading="lazy"
              decoding="async"
              src={blog_image}
              alt="icon"
            />

            <div className="blog_text ">
              <h2 className="blog_name">
                Beautya Capture Total Dreamskin Care & Perfect
              </h2>
              <h5 className="blog_more_info">
                Chăm sóc da | Bác sĩ Wade Warren | 20/01/2026
              </h5>
              <p className="blog_description">
                Nhiều người cảm thấy khó khăn trong việc có được làn da sạch mụn.
                Các phương pháp để có làn da sạch sẽ thay đổi tùy thuộc vào loại da
                của mỗi người. Nhìn chung, những người gặp vấn đề về mụn thường có
                làn da khô, da dầu hoặc kết hợp cả hai.
              </p>
            </div>
          </div>

          <div className="blog_item ">
            <img
              className="blog_image"
              loading="lazy"
              decoding="async"
              src={blog_image}
              alt="icon"
            />

            <div className="blog_text ">
              <h2 className="blog_name">
                Beautya Capture Total Dreamskin Care & Perfect
              </h2>
              <h5 className="blog_more_info">
                Chăm sóc da | Bác sĩ Wade Warren | 20/01/2026
              </h5>
              <p className="blog_description">
                Nhiều người cảm thấy khó khăn trong việc có được làn da sạch mụn.
                Các phương pháp để có làn da sạch sẽ thay đổi tùy thuộc vào loại da
                của mỗi người. Nhìn chung, những người gặp vấn đề về mụn thường có
                làn da khô, da dầu hoặc kết hợp cả hai.
              </p>
            </div>
          </div>

          <div className="blog_item ">
            <img
              className="blog_image"
              loading="lazy"
              decoding="async"
              src={blog_image}
              alt="icon"
            />

            <div className="blog_text ">
              <h2 className="blog_name">
                Beautya Capture Total Dreamskin Care & Perfect
              </h2>
              <h5 className="blog_more_info">
                Chăm sóc da | Bác sĩ Wade Warren | 20/01/2026
              </h5>
              <p className="blog_description">
                Nhiều người cảm thấy khó khăn trong việc có được làn da sạch mụn.
                Các phương pháp để có làn da sạch sẽ thay đổi tùy thuộc vào loại da
                của mỗi người. Nhìn chung, những người gặp vấn đề về mụn thường có
                làn da khô, da dầu hoặc kết hợp cả hai.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

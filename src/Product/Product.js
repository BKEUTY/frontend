import "./Product.css";
import banner_image from "../Assets/Images/image_84.svg";
import best_selling_image from "../Assets/Images/product image.svg";
import about_image from "../Assets/Images/Frame 26085715.svg";
import blog_image from "../Assets/Images/blog image.svg";
import search_image from "../Assets/Images/Vector.svg";

export default function Product() {
  return (
    <main>
      <section className="section1">
        <img
          className="banner_image"
          loading="lazy"
          decoding="async"
          src={banner_image} //Không thể dùng đường dẫn trực tiếp như html vì khi webpack sẽ bundle src để build trong đó có ảnh nên đường dẫn ảnh sẽ bị thay đổi
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
            placeholder="Tìm kiếm sản phẩm..."
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
              <h2 className="price_range_title">Khoảng giá</h2>

              <input
                className="price_range_input"
                type="number"
                placeholder="Min"
              />
              <span className="price_separator">-</span>
              <input
                className="price_range_input"
                type="number"
                placeholder="Max"
              />
            </div>

            <div className="filter">
              <h2 className="filter_title">Lọc 1</h2>

              <label class="filter_item">
                <input type="checkbox" />
                <span class="checkmark"></span>
                Checkbox with label
              </label>

              <label class="filter_item">
                <input type="checkbox" />
                <span class="checkmark"></span>
                Checkbox with label
              </label>

              <label class="filter_item">
                <input type="checkbox" />
                <span class="checkmark"></span>
                Checkbox with label
              </label>
            </div>

            <div className="filter2">
              <h2 className="filter2_title">Lọc 2</h2>

              <label class="filter2_item">
                <input type="checkbox" />
                <span class="checkmark"></span>
                Checkbox with label
              </label>

              <label class="filter2_item">
                <input type="checkbox" />
                <span class="checkmark"></span>
                Checkbox with label
              </label>

              <label class="filter2_item">
                <input type="checkbox" />
                <span class="checkmark"></span>
                Checkbox with label
              </label>
            </div>

            <div className="filter3">
              <h2 className="filter3_title">Lọc 3</h2>

              <label class="filter3_item">
                <input type="checkbox" />
                <span class="checkmark"></span>
                Checkbox with label
              </label>

              <label class="filter3_item">
                <input type="checkbox" />
                <span class="checkmark"></span>
                Checkbox with label
              </label>

              <label class="filter3_item">
                <input type="checkbox" />
                <span class="checkmark"></span>
                Checkbox with label
              </label>
            </div>
          </section>
          <section className="section2_row3_col2">
            <div className="product_item ">
              <img
                className="product_image"
                loading="lazy"
                decoding="async"
                src={best_selling_image}
                alt="icon"
              />

              <div className="product_text ">
                <h4 className="product_name">
                  Beautya Capture Total Dreamskin Care & Perfect
                </h4>
                <h5 className="product_description">
                  Plumping Gloss - Instant and Long-Term Volume Effect - 24h
                  Hydration
                </h5>
                <div className="product_bottom">
                  <h4 className="product_price">76000đ</h4>
                  <span className="add_cart">🛒</span>
                </div>
              </div>
            </div>

            <div className="product_item ">
              <img
                className="product_image"
                loading="lazy"
                decoding="async"
                src={best_selling_image}
                alt="icon"
              />

              <div className="product_text ">
                <h4 className="product_name">
                  Beautya Capture Total Dreamskin Care & Perfect
                </h4>
                <h5 className="product_description">
                  Plumping Gloss - Instant and Long-Term Volume Effect - 24h
                  Hydration
                </h5>
                <div className="product_bottom">
                  <h4 className="product_price">76000đ</h4>
                  <span className="add_cart">🛒</span>
                </div>
              </div>
            </div>

            <div className="product_item ">
              <img
                className="product_image"
                loading="lazy"
                decoding="async"
                src={best_selling_image}
                alt="icon"
              />

              <div className="product_text ">
                <h4 className="product_name">
                  Beautya Capture Total Dreamskin Care & Perfect
                </h4>
                <h5 className="product_description">
                  Plumping Gloss - Instant and Long-Term Volume Effect - 24h
                  Hydration
                </h5>
                <div className="product_bottom">
                  <h4 className="product_price">76000đ</h4>
                  <span className="add_cart">🛒</span>
                </div>
              </div>
            </div>

            <div className="product_item ">
              <img
                className="product_image"
                loading="lazy"
                decoding="async"
                src={best_selling_image}
                alt="icon"
              />

              <div className="product_text ">
                <h4 className="product_name">
                  Beautya Capture Total Dreamskin Care & Perfect
                </h4>
                <h5 className="product_description">
                  Plumping Gloss - Instant and Long-Term Volume Effect - 24h
                  Hydration
                </h5>
                <div className="product_bottom">
                  <h4 className="product_price">76000đ</h4>
                  <span className="add_cart">🛒</span>
                </div>
              </div>
            </div>

            <div className="product_item ">
              <img
                className="product_image"
                loading="lazy"
                decoding="async"
                src={best_selling_image}
                alt="icon"
              />

              <div className="product_text ">
                <h4 className="product_name">
                  Beautya Capture Total Dreamskin Care & Perfect
                </h4>
                <h5 className="product_description">
                  Plumping Gloss - Instant and Long-Term Volume Effect - 24h
                  Hydration
                </h5>
                <div className="product_bottom">
                  <h4 className="product_price">76000đ</h4>
                  <span className="add_cart">🛒</span>
                </div>
              </div>
            </div>

            <div className="product_item ">
              <img
                className="product_image"
                loading="lazy"
                decoding="async"
                src={best_selling_image}
                alt="icon"
              />

              <div className="product_text ">
                <h4 className="product_name">
                  Beautya Capture Total Dreamskin Care & Perfect
                </h4>
                <h5 className="product_description">
                  Plumping Gloss - Instant and Long-Term Volume Effect - 24h
                  Hydration
                </h5>
                <div className="product_bottom">
                  <h4 className="product_price">76000đ</h4>
                  <span className="add_cart">🛒</span>
                </div>
              </div>
            </div>

            <div className="product_item ">
              <img
                className="product_image"
                loading="lazy"
                decoding="async"
                src={best_selling_image}
                alt="icon"
              />

              <div className="product_text ">
                <h4 className="product_name">
                  Beautya Capture Total Dreamskin Care & Perfect
                </h4>
                <h5 className="product_description">
                  Plumping Gloss - Instant and Long-Term Volume Effect - 24h
                  Hydration
                </h5>
                <div className="product_bottom">
                  <h4 className="product_price">76000đ</h4>
                  <span className="add_cart">🛒</span>
                </div>
              </div>
            </div>

            <div className="product_item ">
              <img
                className="product_image"
                loading="lazy"
                decoding="async"
                src={best_selling_image}
                alt="icon"
              />

              <div className="product_text ">
                <h4 className="product_name">
                  Beautya Capture Total Dreamskin Care & Perfect
                </h4>
                <h5 className="product_description">
                  Plumping Gloss - Instant and Long-Term Volume Effect - 24h
                  Hydration
                </h5>
                <div className="product_bottom">
                  <h4 className="product_price">76000đ</h4>
                  <span className="add_cart">🛒</span>
                </div>
              </div>
            </div>

            <div className="product_item ">
              <img
                className="product_image"
                loading="lazy"
                decoding="async"
                src={best_selling_image}
                alt="icon"
              />

              <div className="product_text ">
                <h4 className="product_name">
                  Beautya Capture Total Dreamskin Care & Perfect
                </h4>
                <h5 className="product_description">
                  Plumping Gloss - Instant and Long-Term Volume Effect - 24h
                  Hydration
                </h5>
                <div className="product_bottom">
                  <h4 className="product_price">76000đ</h4>
                  <span className="add_cart">🛒</span>
                </div>
              </div>
            </div>

            <div className="product_item ">
              <img
                className="product_image"
                loading="lazy"
                decoding="async"
                src={best_selling_image}
                alt="icon"
              />

              <div className="product_text ">
                <h4 className="product_name">
                  Beautya Capture Total Dreamskin Care & Perfect
                </h4>
                <h5 className="product_description">
                  Plumping Gloss - Instant and Long-Term Volume Effect - 24h
                  Hydration
                </h5>
                <div className="product_bottom">
                  <h4 className="product_price">76000đ</h4>
                  <span className="add_cart">🛒</span>
                </div>
              </div>
            </div>
          </section>
        </section>
      </section>

      <section className="section3">
        <h1 className="section3_title">Sản phẩm bán chạy</h1>
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
                Plumping Gloss - Instant and Long-Term Volume Effect - 24h
                Hydration
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
                Plumping Gloss - Instant and Long-Term Volume Effect - 24h
                Hydration
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
                Plumping Gloss - Instant and Long-Term Volume Effect - 24h
                Hydration
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
                Plumping Gloss - Instant and Long-Term Volume Effect - 24h
                Hydration
              </h5>
              <h3 className="best_selling_price">76000đ</h3>
            </div>
          </div>
        </div>
      </section>

      <section className="section4">
        <section className="section4_col1">
          <h1>Thương Hiệu Của Chúng Tôi</h1>
          <p>
            Tại BKEUTY, chúng tôi tin rằng vẻ đẹp thăng hoa trong sự đa dạng và
            không ngừng khám phá. Sứ mệnh của chúng tôi là truyền cảm hứng để
            tôn vinh nét đẹp phi thường ẩn giấu trong mỗi người.
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
        <h1 className="section5_title">Our Blog</h1>

        <div className="section5_more_view">
          <div>View All</div>
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
                Skincare | Dr. Wade Warren | Jan 20, 2021
              </h5>
              <p className="blog_description">
                Many people find it difficult to get clear skin. The methods for
                getting clear skin will vary, depending on the person's skin
                type. In general, people struggling with acne or blemishes have
                skin that is dry, oily, or a combination of the two.
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
                Skincare | Dr. Wade Warren | Jan 20, 2021
              </h5>
              <p className="blog_description">
                Many people find it difficult to get clear skin. The methods for
                getting clear skin will vary, depending on the person's skin
                type. In general, people struggling with acne or blemishes have
                skin that is dry, oily, or a combination of the two.
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
                Skincare | Dr. Wade Warren | Jan 20, 2021
              </h5>
              <p className="blog_description">
                Many people find it difficult to get clear skin. The methods for
                getting clear skin will vary, depending on the person's skin
                type. In general, people struggling with acne or blemishes have
                skin that is dry, oily, or a combination of the two.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

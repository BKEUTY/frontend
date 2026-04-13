import "./Product.css";
import { useEffect, useState, useRef } from "react";
import { useLanguage } from "@/store/LanguageContext";
import { Skeleton, Pagination, ProductCard, CButton, SEO } from "@/components/common";
import { SearchOutlined, MenuOutlined, DownOutlined } from '@ant-design/icons';
import productApi from "@/features/products/services/productService";
import useClickOutside from "@/hooks/useClickOutside";
import { useDebounce } from "@/hooks/useDebounce";
import { useProducts } from "@/features/products/hooks/useProducts";
import { useQueryParams } from "@/hooks/useQueryParams";

export default function Product() {
  const { t } = useLanguage();
  const dropdownRef = useRef(null);
  const pageSize = 20;

  const [categories, setCategories] = useState([]);
  const [isMobileCatOpen, setIsMobileCatOpen] = useState(false);
  const [isPaginationMode, setIsPaginationMode] = useState(false);

  const [query, setQuery] = useQueryParams();

  const activeCategory = query.categoryId || null;
  const sortOption = query.sort || 'default';
  const page = query.page ? Number(query.page) - 1 : 0;
  const searchTermFromUrl = query.search || '';

  const [searchInput, setSearchInput] = useState(searchTermFromUrl);
  const debouncedSearch = useDebounce(searchInput, 500);

  const { products, isLoading, error, totalPages, totalItems, fetchProducts } = useProducts(pageSize);

  useClickOutside(dropdownRef, () => setIsMobileCatOpen(false));

  useEffect(() => {
    setSearchInput(searchTermFromUrl);
  }, [searchTermFromUrl]);

  useEffect(() => {
    if (debouncedSearch !== searchTermFromUrl) {
      setQuery({ search: debouncedSearch, page: 1 });
    }
  }, [debouncedSearch, searchTermFromUrl, setQuery]);

  useEffect(() => {
    let isMounted = true;
    const fetchCategories = async () => {
      try {
        const res = await productApi.getCategories();
        if (isMounted && res.data) setCategories(res.data);
      } catch (err) {}
    };
    fetchCategories();
    return () => { isMounted = false };
  }, []);

  useEffect(() => {
    const isFiltering = searchTermFromUrl.length > 0 || activeCategory !== null || sortOption !== 'default';
    setIsPaginationMode(isFiltering);
    const shouldAppend = !isFiltering && page > 0;
    fetchProducts(page, shouldAppend, searchTermFromUrl, activeCategory, sortOption); 
  }, [page, searchTermFromUrl, activeCategory, sortOption, fetchProducts]);

  const handleCategorySelect = (id) => {
    if (activeCategory === id) return;
    setQuery({ categoryId: id, page: 1 });
    setIsMobileCatOpen(false);
  };

  const handleSortChange = (e) => {
    if (sortOption === e.target.value) return;
    setQuery({ sort: e.target.value, page: 1 });
  };

  const handlePageChange = (newPage) => {
    setQuery({ page: newPage + 1 });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoadMore = () => {
    if (page >= totalPages - 1 || isLoading) return;
    setQuery({ ...query, page: page + 2 }, { replace: true, scroll: true });
  };

  const getCurrentCategoryName = () => {
    if (!activeCategory) return t('all_products');
    const cat = categories.find(c => c.id === Number(activeCategory));
    return cat ? cat.categoryName : t('all_products');
  };

  return (
    <main className="product-page-wrapper">
      <SEO title={t('all_products')} description={t('search_hint')} />
      <div className="product-top-bar">
        <div className="top-bar-left">
          <div className="cat-dropdown-container" ref={dropdownRef}>
            <div className="cat-dropdown-trigger" onClick={() => setIsMobileCatOpen(!isMobileCatOpen)}>
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
                    className={`mega-item ${Number(activeCategory) === cat.id ? 'active' : ''}`}
                    onClick={() => handleCategorySelect(cat.id)}
                  >
                    {cat.categoryName}
                  </div>
                ))}
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
          <button className="prod-search-btn"><SearchOutlined className="prod-search-icon" /></button>
          <input
            type="text"
            placeholder={t('search_hint')}
            className="prod-search-input"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
      </div>

      <div className="product-page">
        <div className="product-container">
          <section className="product-main-content">
            <div className="product-header-bar product-header-flex">
              <div className="product-breadcrumb">
                <span className="current">{getCurrentCategoryName()}</span>
                <span className="count-badge">({totalItems})</span>
              </div>
              <div className="product-sort">
                <select value={sortOption} onChange={handleSortChange} className="sort-select">
                  <option value="default">{t('default_sort')}</option>
                  <option value="price_asc">{t('price_low_high')}</option>
                  <option value="price_desc">{t('price_high_low')}</option>
                  <option value="stock_desc">{t('stock_high_low')}</option>
                  <option value="stock_asc">{t('stock_low_high')}</option>
                  <option value="rating_desc">{t('rating_high_low')}</option>
                  <option value="rating_asc">{t('rating_low_high')}</option>
                  <option value="reviews_desc">{t('reviews_high_low')}</option>
                  <option value="reviews_asc">{t('reviews_low_high')}</option>
                </select>
              </div>
            </div>

            {isLoading && page === 0 ? (
              <div className="product-grid">
                {Array(10).fill(0).map((_, i) => (
                  <ProductCard key={`prod-shimmer-${i}`} isLoading={true} />
                ))}
              </div>
            ) : error ? (
              <div className="no-products">{t(error)}</div>
            ) : products.length === 0 ? (
              <div className="no-products">{t('no_products_found')}</div>
            ) : (
              <>
                <div className="product-grid">
                  {products.map((product) => (
                    <ProductCard key={`${product.productId}`} product={product} t={t} />
                  ))}
                </div>

                <div className="pagination-wrapper-container">
                  {!isPaginationMode ? (
                    <div className="load-more-container">
                      {isLoading && page > 0 ? (
                        <p>{t('loading')}</p>
                      ) : (
                        page < totalPages - 1 && (
                          <CButton type="outline" onClick={handleLoadMore}>{t('load_more')}</CButton>
                        )
                      )}
                    </div>
                  ) : (
                    <Pagination page={page} totalPages={totalPages} totalItems={totalItems} pageSize={pageSize} onPageChange={handlePageChange} />
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

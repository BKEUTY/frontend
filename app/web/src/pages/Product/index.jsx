import { CButton, Pagination, ProductCard, SEO } from "@/components/common";
import { useProductsPaginated } from "@/features/products/hooks/useProducts";
import productApi from "@/features/products/services/productService";
import useClickOutside from "@/hooks/useClickOutside";
import { useDebounce } from "@/hooks/useDebounce";
import { useQueryParams } from "@/hooks/useQueryParams";
import { useLanguage } from "@/store/LanguageContext";
import { DownOutlined, MenuOutlined, SearchOutlined } from '@ant-design/icons';
import { Input, Select } from "antd";
import { useEffect, useRef, useState } from "react";
import "./Product.css";

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
  const page = query.page ? Number(query.page) : 1;
  const searchTermFromUrl = query.search || '';

  const [searchInput, setSearchInput] = useState(searchTermFromUrl);
  const debouncedSearch = useDebounce(searchInput, 500);

  const { data, isLoading, error } = useProductsPaginated({
    page,
    size: pageSize,
    search: searchTermFromUrl,
    categoryId: activeCategory,
    sort: sortOption
  });

  const [allProducts, setAllProducts] = useState([]);
  const products = allProducts;
  const totalPages = data?.totalPages || 0;
  const totalItems = data?.totalItems || 0;

  useClickOutside(dropdownRef, () => setIsMobileCatOpen(false));

  useEffect(() => {
    if (!searchTermFromUrl) setSearchInput('');
  }, [searchTermFromUrl]);

  useEffect(() => {
    if (debouncedSearch !== searchInput) return;

    const cleanSearch = String(debouncedSearch ?? '').trim();
    if (cleanSearch !== searchTermFromUrl) {
      setQuery({ search: cleanSearch || null, page: 1 });
    }
  }, [debouncedSearch, searchInput, searchTermFromUrl, setQuery]);

  useEffect(() => {
    let isMounted = true;
    const fetchCategories = async () => {
      try {
        const res = await productApi.getCategories();
        if (isMounted && res.data) setCategories(res.data);
      } catch (err) { }
    };
    fetchCategories();
    return () => { isMounted = false };
  }, []);

  useEffect(() => {
    const isFiltering = searchTermFromUrl.length > 0 || activeCategory !== null || sortOption !== 'default';
    setIsPaginationMode(isFiltering);
  }, [searchTermFromUrl, activeCategory, sortOption]);

  useEffect(() => {
    if (data?.items) {
      if (isPaginationMode) {
        setAllProducts(data.items);
      } else {
        if (page === 1) {
          setAllProducts(data.items);
        } else {
          // Only append if it's not already in the list (simple deduplication)
          setAllProducts(prev => {
            const existingIds = new Set(prev.map(p => p.productId));
            const newItems = data.items.filter(p => !existingIds.has(p.productId));
            return page === 1 ? data.items : [...prev, ...newItems];
          });
        }
      }
    }
  }, [data, isPaginationMode, page]);

  const handleCategorySelect = (id) => {
    if (activeCategory === id) return;
    setQuery({ categoryId: id, page: 1 });
    setIsMobileCatOpen(false);
  };

  const handleSortChange = (value) => {
    if (sortOption === value) return;
    setQuery({ sort: value, page: 1 });
  };

  const handleQuickSort = (sortValue) => {
    if (sortOption === sortValue) return;
    setQuery({ sort: sortValue, page: 1 });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageChange = (newPage) => {
    setQuery({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoadMore = () => {
    if (page >= totalPages || isLoading) return;
    setQuery({ ...query, page: page + 1 }, { replace: true, scroll: true });
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
            <span
              className={`quick-link-item ${sortOption === 'sold_desc' ? 'active' : ''}`}
              onClick={() => handleQuickSort('sold_desc')}
            >
              {t('best_sellers')}
            </span>
            <span
              className={`quick-link-item ${sortOption === 'price_asc' ? 'active' : ''}`}
              onClick={() => handleQuickSort('price_asc')}
            >
              {t('hot_deals')}
            </span>
            <span
              className={`quick-link-item ${sortOption === 'id_desc' ? 'active' : ''}`}
              onClick={() => handleQuickSort('id_desc')}
            >
              {t('new_arrivals')}
            </span>
          </div>
        </div>

        <div className="prod-search-bar-wrapper">
          <Input
            placeholder={t('search_hint')}
            className="prod-search-input"
            value={searchInput}
            onChange={(e) => {
              const val = e.target.value;
              setSearchInput(val);
              if (!val) {
                setQuery({ search: null, page: 1 });
              }
            }}
            onPressEnter={() => setQuery({ search: searchInput.trim() || null, page: 1 })}
            allowClear
            prefix={<SearchOutlined className="prod-search-icon" />}
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
                <div className="bkeuty-sort-wrapper">
                  <Select
                    value={sortOption}
                    onChange={handleSortChange}
                    className="bkeuty-custom-select"
                    popupClassName="sort-select-popup"
                    suffixIcon={<DownOutlined />}
                    variant="borderless"
                  >
                    <Select.Option value="default">{t('default_sort')}</Select.Option>
                    <Select.Option value="price_asc">{t('price_low_high')}</Select.Option>
                    <Select.Option value="price_desc">{t('price_high_low')}</Select.Option>
                    <Select.Option value="stock_desc">{t('stock_high_low')}</Select.Option>
                    <Select.Option value="stock_asc">{t('stock_low_high')}</Select.Option>
                    <Select.Option value="sold_desc">{t('sold_high_low')}</Select.Option>
                    <Select.Option value="sold_asc">{t('sold_low_high')}</Select.Option>
                    <Select.Option value="rating_desc">{t('rating_high_low')}</Select.Option>
                    <Select.Option value="rating_asc">{t('rating_low_high')}</Select.Option>
                    <Select.Option value="reviews_desc">{t('reviews_high_low')}</Select.Option>
                    <Select.Option value="reviews_asc">{t('reviews_low_high')}</Select.Option>
                  </Select>
                </div>
              </div>
            </div>

            {isLoading && page === 1 ? (
              <div className="product-grid">
                {Array(10).fill(0).map((_, i) => (
                  <ProductCard key={`prod-shimmer-${i}`} isLoading={true} />
                ))}
              </div>
            ) : error ? (
              <div className="no-products">{t(error) || error.toString()}</div>
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
                      {isLoading && page > 1 ? (
                        <p>{t('loading')}</p>
                      ) : (
                        page < totalPages && (
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

import { CButton, Pagination, ProductCard, SEO } from "@/components/common";
import { useProductsPaginated } from "@/features/products/hooks/useProducts";
import productApi from "@/features/products/services/productService";
import useClickOutside from "@/hooks/useClickOutside";
import { useDebounce } from "@/hooks/useDebounce";
import { useQueryParams } from "@/hooks/useQueryParams";
import { useLanguage } from "@/store/LanguageContext";
import { DownOutlined, MenuOutlined, SearchOutlined, FilterOutlined, SortAscendingOutlined } from '@ant-design/icons';
import { Input, Select, InputNumber, Popover, Slider } from "antd";
import { useEffect, useRef, useState } from "react";
import "./Product.css";

export default function Product() {
  const { t } = useLanguage();
  const dropdownRef = useRef(null);
  const pageSize = 20;

  const [categories, setCategories] = useState([]);
  const [isMobileCatOpen, setIsMobileCatOpen] = useState(false);
  const [isPaginationMode, setIsPaginationMode] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const [query, setQuery] = useQueryParams();

  const activeCategory = query.categoryId || null;
  const sortOption = query.sort || 'default';
  const page = query.page ? Number(query.page) : 1;
  const searchTermFromUrl = query.search || '';
  const minPrice = query.minPrice ? Number(query.minPrice) : undefined;
  const maxPrice = query.maxPrice ? Number(query.maxPrice) : undefined;

  const [searchInput, setSearchInput] = useState(searchTermFromUrl);
  const [minPriceInput, setMinPriceInput] = useState(minPrice);
  const [maxPriceInput, setMaxPriceInput] = useState(maxPrice);
  const debouncedSearch = useDebounce(searchInput, 500);

  const { data, isLoading, error } = useProductsPaginated({
    page,
    size: pageSize,
    search: searchTermFromUrl,
    categoryId: activeCategory,
    sort: sortOption,
    minPrice,
    maxPrice
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
    setMinPriceInput(minPrice);
  }, [minPrice]);

  useEffect(() => {
    setMaxPriceInput(maxPrice);
  }, [maxPrice]);

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
    const isFiltering = searchTermFromUrl.length > 0 || activeCategory !== null || sortOption !== 'default' || minPrice !== undefined || maxPrice !== undefined;
    setIsPaginationMode(isFiltering);
  }, [searchTermFromUrl, activeCategory, sortOption, minPrice, maxPrice]);

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

  const handlePriceSearch = () => {
    setQuery({ 
      minPrice: minPriceInput ?? null, 
      maxPrice: maxPriceInput ?? null, 
      page: 1 
    });
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

  const priceContent = (
    <div className="price-filter-popover">
      <div style={{ marginBottom: 24, padding: '0 10px' }}>
        <Slider
          range
          min={0}
          max={10000000}
          step={50000}
          value={[minPriceInput || 0, maxPriceInput || 10000000]}
          onChange={(val) => {
            setMinPriceInput(val[0]);
            setMaxPriceInput(val[1]);
          }}
          tooltip={{ formatter: (v) => `${v.toLocaleString()}đ` }}
          trackStyle={[{ backgroundColor: '#d51c5d' }]}
          handleStyle={[{ borderColor: '#d51c5d' }, { borderColor: '#d51c5d' }]}
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 16 }}>
        <InputNumber
          min={0}
          placeholder={t('min_price')}
          value={minPriceInput}
          onChange={(v) => setMinPriceInput(v ?? undefined)}
          style={{ flex: 1 }}
          formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.replace(/\$\s?|(,*)/g, '')}
        />
        <span style={{ color: '#94a3b8' }}>-</span>
        <InputNumber
          min={0}
          placeholder={t('max_price')}
          value={maxPriceInput}
          onChange={(v) => setMaxPriceInput(v ?? undefined)}
          style={{ flex: 1 }}
          formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.replace(/\$\s?|(,*)/g, '')}
        />
      </div>
      <CButton 
        type="primary" 
        block 
        onClick={() => {
          handlePriceSearch();
          setPopoverOpen(false);
        }}
        style={{ height: '40px' }}
      >
        {t('price_apply')}
      </CButton>
    </div>
  );

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
                <Popover
                  content={priceContent}
                  title={t('price_range')}
                  trigger="click"
                  open={popoverOpen}
                  onOpenChange={setPopoverOpen}
                  placement="bottomRight"
                >
                  <div className={`bkeuty-price-filter-btn ${minPrice !== undefined || maxPrice !== undefined ? 'active' : ''}`}>
                    <span style={{ fontSize: '14px', fontWeight: 500 }}>
                      {minPrice !== undefined || maxPrice !== undefined 
                        ? `${(minPrice || 0).toLocaleString()} - ${(maxPrice || 10000000).toLocaleString()}đ` 
                        : t('price_range')}
                    </span>
                    <div className="bkeuty-price-arrow" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FilterOutlined style={{ color: '#d51c5d' }} />
                      <DownOutlined style={{ fontSize: '12px', color: '#94a3b8' }} />
                    </div>
                  </div>
                </Popover>
                <div className="bkeuty-sort-wrapper">
                  <Select
                    value={sortOption}
                    onChange={handleSortChange}
                    className="bkeuty-custom-select"
                    popupClassName="sort-select-popup"
                    popupMatchSelectWidth={true}
                    suffixIcon={
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <SortAscendingOutlined style={{ color: '#d51c5d', fontSize: '16px' }} />
                        <DownOutlined style={{ fontSize: '12px', color: '#94a3b8' }} />
                      </div>
                    }
                    variant="borderless"
                    style={{ width: '100%', height: '100%' }}
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

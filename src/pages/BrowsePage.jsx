import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { itemsApi } from '../services/api';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import ItemCard from '../components/ItemCard';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { Inbox, Compass } from 'lucide-react';

export default function BrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Read initial values from URL query params
  const [filters, setFilters] = useState({
    query: searchParams.get('query') || '',
    reportType: searchParams.get('reportType') || '',
    category: searchParams.get('category') || '',
    location: searchParams.get('location') || '',
    status: searchParams.get('status') || '',
    sort: searchParams.get('sort') || 'createdAt,desc',
    page: parseInt(searchParams.get('page') || '0', 10),
    size: 12
  });

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filters.query) params.query = filters.query;
      if (filters.reportType) params.reportType = filters.reportType;
      if (filters.category) params.category = filters.category;
      if (filters.location) params.location = filters.location;
      if (filters.status) params.status = filters.status;
      params.page = filters.page;
      params.size = filters.size;
      params.sort = filters.sort;

      const res = await itemsApi.getItems(params);
      setItems(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
      setTotalElements(res.data.totalElements || 0);
    } catch (err) {
      console.error('Error fetching items', err);
      setError('Failed to load items. Please verify your connection or try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [filters]);

  const handleSearch = (term) => {
    const updated = { ...filters, query: term, page: 0 };
    setFilters(updated);
    setSearchParams(cleanParams(updated));
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setSearchParams(cleanParams(newFilters));
  };

  const handleResetFilters = () => {
    const reset = {
      query: '',
      reportType: '',
      category: '',
      location: '',
      status: '',
      sort: 'createdAt,desc',
      page: 0,
      size: 12
    };
    setFilters(reset);
    setSearchParams({});
  };

  const handlePageChange = (newPage) => {
    const updated = { ...filters, page: newPage };
    setFilters(updated);
    setSearchParams(cleanParams(updated));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cleanParams = (obj) => {
    const p = {};
    if (obj.query) p.query = obj.query;
    if (obj.reportType) p.reportType = obj.reportType;
    if (obj.category) p.category = obj.category;
    if (obj.location) p.location = obj.location;
    if (obj.status) p.status = obj.status;
    if (obj.sort && obj.sort !== 'createdAt,desc') p.sort = obj.sort;
    if (obj.page > 0) p.page = obj.page.toString();
    return p;
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', marginBottom: '0.25rem' }}>
          <Compass size={20} />
          <span style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Campus Directory
          </span>
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Browse Lost & Found Items</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.25rem' }}>
          Search, filter, and discover all recorded belongings across campus departments
        </p>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '1.5rem' }}>
        <SearchBar
          defaultValue={filters.query}
          onSearch={handleSearch}
          placeholder="Search by keywords, titles, descriptions (e.g. calculator, watch, keys)..."
        />
      </div>

      {/* Filter Panel */}
      <div style={{ marginBottom: '2rem' }}>
        <FilterPanel
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />
      </div>

      {/* Result Count */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-muted)' }}>
          Showing <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>{items.length}</span> of{' '}
          <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>{totalElements}</span> results
        </p>
      </div>

      {/* Error alert */}
      {error && <ErrorMessage message={error} onRetry={fetchItems} />}

      {/* Items Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem 0' }}>
          <LoadingSpinner size="lg" label="Searching campus database..." />
        </div>
      ) : items.length === 0 ? (
        <div className="card" style={{
          textAlign: 'center',
          padding: '4rem 1.5rem',
          backgroundColor: '#ffffff'
        }}>
          <div style={{
            width: '4rem',
            height: '4rem',
            borderRadius: '50%',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem'
          }}>
            <Inbox size={32} />
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Items Match Your Filters</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '450px', margin: '0 auto 1.5rem', fontSize: '0.9375rem' }}>
            Try broadening your search term, clearing category filters, or checking back later as new reports are filed.
          </p>
          <button onClick={handleResetFilters} className="btn btn-secondary">
            Clear All Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid-cards">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>

          <Pagination
            currentPage={filters.page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}

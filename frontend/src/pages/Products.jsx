import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useSearchParams, Link } from 'react-router-dom';
import { productAPI, categoryAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import {
  Filter,
  Grid,
  List,
  Star,
  ShoppingCart,
  Heart,
  ChevronDown,
  X
} from 'lucide-react';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    rating: searchParams.get('rating') || '',
    sortBy: searchParams.get('sortBy') || 'name',
    search: searchParams.get('search') || ''
  });

  const { addToCart } = useCart();

  const { data: categories } = useQuery(
    'categories',
    () => categoryAPI.getCategories(),
    {
      select: (response) => response.data.categories,
    }
  );

  const {
    data: productsData,
    isLoading,
    error
  } = useQuery(
    ['products', filters],
    () => productAPI.getProducts({
      page: 1,
      limit: 20,
      ...filters
    }),
    {
      select: (response) => response.data,
      keepPreviousData: true,
    }
  );

  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    setSearchParams(params);
  }, [filters, setSearchParams]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      rating: '',
      sortBy: 'name',
      search: ''
    });
  };

  const handleAddToCart = async (product) => {
    await addToCart(product, 1);
  };

  const ProductCard = ({ product, isListView = false }) => (
    <div className={`product-card-hover group ${isListView ? 'flex gap-4' : ''}`}>
      <div className="card">
        <Link to={`/products/${product._id}`}>
          <div className={`overflow-hidden rounded-lg mb-4 ${isListView ? 'w-48 h-48 flex-shrink-0' : 'aspect-square'}`}>
            <img
              src={product.images?.[0]?.url || '/placeholder-product.jpg'}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>

        <div className={`space-y-2 ${isListView ? 'flex-1' : ''}`}>
          <Link
            to={`/products/${product._id}`}
            className="block font-semibold text-gray-900 hover:text-blue-600 transition-colors"
          >
            {product.name}
          </Link>

          <p className="text-gray-600 text-sm line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.averageRating || 0)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              ({product.numReviews || 0})
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-x-2">
              <span className="text-lg font-bold text-gray-900">
                ${product.price}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-gray-500 line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                title="Add to Wishlist"
              >
                <Heart className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleAddToCart(product)}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                title="Add to Cart"
              >
                <ShoppingCart className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Products</h1>
            <p className="text-gray-600">
              {productsData?.totalProducts || 0} products found
            </p>
          </div>

          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            {/* View Mode Toggle */}
            <div className="flex rounded-lg border border-gray-300 p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="input-field"
            >
              <option value="name">Sort by Name</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="-averageRating">Highest Rated</option>
              <option value="-createdAt">Newest First</option>
            </select>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden btn-primary"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="card sticky top-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-6">
                {/* Category Filter */}
                {categories && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="input-field"
                    >
                      <option value="">All Categories</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      className="input-field"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      className="input-field"
                    />
                  </div>
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Rating
                  </label>
                  <select
                    value={filters.rating}
                    onChange={(e) => handleFilterChange('rating', e.target.value)}
                    className="input-field"
                  >
                    <option value="">All Ratings</option>
                    <option value="4">4 Stars & Up</option>
                    <option value="3">3 Stars & Up</option>
                    <option value="2">2 Stars & Up</option>
                    <option value="1">1 Star & Up</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid/List */}
          <div className="flex-1">
            {isLoading ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                  : 'grid-cols-1'
              }`}>
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600">Error loading products. Please try again.</p>
              </div>
            ) : productsData?.products?.length > 0 ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                  : 'grid-cols-1'
              }`}>
                {productsData.products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    isListView={viewMode === 'list'}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">No products found matching your criteria.</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 btn-primary"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
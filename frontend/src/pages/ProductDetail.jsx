import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { productAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import {
  Star,
  ShoppingCart,
  Heart,
  Minus,
  Plus,
  Truck,
  Shield,
  RotateCcw,
  Share2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('description');

  const { data: product, isLoading, error } = useQuery(
    ['product', id],
    () => productAPI.getProduct(id),
    {
      select: (response) => response.data.product,
      onError: () => {
        toast.error('Product not found');
        navigate('/products');
      }
    }
  );

  const { data: relatedProducts } = useQuery(
    ['relatedProducts', id],
    () => productAPI.getRelatedProducts(id),
    {
      select: (response) => response.data.products,
      enabled: !!product,
    }
  );

  const handleAddToCart = async () => {
    if (!product) return;

    if (quantity > product.stock) {
      toast.error('Not enough stock available');
      return;
    }

    await addToCart(product, quantity);
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }

    await handleAddToCart();
    navigate('/checkout');
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= product?.stock) {
      setQuantity(newQuantity);
    }
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) =>
      prev === (product?.images?.length - 1) ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? (product?.images?.length - 1) : prev - 1
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container-custom py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="aspect-square bg-gray-200 rounded-lg"></div>
                <div className="grid grid-cols-4 gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="aspect-square bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <Link to="/products" className="btn-primary">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-blue-600">Products</Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square rounded-lg overflow-hidden bg-white">
              <img
                src={product.images?.[selectedImageIndex]?.url || '/placeholder-product.jpg'}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              {product.images?.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              {/* Sale Badge */}
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images?.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index
                        ? 'border-blue-600'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.averageRating || 0)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  {product.averageRating?.toFixed(1) || '0.0'} ({product.numReviews || 0} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  ${product.price}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xl text-gray-500 line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {product.stock > 0 ? (
                  <span className="text-green-600 font-medium">
                    ✓ In Stock ({product.stock} available)
                  </span>
                ) : (
                  <span className="text-red-600 font-medium">
                    ✗ Out of Stock
                  </span>
                )}
              </div>
            </div>

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="text-lg font-medium w-12 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= product.stock}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleBuyNow}
                    className="w-full btn-primary text-lg py-3"
                  >
                    Buy Now
                  </button>
                  <button
                    onClick={handleAddToCart}
                    className="w-full flex items-center justify-center space-x-2 bg-gray-900 text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>Add to Cart</span>
                  </button>
                  <button className="w-full flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors">
                    <Heart className="h-5 w-5" />
                    <span>Add to Wishlist</span>
                  </button>
                </div>
              </div>
            )}

            {/* Features */}
            <div className="border-t pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Truck className="h-5 w-5 text-blue-600" />
                  <span className="text-sm text-gray-600">Free Shipping</span>
                </div>
                <div className="flex items-center space-x-2">
                  <RotateCcw className="h-5 w-5 text-blue-600" />
                  <span className="text-sm text-gray-600">30-Day Returns</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span className="text-sm text-gray-600">2-Year Warranty</span>
                </div>
              </div>
            </div>

            {/* Share */}
            <div className="border-t pt-6">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                <Share2 className="h-5 w-5" />
                <span>Share this product</span>
              </button>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {['description', 'specifications', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                    activeTab === tab
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Product Details</h4>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Category:</dt>
                      <dd className="text-gray-900">{product.category?.name}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Brand:</dt>
                      <dd className="text-gray-900">{product.brand || 'N/A'}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">SKU:</dt>
                      <dd className="text-gray-900">{product.sku || 'N/A'}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Weight:</dt>
                      <dd className="text-gray-900">{product.weight || 'N/A'}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <div className="text-center py-12">
                  <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
                  {isAuthenticated && (
                    <button className="mt-4 btn-primary">
                      Write a Review
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((relatedProduct) => (
                <Link
                  key={relatedProduct._id}
                  to={`/products/${relatedProduct._id}`}
                  className="product-card-hover group"
                >
                  <div className="card">
                    <div className="aspect-square overflow-hidden rounded-lg mb-4">
                      <img
                        src={relatedProduct.images?.[0]?.url || '/placeholder-product.jpg'}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-lg font-bold text-gray-900">
                      ${relatedProduct.price}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
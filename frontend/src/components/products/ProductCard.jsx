import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product, isListView = false }) => {
  const { addToCart } = useCart();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(product, 1);
  };

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toast.success('Added to wishlist');
  };

  return (
    <div className={`product-card-hover group ${isListView ? 'flex gap-4' : ''}`}>
      <div className="card">
        <Link to={`/products/${product._id}`}>
          <div className={`overflow-hidden rounded-lg mb-4 ${isListView ? 'w-48 h-48 flex-shrink-0' : 'aspect-square'}`}>
            <img
              src={product.images?.[0]?.url || '/placeholder-product.jpg'}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>
        </Link>

        <div className={`space-y-2 ${isListView ? 'flex-1' : ''}`}>
          <Link
            to={`/products/${product._id}`}
            className="block font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2"
          >
            {product.name}
          </Link>

          {isListView && (
            <p className="text-gray-600 text-sm line-clamp-2">
              {product.description}
            </p>
          )}

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
                onClick={handleAddToWishlist}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                title="Add to Wishlist"
              >
                <Heart className="h-4 w-4" />
              </button>
              <button
                onClick={handleAddToCart}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                title="Add to Cart"
                disabled={product.stock === 0}
              >
                <ShoppingCart className="h-4 w-4" />
              </button>
            </div>
          </div>

          {product.stock === 0 && (
            <div className="text-sm text-red-600 font-medium">
              Out of Stock
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
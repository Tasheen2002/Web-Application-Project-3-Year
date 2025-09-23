import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';

const CartItem = ({ item, onUpdateQuantity, onRemove, isListView = false }) => {
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity <= 0) {
      onRemove(item.product._id);
    } else {
      onUpdateQuantity(item.product._id, newQuantity);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex gap-4">
        {/* Product Image */}
        <Link
          to={`/products/${item.product._id}`}
          className="flex-shrink-0"
        >
          <img
            src={item.product.images?.[0]?.url || '/placeholder-product.jpg'}
            alt={item.product.name}
            className="w-24 h-24 object-cover rounded-lg hover:opacity-80 transition-opacity"
          />
        </Link>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <Link
              to={`/products/${item.product._id}`}
              className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2"
            >
              {item.product.name}
            </Link>
            <button
              onClick={() => onRemove(item.product._id)}
              className="text-gray-400 hover:text-red-500 transition-colors ml-4"
              title="Remove item"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {item.product.description}
          </p>

          <div className="flex items-center justify-between">
            {/* Quantity Controls */}
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">Qty:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => handleQuantityChange(item.quantity - 1)}
                  className="p-2 hover:bg-gray-50 transition-colors"
                  disabled={item.quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 py-2 text-center min-w-[3rem]">
                  {item.quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(item.quantity + 1)}
                  className="p-2 hover:bg-gray-50 transition-colors"
                  disabled={item.quantity >= item.product.stock}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Price */}
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">
                ${(item.product.price * item.quantity).toFixed(2)}
              </div>
              {item.quantity > 1 && (
                <div className="text-sm text-gray-600">
                  ${item.product.price} each
                </div>
              )}
            </div>
          </div>

          {/* Stock Warning */}
          {item.quantity >= item.product.stock && (
            <div className="mt-2 text-sm text-amber-600">
              Only {item.product.stock} left in stock
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartItem;
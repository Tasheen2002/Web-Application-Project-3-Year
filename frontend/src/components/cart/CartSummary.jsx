import { CreditCard, Tag } from 'lucide-react';

const CartSummary = ({
  totalItems,
  totalAmount,
  onCheckout,
  isLoading = false,
  promoCode = '',
  onPromoCodeChange,
  onApplyPromo
}) => {
  const subtotal = totalAmount;
  const shipping = subtotal >= 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm sticky top-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Order Summary
      </h3>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal ({totalItems} items)</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span>
            {shipping === 0 ? (
              <span className="text-green-600">Free</span>
            ) : (
              `$${shipping.toFixed(2)}`
            )}
          </span>
        </div>

        {subtotal < 50 && (
          <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
            Add ${(50 - subtotal).toFixed(2)} more for free shipping!
          </div>
        )}

        <div className="flex justify-between text-gray-600">
          <span>Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>

        <hr className="my-4" />

        <div className="flex justify-between text-lg font-bold text-gray-900">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Promo Code */}
      <div className="mb-6">
        <div className="flex">
          <input
            type="text"
            placeholder="Promo code"
            value={promoCode}
            onChange={(e) => onPromoCodeChange && onPromoCodeChange(e.target.value)}
            className="flex-1 input-field rounded-r-none"
          />
          <button
            onClick={onApplyPromo}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-r-lg hover:bg-gray-300 transition-colors"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Checkout Button */}
      <button
        onClick={onCheckout}
        disabled={isLoading || totalItems === 0}
        className="w-full btn-primary text-lg py-3 mb-4"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="loading-spinner h-5 w-5 mr-2"></div>
            Processing...
          </div>
        ) : (
          <>
            <CreditCard className="mr-2 h-5 w-5" />
            Proceed to Checkout
          </>
        )}
      </button>

      {/* Payment Methods */}
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">We accept</p>
        <div className="flex justify-center space-x-2">
          <div className="w-8 h-5 bg-gray-200 rounded flex items-center justify-center text-xs font-bold">
            VISA
          </div>
          <div className="w-8 h-5 bg-gray-200 rounded flex items-center justify-center text-xs font-bold">
            MC
          </div>
          <div className="w-8 h-5 bg-gray-200 rounded flex items-center justify-center text-xs font-bold">
            AMEX
          </div>
        </div>
      </div>

      {/* Security Badge */}
      <div className="mt-6 text-center">
        <div className="inline-flex items-center text-sm text-gray-600">
          <Tag className="mr-1 h-4 w-4" />
          Secure checkout
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
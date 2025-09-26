import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { orderAPI, userAPI } from "../services/api";
import {
  CreditCard,
  MapPin,
  User,
  Mail,
  Phone,
  Lock,
  Check,
  ArrowLeft,
} from "lucide-react";
import toast from "react-hot-toast";

const Checkout = () => {
  const { items, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      email: user?.email || "",
      firstName: user?.name?.split(" ")[0] || "",
      lastName: user?.name?.split(" ")[1] || "",
      phone: user?.phone || "",
    },
  });

  useEffect(() => {
    if (!items || items.length === 0) {
      navigate("/cart");
      return;
    }

    // Load saved addresses
    loadAddresses();
  }, [items, navigate]);

  const loadAddresses = async () => {
    try {
      const response = await userAPI.getAddresses();
      setSavedAddresses(response.data.addresses);

      const defaultAddress = response.data.addresses.find(
        (addr) => addr.isDefault
      );
      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
        populateAddressForm(defaultAddress);
      }
    } catch (error) {
      console.error("Error loading addresses:", error);
    }
  };

  const populateAddressForm = (address) => {
    setValue("address", address.address);
    setValue("city", address.city);
    setValue("state", address.state);
    setValue("zipCode", address.zipCode);
    setValue("country", address.country);
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    populateAddressForm(address);
  };

  const calculateTotal = () => {
    const subtotal = totalAmount;
    const shipping = subtotal >= 50 ? 0 : 9.99;
    const tax = subtotal * 0.08;
    return {
      subtotal,
      shipping,
      tax,
      total: subtotal + shipping + tax,
    };
  };

  const { subtotal, shipping, tax, total } = calculateTotal();

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data) => {
    setIsProcessing(true);

    try {
      const orderData = {
        orderItems: items.map((item) => ({
          product: item.product._id,
          name: item.product.name,
          image: item.product.images?.[0]?.url || "/placeholder-product.jpg",
          price: item.product.price,
          quantity: item.quantity,
        })),
        shippingAddress: {
          fullName: `${data.firstName} ${data.lastName}`,
          address: data.address,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: data.country,
          phone: data.phone,
        },
        paymentMethod: paymentMethod === "card" ? "stripe" : paymentMethod,
        itemsPrice: subtotal,
        taxPrice: tax,
        shippingPrice: shipping,
        totalPrice: total,
      };

      const response = await orderAPI.createOrder(orderData);

      if (response.data.success) {
        await clearCart();
        toast.success("Order placed successfully!");
        navigate(`/orders/${response.data.order._id}`);
      }
    } catch (error) {
      console.error("Order creation error:", error);
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setIsProcessing(false);
    }
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step <= currentStep
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {step < currentStep ? <Check className="h-4 w-4" /> : step}
          </div>
          {step < 3 && (
            <div
              className={`w-12 h-1 mx-2 ${
                step < currentStep ? "bg-blue-600" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <button
              onClick={() => navigate("/cart")}
              className="flex items-center text-blue-600 hover:text-blue-700 mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Back to Cart
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          </div>

          <StepIndicator />

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* Step 1: Contact Information */}
                {currentStep === 1 && (
                  <div className="card">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Contact Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            {...register("firstName", {
                              required: "First name is required",
                            })}
                            className="input-field pl-10"
                            placeholder="First name"
                          />
                        </div>
                        {errors.firstName && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.firstName.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            {...register("lastName", {
                              required: "Last name is required",
                            })}
                            className="input-field pl-10"
                            placeholder="Last name"
                          />
                        </div>
                        {errors.lastName && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.lastName.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            {...register("email", {
                              required: "Email is required",
                              pattern: {
                                value: /^\S+@\S+$/i,
                                message: "Please enter a valid email",
                              },
                            })}
                            className="input-field pl-10"
                            placeholder="Email address"
                          />
                        </div>
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.email.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            {...register("phone", {
                              required: "Phone number is required",
                            })}
                            className="input-field pl-10"
                            placeholder="Phone number"
                          />
                        </div>
                        {errors.phone && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.phone.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end mt-6">
                      <button
                        type="button"
                        onClick={nextStep}
                        className="btn-primary"
                      >
                        Continue to Shipping
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Shipping Address */}
                {currentStep === 2 && (
                  <div className="card">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Shipping Address
                    </h2>

                    {/* Saved Addresses */}
                    {savedAddresses.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">
                          Choose from saved addresses
                        </h3>
                        <div className="space-y-2">
                          {savedAddresses.map((address) => (
                            <label
                              key={address._id}
                              className="flex items-start space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                            >
                              <input
                                type="radio"
                                name="savedAddress"
                                value={address._id}
                                checked={selectedAddress?._id === address._id}
                                onChange={() => handleAddressSelect(address)}
                                className="mt-1"
                              />
                              <div className="flex-1">
                                <div className="font-medium">
                                  {address.fullName}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {address.address}, {address.city},{" "}
                                  {address.state} {address.zipCode}
                                </div>
                              </div>
                            </label>
                          ))}
                        </div>
                        <hr className="my-6" />
                      </div>
                    )}

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                          <input
                            {...register("address", {
                              required: "Address is required",
                            })}
                            className="input-field pl-10"
                            placeholder="Street address"
                          />
                        </div>
                        {errors.address && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.address.message}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            City
                          </label>
                          <input
                            {...register("city", {
                              required: "City is required",
                            })}
                            className="input-field"
                            placeholder="City"
                          />
                          {errors.city && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.city.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            State
                          </label>
                          <input
                            {...register("state", {
                              required: "State is required",
                            })}
                            className="input-field"
                            placeholder="State"
                          />
                          {errors.state && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.state.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            ZIP Code
                          </label>
                          <input
                            {...register("zipCode", {
                              required: "ZIP code is required",
                            })}
                            className="input-field"
                            placeholder="ZIP code"
                          />
                          {errors.zipCode && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.zipCode.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country
                        </label>
                        <select
                          {...register("country", {
                            required: "Country is required",
                          })}
                          className="input-field"
                        >
                          <option value="">Select Country</option>
                          <option value="US">United States</option>
                          <option value="CA">Canada</option>
                          <option value="UK">United Kingdom</option>
                        </select>
                        {errors.country && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.country.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between mt-6">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="btn-secondary"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={nextStep}
                        className="btn-primary"
                      >
                        Continue to Payment
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Payment */}
                {currentStep === 3 && (
                  <div className="card">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Payment Method
                    </h2>

                    <div className="space-y-4 mb-6">
                      <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="card"
                          checked={paymentMethod === "card"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <CreditCard className="h-5 w-5 text-gray-600" />
                        <span className="font-medium">Credit/Debit Card</span>
                      </label>

                      <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="paypal"
                          checked={paymentMethod === "paypal"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <div className="w-5 h-5 bg-blue-600 rounded"></div>
                        <span className="font-medium">PayPal</span>
                      </label>

                      <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          checked={paymentMethod === "cod"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <div className="w-5 h-5 bg-green-600 rounded"></div>
                        <span className="font-medium">Cash on Delivery</span>
                      </label>
                    </div>

                    {paymentMethod === "card" && (
                      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Card Number
                          </label>
                          <div className="relative">
                            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                              type="text"
                              className="input-field pl-10"
                              placeholder="1234 5678 9012 3456"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Expiry Date
                            </label>
                            <input
                              type="text"
                              className="input-field"
                              placeholder="MM/YY"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              CVV
                            </label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                              <input
                                type="text"
                                className="input-field pl-10"
                                placeholder="123"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between mt-6">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="btn-secondary"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="btn-primary"
                      >
                        {isProcessing ? (
                          <div className="flex items-center">
                            <div className="loading-spinner h-4 w-4 mr-2"></div>
                            Processing...
                          </div>
                        ) : (
                          `Place Order - $${total.toFixed(2)}`
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="card sticky top-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Order Summary
                  </h3>

                  <div className="space-y-3 mb-6">
                    {items.map((item) => (
                      <div key={item.product._id} className="flex space-x-3">
                        <img
                          src={
                            item.product.images?.[0]?.url ||
                            "/placeholder-product.jpg"
                          }
                          alt={item.product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 line-clamp-1">
                            {item.product.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span>
                        {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-600">
                    By placing your order, you agree to our Terms of Service and
                    Privacy Policy.
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

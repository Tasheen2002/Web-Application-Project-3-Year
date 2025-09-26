import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import {
  Save,
  Upload,
  Mail,
  Bell,
  Shield,
  CreditCard,
  Globe,
  Truck,
  Store,
  Users,
  Package
} from 'lucide-react';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');

  const { register, handleSubmit, formState: { errors } } = useForm();

  // Save settings mutation
  const saveSettingsMutation = useMutation(
    (data) => {
      // API call would go here
      return Promise.resolve(data);
    },
    {
      onSuccess: () => {
        toast.success('Settings saved successfully');
      },
      onError: () => {
        toast.error('Failed to save settings');
      }
    }
  );

  const onSubmit = (data) => {
    saveSettingsMutation.mutate(data);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Store },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'integrations', label: 'Integrations', icon: Globe }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your store configuration</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-64">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">General Settings</h2>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Store Name
                      </label>
                      <input
                        {...register('storeName', { required: 'Store name is required' })}
                        className="input-field"
                        placeholder="EcomStore"
                      />
                      {errors.storeName && (
                        <p className="mt-1 text-sm text-red-600">{errors.storeName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Store Email
                      </label>
                      <input
                        {...register('storeEmail', {
                          required: 'Store email is required',
                          pattern: {
                            value: /^\S+@\S+$/i,
                            message: 'Please enter a valid email'
                          }
                        })}
                        type="email"
                        className="input-field"
                        placeholder="contact@ecomstore.com"
                      />
                      {errors.storeEmail && (
                        <p className="mt-1 text-sm text-red-600">{errors.storeEmail.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Store Phone
                      </label>
                      <input
                        {...register('storePhone')}
                        className="input-field"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Currency
                      </label>
                      <select {...register('currency')} className="input-field">
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="CAD">CAD (C$)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Store Description
                    </label>
                    <textarea
                      {...register('storeDescription')}
                      rows={4}
                      className="input-field"
                      placeholder="Describe your store..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Store Address
                    </label>
                    <textarea
                      {...register('storeAddress')}
                      rows={3}
                      className="input-field"
                      placeholder="123 Main St, City, State 12345"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Store Logo
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Store className="h-8 w-8 text-gray-400" />
                      </div>
                      <button
                        type="button"
                        className="btn-secondary"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Logo
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Settings</h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Email Notifications</h3>
                    <div className="space-y-4">
                      {[
                        { id: 'newOrders', label: 'New Orders', description: 'Get notified when new orders are placed' },
                        { id: 'lowStock', label: 'Low Stock Alerts', description: 'Alert when products are running low' },
                        { id: 'newCustomers', label: 'New Customer Registrations', description: 'Notify when new users register' },
                        { id: 'paymentReceived', label: 'Payment Received', description: 'Confirmation when payments are received' }
                      ].map((notification) => (
                        <label key={notification.id} className="flex items-start space-x-3">
                          <input
                            {...register(notification.id)}
                            type="checkbox"
                            className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <div>
                            <div className="font-medium text-gray-900">{notification.label}</div>
                            <div className="text-sm text-gray-600">{notification.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">SMS Notifications</h3>
                    <div className="space-y-4">
                      {[
                        { id: 'smsOrders', label: 'Order Updates', description: 'Send SMS for order status changes' },
                        { id: 'smsMarketing', label: 'Marketing Messages', description: 'Send promotional SMS to customers' }
                      ].map((notification) => (
                        <label key={notification.id} className="flex items-start space-x-3">
                          <input
                            {...register(notification.id)}
                            type="checkbox"
                            className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <div>
                            <div className="font-medium text-gray-900">{notification.label}</div>
                            <div className="text-sm text-gray-600">{notification.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Settings */}
            {activeTab === 'payment' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Settings</h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Methods</h3>
                    <div className="space-y-4">
                      {[
                        { id: 'stripe', label: 'Stripe', description: 'Accept credit cards and digital wallets' },
                        { id: 'paypal', label: 'PayPal', description: 'Accept PayPal payments' },
                        { id: 'cod', label: 'Cash on Delivery', description: 'Allow customers to pay on delivery' }
                      ].map((method) => (
                        <label key={method.id} className="flex items-start space-x-3">
                          <input
                            {...register(method.id)}
                            type="checkbox"
                            className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <div>
                            <div className="font-medium text-gray-900">{method.label}</div>
                            <div className="text-sm text-gray-600">{method.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stripe Publishable Key
                      </label>
                      <input
                        {...register('stripePublishableKey')}
                        className="input-field"
                        placeholder="pk_test_..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stripe Secret Key
                      </label>
                      <input
                        {...register('stripeSecretKey')}
                        type="password"
                        className="input-field"
                        placeholder="sk_test_..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        PayPal Client ID
                      </label>
                      <input
                        {...register('paypalClientId')}
                        className="input-field"
                        placeholder="Your PayPal Client ID"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tax Rate (%)
                      </label>
                      <input
                        {...register('taxRate')}
                        type="number"
                        step="0.01"
                        className="input-field"
                        placeholder="8.25"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Shipping Settings */}
            {activeTab === 'shipping' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Shipping Settings</h2>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Free Shipping Threshold ($)
                      </label>
                      <input
                        {...register('freeShippingThreshold')}
                        type="number"
                        className="input-field"
                        placeholder="50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Standard Shipping Rate ($)
                      </label>
                      <input
                        {...register('standardShippingRate')}
                        type="number"
                        step="0.01"
                        className="input-field"
                        placeholder="9.99"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Express Shipping Rate ($)
                      </label>
                      <input
                        {...register('expressShippingRate')}
                        type="number"
                        step="0.01"
                        className="input-field"
                        placeholder="19.99"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Processing Time (days)
                      </label>
                      <input
                        {...register('processingTime')}
                        type="number"
                        className="input-field"
                        placeholder="1-2"
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Zones</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">United States</div>
                          <div className="text-sm text-gray-600">Standard shipping available</div>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 text-sm">Edit</button>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">Canada</div>
                          <div className="text-sm text-gray-600">International shipping rates apply</div>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 text-sm">Edit</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Security Settings</h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Authentication</h3>
                    <div className="space-y-4">
                      <label className="flex items-center space-x-3">
                        <input
                          {...register('requireEmailVerification')}
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div>
                          <div className="font-medium text-gray-900">Require Email Verification</div>
                          <div className="text-sm text-gray-600">Users must verify email before accessing account</div>
                        </div>
                      </label>

                      <label className="flex items-center space-x-3">
                        <input
                          {...register('enableTwoFactor')}
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div>
                          <div className="font-medium text-gray-900">Two-Factor Authentication</div>
                          <div className="text-sm text-gray-600">Enable 2FA for admin accounts</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Session Timeout (minutes)
                      </label>
                      <input
                        {...register('sessionTimeout')}
                        type="number"
                        className="input-field"
                        placeholder="60"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Login Attempts
                      </label>
                      <input
                        {...register('maxLoginAttempts')}
                        type="number"
                        className="input-field"
                        placeholder="5"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Integrations */}
            {activeTab === 'integrations' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Integrations</h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Analytics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Google Analytics ID
                        </label>
                        <input
                          {...register('googleAnalyticsId')}
                          className="input-field"
                          placeholder="G-XXXXXXXXXX"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Facebook Pixel ID
                        </label>
                        <input
                          {...register('facebookPixelId')}
                          className="input-field"
                          placeholder="123456789012345"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Email Marketing</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mailchimp API Key
                        </label>
                        <input
                          {...register('mailchimpApiKey')}
                          type="password"
                          className="input-field"
                          placeholder="Your Mailchimp API Key"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          SendGrid API Key
                        </label>
                        <input
                          {...register('sendgridApiKey')}
                          type="password"
                          className="input-field"
                          placeholder="Your SendGrid API Key"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saveSettingsMutation.isLoading}
                className="btn-primary"
              >
                {saveSettingsMutation.isLoading ? (
                  <div className="flex items-center">
                    <div className="loading-spinner h-4 w-4 mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { z } from 'zod';
import { CheckCircle, CreditCard, User, MapPin, Mail, Shield, Smartphone } from 'lucide-react';

// Zod validation schema
const checkoutSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  zipCode: z.string().regex(/^\d{5}$/, 'ZIP code must be 5 digits'),
  paymentMethod: z.enum(['credit-card', 'paypal', 'apple-pay', 'google-pay'], {
    errorMap: () => ({ message: 'Please select a payment method' }),
  }),
  // Credit Card fields
  cardNumber: z.string().optional(),
  cardName: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
  // PayPal fields
  paypalEmail: z.string().optional(),
  paypalPassword: z.string().optional(),
  // Apple Pay fields
  applePayEmail: z.string().optional(),
  applePayVerified: z.boolean().optional(),
  // Google Pay fields
  googlePayEmail: z.string().optional(),
  googlePayVerified: z.boolean().optional(),
}).refine(
  (data) => {
    // Validate based on payment method
    if (data.paymentMethod === 'credit-card') {
      return (
        /^\d{16}$/.test(data.cardNumber || '') &&
        /^\d{2}\/\d{2}$/.test(data.expiryDate || '') &&
        /^\d{3}$/.test(data.cvv || '') &&
        (data.cardName || '').length >= 3
      );
    }
    if (data.paymentMethod === 'paypal') {
      return (
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.paypalEmail || '') &&
        (data.paypalPassword || '').length >= 6
      );
    }
    if (data.paymentMethod === 'apple-pay') {
      return (
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.applePayEmail || '') &&
        data.applePayVerified === true
      );
    }
    if (data.paymentMethod === 'google-pay') {
      return (
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.googlePayEmail || '') &&
        data.googlePayVerified === true
      );
    }
    return true;
  },
  (data) => {
    if (data.paymentMethod === 'credit-card') {
      return { message: 'Please fill in all credit card fields correctly', path: ['cardNumber'] };
    }
    if (data.paymentMethod === 'paypal') {
      return { message: 'Please enter valid PayPal credentials', path: ['paypalEmail'] };
    }
    if (data.paymentMethod === 'apple-pay') {
      return { message: 'Please verify your Apple Pay account', path: ['applePayEmail'] };
    }
    if (data.paymentMethod === 'google-pay') {
      return { message: 'Please verify your Google Pay account', path: ['googlePayEmail'] };
    }
    return { message: 'Invalid payment method', path: ['paymentMethod'] };
  }
);

type FormData = z.infer<typeof checkoutSchema>;
type FormErrors = Partial<Record<keyof FormData, string>>;

export function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    paymentMethod: 'credit-card' as any,
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    paypalEmail: '',
    paypalPassword: '',
    applePayEmail: '',
    applePayVerified: false,
    googlePayEmail: '',
    googlePayVerified: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  
  const totalPrice = getTotalPrice();
  
  if (items.length === 0) {
    navigate('/products');
    return null;
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handlePaymentMethodChange = (method: string) => {
    setFormData(prev => ({ 
      ...prev, 
      paymentMethod: method as any,
      // Reset verification states when changing payment method
      applePayVerified: false,
      googlePayVerified: false,
    }));
    if (errors.paymentMethod) {
      setErrors(prev => ({ ...prev, paymentMethod: undefined }));
    }
  };

  const handleVerifyApplePay = async () => {
    if (!formData.applePayEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.applePayEmail)) {
      setErrors(prev => ({ ...prev, applePayEmail: 'Please enter a valid email address' }));
      return;
    }

    setIsVerifying(true);
    // Simulate Face ID / Touch ID verification
    await new Promise(resolve => setTimeout(resolve, 2000));
    setFormData(prev => ({ ...prev, applePayVerified: true }));
    setErrors(prev => ({ ...prev, applePayEmail: undefined }));
    setIsVerifying(false);
  };

  const handleVerifyGooglePay = async () => {
    if (!formData.googlePayEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.googlePayEmail)) {
      setErrors(prev => ({ ...prev, googlePayEmail: 'Please enter a valid email address' }));
      return;
    }

    setIsVerifying(true);
    // Simulate biometric verification
    await new Promise(resolve => setTimeout(resolve, 2000));
    setFormData(prev => ({ ...prev, googlePayVerified: true }));
    setErrors(prev => ({ ...prev, googlePayEmail: undefined }));
    setIsVerifying(false);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    
    try {
      // Validate form data with Zod
      checkoutSchema.parse(formData);
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear cart and navigate to thank you page
      clearCart();
      navigate('/thank-you');
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: FormErrors = {};
        if (error.errors && Array.isArray(error.errors)) {
          error.errors.forEach(err => {
            if (err.path && err.path.length > 0) {
              newErrors[err.path[0] as keyof FormData] = err.message;
            }
          });
        }
        setErrors(newErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16">
      {/* RGB Background */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-[128px] animate-pulse"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-pink-500 rounded-full filter blur-[128px] animate-pulse delay-75"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-blue-500 rounded-full filter blur-[128px] animate-pulse delay-150"></div>
      </div>
      
      <div className="relative container mx-auto px-6">
        <div className="mb-12">
          <h1 className="mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent text-5xl md:text-6xl">
            Checkout
          </h1>
          <p className="text-gray-400 text-xl">Complete your order</p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl">Personal Information</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2 text-gray-300">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full px-4 py-4 bg-white/5 border ${errors.firstName ? 'border-red-500' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all`}
                      placeholder="John"
                    />
                    {errors.firstName && (
                      <p className="mt-2 text-red-400 text-sm">{errors.firstName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block mb-2 text-gray-300">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full px-4 py-4 bg-white/5 border ${errors.lastName ? 'border-red-500' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all`}
                      placeholder="Doe"
                    />
                    {errors.lastName && (
                      <p className="mt-2 text-red-400 text-sm">{errors.lastName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block mb-2 text-gray-300">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-4 bg-white/5 border ${errors.email ? 'border-red-500' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all`}
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="mt-2 text-red-400 text-sm">{errors.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block mb-2 text-gray-300">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-4 bg-white/5 border ${errors.phone ? 'border-red-500' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all`}
                      placeholder="1234567890"
                    />
                    {errors.phone && (
                      <p className="mt-2 text-red-400 text-sm">{errors.phone}</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Shipping Address */}
              <div className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500 to-blue-500 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl">Shipping Address</h2>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block mb-2 text-gray-300">Street Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className={`w-full px-4 py-4 bg-white/5 border ${errors.address ? 'border-red-500' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all`}
                      placeholder="123 Main St"
                    />
                    {errors.address && (
                      <p className="mt-2 text-red-400 text-sm">{errors.address}</p>
                    )}
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block mb-2 text-gray-300">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={`w-full px-4 py-4 bg-white/5 border ${errors.city ? 'border-red-500' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all`}
                        placeholder="New York"
                      />
                      {errors.city && (
                        <p className="mt-2 text-red-400 text-sm">{errors.city}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block mb-2 text-gray-300">ZIP Code</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        className={`w-full px-4 py-4 bg-white/5 border ${errors.zipCode ? 'border-red-500' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all`}
                        placeholder="12345"
                      />
                      {errors.zipCode && (
                        <p className="mt-2 text-red-400 text-sm">{errors.zipCode}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Payment Information */}
              <div className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl">Payment Method</h2>
                </div>
                
                <div className="space-y-6">
                  {/* Payment Method Selection */}
                  <div>
                    <label className="block mb-4 text-gray-300">Select Payment Method</label>
                    <div className="grid grid-cols-2 gap-4">
                      {/* Credit Card */}
                      <button
                        type="button"
                        onClick={() => handlePaymentMethodChange('credit-card')}
                        className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                          formData.paymentMethod === 'credit-card'
                            ? 'border-purple-500 bg-purple-500/10'
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <CreditCard className={`w-8 h-8 mx-auto mb-3 ${
                          formData.paymentMethod === 'credit-card' ? 'text-purple-400' : 'text-gray-400'
                        }`} />
                        <p className={`text-center ${
                          formData.paymentMethod === 'credit-card' ? 'text-purple-400' : 'text-gray-400'
                        }`}>Credit Card</p>
                      </button>

                      {/* PayPal */}
                      <button
                        type="button"
                        onClick={() => handlePaymentMethodChange('paypal')}
                        className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                          formData.paymentMethod === 'paypal'
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className={`w-8 h-8 mx-auto mb-3 flex items-center justify-center ${
                          formData.paymentMethod === 'paypal' ? 'text-blue-400' : 'text-gray-400'
                        }`}>
                          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                            <path d="M20.067 8.478c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 00-.794.68l-.04.22-.63 3.993-.028.17a.804.804 0 01-.794.679H7.72a.483.483 0 01-.477-.558L7.418 20h1.518l.95-6.02h1.385c4.678 0 7.75-2.203 8.796-6.502z"/>
                            <path d="M2.27 20.196a.487.487 0 00.48.561h4.048a.805.805 0 00.794-.68l.03-.222.63-3.993.04-.22a.805.805 0 01.795-.68h.5c3.238 0 5.774-1.314 6.514-5.12.256-1.313.192-2.446-.3-3.327h-5.583c-3.75 0-6.548 2.027-7.381 5.743l-1.567 7.938z"/>
                          </svg>
                        </div>
                        <p className={`text-center ${
                          formData.paymentMethod === 'paypal' ? 'text-blue-400' : 'text-gray-400'
                        }`}>PayPal</p>
                      </button>

                      {/* Apple Pay */}
                      <button
                        type="button"
                        onClick={() => handlePaymentMethodChange('apple-pay')}
                        className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                          formData.paymentMethod === 'apple-pay'
                            ? 'border-pink-500 bg-pink-500/10'
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className={`w-8 h-8 mx-auto mb-3 flex items-center justify-center ${
                          formData.paymentMethod === 'apple-pay' ? 'text-pink-400' : 'text-gray-400'
                        }`}>
                          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                            <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                          </svg>
                        </div>
                        <p className={`text-center ${
                          formData.paymentMethod === 'apple-pay' ? 'text-pink-400' : 'text-gray-400'
                        }`}>Apple Pay</p>
                      </button>

                      {/* Google Pay */}
                      <button
                        type="button"
                        onClick={() => handlePaymentMethodChange('google-pay')}
                        className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                          formData.paymentMethod === 'google-pay'
                            ? 'border-green-500 bg-green-500/10'
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className={`w-8 h-8 mx-auto mb-3 flex items-center justify-center ${
                          formData.paymentMethod === 'google-pay' ? 'text-green-400' : 'text-gray-400'
                        }`}>
                          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                            <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
                          </svg>
                        </div>
                        <p className={`text-center ${
                          formData.paymentMethod === 'google-pay' ? 'text-green-400' : 'text-gray-400'
                        }`}>Google Pay</p>
                      </button>
                    </div>
                    {errors.paymentMethod && (
                      <p className="mt-3 text-red-400 text-sm">{errors.paymentMethod}</p>
                    )}
                  </div>

                  {/* Credit Card Details */}
                  {formData.paymentMethod === 'credit-card' && (
                    <div className="space-y-6 pt-4 border-t border-white/10">
                      <div>
                        <label className="block mb-2 text-gray-300">Card Number</label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleChange}
                          className={`w-full px-4 py-4 bg-white/5 border ${errors.cardNumber ? 'border-red-500' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all`}
                          placeholder="1234567890123456"
                          maxLength={16}
                        />
                        {errors.cardNumber && (
                          <p className="mt-2 text-red-400 text-sm">{errors.cardNumber}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block mb-2 text-gray-300">Name on Card</label>
                        <input
                          type="text"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleChange}
                          className={`w-full px-4 py-4 bg-white/5 border ${errors.cardName ? 'border-red-500' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all`}
                          placeholder="John Doe"
                        />
                        {errors.cardName && (
                          <p className="mt-2 text-red-400 text-sm">{errors.cardName}</p>
                        )}
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block mb-2 text-gray-300">Expiry Date</label>
                          <input
                            type="text"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleChange}
                            className={`w-full px-4 py-4 bg-white/5 border ${errors.expiryDate ? 'border-red-500' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all`}
                            placeholder="MM/YY"
                            maxLength={5}
                          />
                          {errors.expiryDate && (
                            <p className="mt-2 text-red-400 text-sm">{errors.expiryDate}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block mb-2 text-gray-300">CVV</label>
                          <input
                            type="text"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleChange}
                            className={`w-full px-4 py-4 bg-white/5 border ${errors.cvv ? 'border-red-500' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all`}
                            placeholder="123"
                            maxLength={3}
                          />
                          {errors.cvv && (
                            <p className="mt-2 text-red-400 text-sm">{errors.cvv}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PayPal Details */}
                  {formData.paymentMethod === 'paypal' && (
                    <div className="space-y-6 pt-4 border-t border-white/10">
                      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
                        <div className="flex items-center gap-3 mb-2">
                          <Shield className="w-5 h-5 text-blue-400" />
                          <p className="text-blue-400">Secure PayPal Login</p>
                        </div>
                        <p className="text-gray-400 text-sm">Enter your PayPal credentials to complete the payment</p>
                      </div>

                      <div>
                        <label className="block mb-2 text-gray-300">PayPal Email</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="email"
                            name="paypalEmail"
                            value={formData.paypalEmail}
                            onChange={handleChange}
                            className={`w-full pl-12 pr-4 py-4 bg-white/5 border ${errors.paypalEmail ? 'border-red-500' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all`}
                            placeholder="your@paypal.com"
                          />
                        </div>
                        {errors.paypalEmail && (
                          <p className="mt-2 text-red-400 text-sm">{errors.paypalEmail}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block mb-2 text-gray-300">PayPal Password</label>
                        <input
                          type="password"
                          name="paypalPassword"
                          value={formData.paypalPassword}
                          onChange={handleChange}
                          className={`w-full px-4 py-4 bg-white/5 border ${errors.paypalPassword ? 'border-red-500' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all`}
                          placeholder="••••••••"
                        />
                        {errors.paypalPassword && (
                          <p className="mt-2 text-red-400 text-sm">{errors.paypalPassword}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Apple Pay Details */}
                  {formData.paymentMethod === 'apple-pay' && (
                    <div className="space-y-6 pt-4 border-t border-white/10">
                      <div className="p-4 rounded-xl bg-pink-500/10 border border-pink-500/30">
                        <div className="flex items-center gap-3 mb-2">
                          <Smartphone className="w-5 h-5 text-pink-400" />
                          <p className="text-pink-400">Apple Pay Verification</p>
                        </div>
                        <p className="text-gray-400 text-sm">Verify your identity using Face ID or Touch ID</p>
                      </div>

                      <div>
                        <label className="block mb-2 text-gray-300">Apple ID Email</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="email"
                            name="applePayEmail"
                            value={formData.applePayEmail}
                            onChange={handleChange}
                            className={`w-full pl-12 pr-4 py-4 bg-white/5 border ${errors.applePayEmail ? 'border-red-500' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition-all`}
                            placeholder="your@icloud.com"
                            disabled={formData.applePayVerified}
                          />
                        </div>
                        {errors.applePayEmail && (
                          <p className="mt-2 text-red-400 text-sm">{errors.applePayEmail}</p>
                        )}
                      </div>

                      {!formData.applePayVerified ? (
                        <button
                          type="button"
                          onClick={handleVerifyApplePay}
                          disabled={isVerifying}
                          className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:shadow-lg hover:shadow-pink-500/50 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isVerifying ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              Verifying with Face ID...
                            </>
                          ) : (
                            <>
                              <Shield className="w-5 h-5" />
                              Verify with Face ID / Touch ID
                            </>
                          )}
                        </button>
                      ) : (
                        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                          <div>
                            <p className="text-green-400">Verified Successfully</p>
                            <p className="text-gray-400 text-sm">Your Apple Pay is ready to use</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Google Pay Details */}
                  {formData.paymentMethod === 'google-pay' && (
                    <div className="space-y-6 pt-4 border-t border-white/10">
                      <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
                        <div className="flex items-center gap-3 mb-2">
                          <Smartphone className="w-5 h-5 text-green-400" />
                          <p className="text-green-400">Google Pay Verification</p>
                        </div>
                        <p className="text-gray-400 text-sm">Verify your identity using biometric authentication</p>
                      </div>

                      <div>
                        <label className="block mb-2 text-gray-300">Google Account Email</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="email"
                            name="googlePayEmail"
                            value={formData.googlePayEmail}
                            onChange={handleChange}
                            className={`w-full pl-12 pr-4 py-4 bg-white/5 border ${errors.googlePayEmail ? 'border-red-500' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all`}
                            placeholder="your@gmail.com"
                            disabled={formData.googlePayVerified}
                          />
                        </div>
                        {errors.googlePayEmail && (
                          <p className="mt-2 text-red-400 text-sm">{errors.googlePayEmail}</p>
                        )}
                      </div>

                      {!formData.googlePayVerified ? (
                        <button
                          type="button"
                          onClick={handleVerifyGooglePay}
                          disabled={isVerifying}
                          className="w-full py-4 rounded-xl bg-gradient-to-r from-green-600 to-blue-600 text-white hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isVerifying ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              Verifying...
                            </>
                          ) : (
                            <>
                              <Shield className="w-5 h-5" />
                              Verify with Biometric
                            </>
                          )}
                        </button>
                      ) : (
                        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                          <div>
                            <p className="text-green-400">Verified Successfully</p>
                            <p className="text-gray-400 text-sm">Your Google Pay is ready to use</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full px-8 py-6 rounded-xl transition-all duration-300 text-xl ${
                  isSubmitting
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg hover:shadow-purple-500/50'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Processing Payment...
                  </div>
                ) : (
                  'Complete Order'
                )}
              </button>
            </form>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/30 backdrop-blur-sm">
              <h2 className="mb-6 text-2xl">Order Summary</h2>
              
              <div className="space-y-4 mb-6 pb-6 border-b border-white/10">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-400">
                      {item.name} x {item.quantity}
                    </span>
                    <span className="text-white">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="space-y-4 mb-6 pb-6 border-b border-white/10">
                <div className="flex justify-between text-lg">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="text-gray-400">Shipping</span>
                  <span className="text-green-400">FREE</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="text-gray-400">Tax</span>
                  <span className="text-white">${(totalPrice * 0.1).toFixed(2)}</span>
                </div>
              </div>
              
              <div className="flex justify-between text-2xl">
                <span>Total</span>
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  ${(totalPrice * 1.1).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

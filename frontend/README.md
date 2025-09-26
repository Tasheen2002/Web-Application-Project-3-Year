# EcomStore Frontend

A modern, responsive e-commerce frontend built with React, Vite, and TailwindCSS.

## Features

### 🛍️ Shopping Experience
- **Product Catalog**: Browse products with filtering, sorting, and search
- **Product Details**: Detailed product pages with image gallery and reviews
- **Shopping Cart**: Add/remove items with quantity management
- **Checkout Process**: Multi-step checkout with payment integration
- **Order Management**: View order history and track shipments

### 👤 User Features
- **Authentication**: Login/Register with JWT token management
- **User Profile**: Manage personal information and addresses
- **Wishlist**: Save favorite products for later
- **Order History**: Track past and current orders

### 🔧 Admin Features
- **Dashboard**: Overview of sales, orders, and analytics
- **Product Management**: Create, edit, and manage products
- **Order Management**: Process and update order statuses
- **User Management**: View and manage customer accounts

### 🎨 Design & UX
- **Responsive Design**: Mobile-first, works on all devices
- **Modern UI**: Clean, professional design with TailwindCSS
- **Interactive Elements**: Smooth animations and transitions
- **Accessibility**: Built with accessibility best practices

## Tech Stack

- **React 18** - Frontend framework
- **Vite** - Build tool and dev server
- **TailwindCSS 3** - Utility-first CSS framework
- **React Router Dom** - Client-side routing
- **React Query** - Server state management
- **React Hook Form** - Form handling and validation
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **React Hot Toast** - Toast notifications
- **Framer Motion** - Animation library

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your configuration:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── common/         # Common/shared components
│   └── layout/         # Layout components (Header, Footer)
├── context/            # React Context providers
│   ├── AuthContext.jsx # Authentication state
│   └── CartContext.jsx # Shopping cart state
├── hooks/              # Custom React hooks
├── pages/              # Page components
│   ├── admin/          # Admin dashboard pages
│   ├── auth/           # Authentication pages
│   └── user/           # User account pages
├── services/           # API services
├── utils/              # Utility functions and constants
├── App.jsx             # Main app component
├── main.jsx            # App entry point
└── index.css           # Global styles
```

## Key Features Implemented

### 🔐 Authentication System
- JWT token-based authentication
- Automatic token refresh
- Protected routes for authenticated users
- Role-based access control (Admin/User)

### 🛒 Shopping Cart
- Local storage fallback for non-authenticated users
- Server synchronization for authenticated users
- Real-time cart updates
- Quantity management

### 💳 Checkout Process
- Multi-step checkout form
- Address management
- Payment method selection
- Order confirmation

### 📱 Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interface
- Optimized images and loading

### ⚡ Performance
- Code splitting with React.lazy
- Image optimization
- React Query caching
- Optimistic updates

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api` |
| `VITE_APP_NAME` | Application name | `EcomStore` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe public key | - |

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## API Integration

The frontend integrates with the backend API through the following services:

- **authAPI**: Authentication endpoints
- **productAPI**: Product catalog and details
- **cartAPI**: Shopping cart operations
- **orderAPI**: Order management
- **userAPI**: User profile and addresses
- **adminAPI**: Admin dashboard data

## Deployment

### Frontend Deployment Options

1. **Vercel** (Recommended)
   ```bash
   npm run build
   # Deploy to Vercel
   ```

2. **Netlify**
   ```bash
   npm run build
   # Deploy dist/ folder
   ```

3. **Static Hosting**
   ```bash
   npm run build
   # Upload dist/ folder to your hosting provider
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
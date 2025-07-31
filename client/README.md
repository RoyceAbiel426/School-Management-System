# School Management System - Frontend

This is the frontend React application for the School Management System.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🛠️ Tech Stack

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling framework
- **Axios** - HTTP client
- **Lucide React** - Icons
- **Framer Motion** - Animations
- **React Hook Form** - Form handling

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── utils/         # Utility functions and API client
└── assets/        # Static assets
```

## 🔧 Development

The application uses Vite for fast development with hot module replacement (HMR).

### Environment Variables

Create a `.env` file in the client directory:
```env
VITE_API_URL=http://localhost:5000/api
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Styling

This project uses Tailwind CSS for styling. The configuration is in `tailwind.config.js`.

## 📱 Features

- **Responsive Design** - Works on all device sizes
- **Dark/Light Mode** - Theme switching capability
- **Form Validation** - Client-side validation with React Hook Form
- **Loading States** - Proper loading indicators
- **Error Handling** - Comprehensive error management
- **Authentication** - JWT-based authentication
- **Role-based Access** - Different interfaces for students and admins

## 🔒 Security

- **Token Management** - Secure JWT token handling
- **Input Validation** - Client-side validation
- **XSS Protection** - Sanitized inputs
- **CORS Handling** - Proper cross-origin requests

## 🚀 Deployment

The application can be deployed to any static hosting service:

1. Build the application: `npm run build`
2. Deploy the `dist` folder to your hosting service

### Recommended Hosting

- **Vercel** - Optimized for React applications
- **Netlify** - Easy deployment with Git integration
- **GitHub Pages** - Free hosting for open source projects
- **AWS S3** - Scalable cloud hosting

## 🤝 Contributing

1. Follow the existing code style
2. Add proper error handling
3. Include loading states
4. Test on different screen sizes
5. Update documentation if needed

---

For backend documentation, see the server directory.

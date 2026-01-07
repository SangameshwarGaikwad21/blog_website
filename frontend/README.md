src/
│
├── api/
│   └── axios.js                # Axios instance (baseURL, interceptors)
│
├── assets/
│   ├── images/
│   └── icons/
│
├── components/
│   ├── common/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── Loader.jsx
│   │   └── ProtectedRoute.jsx
│   │
│   ├── blog/
│   │   ├── BlogCard.jsx
│   │   ├── BlogList.jsx
│   │   └── BlogForm.jsx        # Create / Edit blog
│   │
│   └── auth/
│       ├── LoginForm.jsx
│       └── SignupForm.jsx
│
├── context/
│   ├── AuthContext.jsx
│   └── BlogContext.jsx
│
├── hooks/
│   ├── useAuth.js
│   └── useBlogs.js
│
├── pages/                      # Route-level pages
│   ├── Home.jsx
│   ├── Blogs.jsx               # Show all blogs
│   ├── BlogDetails.jsx         # Single blog
│   ├── CreateBlog.jsx
│   ├── EditBlog.jsx
│   ├── Login.jsx
│   ├── Signup.jsx
│   └── Profile.jsx
│
├── routes/
│   └── AppRoutes.jsx           # React Router configuration
│
├── services/
│   ├── auth.service.js
│   └── blog.service.js
│
├── styles/
│   ├── index.css
│   └── tailwind.css
│
├── utils/
│   ├── constants.js
│   └── formatDate.js
│
├── App.jsx
├── main.jsx
└── index.html

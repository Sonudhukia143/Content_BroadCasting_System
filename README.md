# Content Broadcasting System - Frontend

A modern, role-based educational content broadcasting platform built with **Next.js**, **React**, **Tailwind CSS**, and **shadcn/ui**.

## 📋 Overview

This is the frontend application for an educational content management system where:
- **Teachers** upload subject-based educational content
- **Principals** review and approve/reject uploaded content
- **Students** view live broadcast content from a public page

## ✨ Features

### Core Features Implemented
- ✅ **Authentication System**: Email/password login with token-based session management
- ✅ **Role-Based Access Control**: Separate dashboards for teachers and principals
- ✅ **Teacher Dashboard**: Upload content with scheduling, view submission status
- ✅ **Principal Dashboard**: Review pending content, filter by status, search by title
- ✅ **Content Approval Workflow**: Approve/reject with rejection reasons
- ✅ **Public Live Page**: `/live/:teacherId` - view currently active approved content
- ✅ **File Upload**: Validate file type (JPG, PNG, GIF) and size (max 10MB)
- ✅ **Service Layer Architecture**: All API calls abstracted in services
- ✅ **State Management**: Context API with intelligent caching
- ✅ **Responsive UI**: Tailwind CSS with mobile-first design
- ✅ **Loading & Error States**: Graceful handling of async operations
- ✅ **Empty States**: User-friendly messages when no data available

### Optional Features Not Yet Implemented
- ❌ Form validation with React Hook Form + Zod
- ❌ Skeleton loaders
- ❌ Toast notifications
- ❌ React Query/TanStack Query
- ❌ Pagination for large lists
- ❌ Dark mode
- ❌ Drag-and-drop upload

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd ContentBroadCasting\ System/frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Run development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
src/
├── app/                          # Next.js app directory
│   ├── layout.jsx               # Root layout with Navbar
│   ├── page.jsx                 # Landing page
│   ├── login/page.jsx           # Login page
│   ├── [teacherId]/             # Teacher routes (protected)
│   │   ├── layout.jsx
│   │   ├── page.jsx             # Teacher dashboard
│   │   ├── upload/page.jsx      # Content upload
│   │   └── content/             # My content (TODO)
│   ├── principal/               # Principal routes (protected)
│   │   ├── layout.jsx
│   │   ├── page.jsx             # Principal dashboard
│   │   ├── approvals/page.jsx   # Pending approvals
│   │   └── content/page.jsx     # All content with filters
│   └── live/[teacherId]/page.jsx # Public live page
├── components/
│   ├── Navbar.jsx               # Navigation bar
│   ├── ProtectedRoute.jsx       # Route protection wrapper
│   └── ui/                      # shadcn/ui components
├── context/
│   └── AuthContext.jsx          # Auth + content state
├── services/
│   ├── auth.service.jsx         # Authentication logic
│   └── content.service.jsx      # Content CRUD operations
└── lib/
    ├── data.js                  # Mock database
    └── utils.jsx                # Utility functions
```

## 🔐 Authentication

### Test Credentials

**Teachers:**
```
Email: teacher1@example.com  |  Password: pass
Email: teacher2@example.com  |  Password: pass
```

**Principal:**
```
Email: principal@example.com  |  Password: pass
```

### How It Works

1. User logs in with email/password
2. `auth.service.login()` validates and returns `{ token, role }`
3. Token stored in `localStorage` and user state set in `AuthContext`
4. On page refresh, `verifyToken()` restores session
5. Protected routes check if `user.role` matches required role
6. Unauthorized users redirected to `/login`

## 🛣️ Route Structure

### Teacher Routes (Protected)
- `/:teacherId/` - Dashboard with upload stats
- `/:teacherId/upload` - Upload content form
- `/:teacherId/content` - My content (planned)

### Principal Routes (Protected)
- `/principal/` - Dashboard with approval stats
- `/principal/approvals` - Pending content review
- `/principal/content` - All content with filters

### Public Routes
- `/login` - Login page
- `/live/:teacherId` - Public live content view
- `/` - Landing page (redirects based on auth)

## 📝 API Integration

### Service Layer Pattern

All API calls go through services - **no direct API calls in components**:

```javascript
// ✅ Correct: Use service
import { uploadContent } from '@/services/content.service'
const result = await uploadContent(data)

// ❌ Wrong: Direct API call
const result = await fetch('/api/content/upload')
```

### Services

**`auth.service.jsx`**
- `login(email, password)` → `{ token, role }`
- `verifyToken(token)` → `{ email, role }`
- `logout()` → void

**`content.service.jsx`**
- `getAllContent()` → Content[]
- `getContentByTeacher(teacherId)` → Content[]
- `uploadContent(data)` → Content
- `approveContent(id)` → { success: true }
- `rejectContent(id, reason)` → { success: true }
- `getLiveContent(teacherId)` → Content[]

## 💾 State Management

Using **React Context API** for:
- User authentication state
- Content caching (teachers' content, all content)
- Dashboard stats

### Context Structure
```javascript
{
  user: { email, role },           // Current user
  loading: boolean,                // Auth initialization
  stats: { total, pending, approved, rejected },    // Teacher stats
  allStats: { total, pending, approved, rejected }, // Principal stats
  content: Content[],              // Teacher's content
  allContent: Content[],           // All content (principal view)
  login: (email, password) => Promise,
  logout: () => void,
  resetContext: () => void         // Clear all caches
}
```

### Caching Logic
- Data cached in context after first fetch
- Skip subsequent API calls if data exists
- After create/update/delete: `resetContext()` clears all caches
- Next fetch repopulates from backend

## 🎨 UI Components

Built with **shadcn/ui** and **Tailwind CSS**:
- Button, Input, Label, Textarea, Select
- Card, Badge for content display
- Responsive grid layouts
- Loading spinners
- Error messages

## 📦 Tech Stack

| Technology | Purpose |
|-----------|---------|
| **Next.js 16** | React framework |
| **React 19** | UI library |
| **Tailwind CSS 4** | Styling |
| **shadcn/ui** | Component library |
| **React Hook Form** | Form handling (installed, not used) |
| **Zod** | Validation (installed, not used) |
| **Axios** | HTTP client |
| **JavaScript ES6+** | Programming language |

## 🔧 Available Scripts

```bash
# Development server (with hot reload)
npm run dev

# Production build
npm run build

# Run production server
npm start

# Run linter
npm run lint
```

## ⚠️ Known Issues

1. **ProtectedRoute Bug**: Duplicate role condition needs fixing
   - File: `src/components/ProtectedRoute.jsx` line 12
   - Current: `user.role !== role || user.role !== role`
   - Should be: `!user || user.role !== role`

2. **Token Verification Bug**: Teacher tokens not recognized on page refresh
   - File: `src/services/auth.service.jsx` line 36-44
   - Issue: verifyToken only handles generic "teacher-token" but login returns "teacher1-token", etc.

3. **Data Mapping Bug**: startTime/endTime swapped in uploads
   - File: `src/services/content.service.jsx` line 16-17
   - Causes content times to be reversed

4. **Rejection Workflow**: Uses `prompt()` instead of professional modal

5. **Teacher Content Page**: `/[teacherId]/content` not fully implemented

## 🔄 Converting to Real Backend

To integrate with a real backend API:

1. **Update `services/auth.service.jsx`**
```javascript
export const login = async (email, password) => {
  const response = await axios.post('/api/auth/login', { email, password })
  return response.data // { token, role, email }
}
```

2. **Update `services/content.service.jsx`**
```javascript
export const getAllContent = async () => {
  const response = await axios.get('/api/content', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  })
  return response.data
}
```

3. **Replace mock data**
- Remove `lib/data.js` mock database
- Update all services to use real API endpoints

4. **Add error handling**
- Implement retry logic
- Add proper error boundaries
- Handle network failures gracefully

## 📊 Content Object Structure

```javascript
{
  id: number,              // Unique identifier
  title: string,           // Content title
  subject: string,         // Subject area
  description: string,     // Content description
  teacherId: string,       // "teacher1", "teacher2", etc.
  startTime: string,       // ISO format: "2023-01-01T10:00"
  endTime: string,         // ISO format: "2023-01-01T11:00"
  rotationDuration: number, // In minutes
  status: string,          // "pending" | "approved" | "rejected"
  rejectionReason?: string // Only if status === "rejected"
}
```

## 🎯 Performance Considerations

- ✅ Caching implemented to reduce API calls
- ⚠️ No pagination - will struggle with 1000+ items
- ⚠️ No memoization - components re-render unnecessarily
- ⚠️ No React Query - manual cache invalidation
- ⚠️ No lazy loading or code splitting

## 📱 Responsive Design

- Mobile-first Tailwind CSS approach
- Breakpoints: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px)
- Tested on common screen sizes
- Touch-friendly buttons and inputs

## 🚀 Deployment

### Deploy to Vercel (Recommended for Next.js)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables
Create `.env.local`:
```
# For real backend
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_API_TIMEOUT=30000
```

### Production Checklist
- [ ] Fix all known bugs
- [ ] Implement proper form validation (React Hook Form + Zod)
- [ ] Add error boundaries
- [ ] Implement pagination
- [ ] Add loading skeletons
- [ ] Configure CORS for backend
- [ ] Use secure HTTP-only cookies instead of localStorage
- [ ] Implement token refresh logic
- [ ] Add request retry logic
- [ ] Set up monitoring/error tracking
- [ ] Test on all supported browsers
- [ ] Perform security audit

## 📚 Related Documentation

- **frontend-notes.txt** - Detailed technical documentation
- **Next.js Docs**: https://nextjs.org/docs
- **shadcn/ui**: https://ui.shadcn.com
- **Tailwind CSS**: https://tailwindcss.com

## ❓ Troubleshooting

### Port 3000 already in use
```bash
npm run dev -- -p 3001
```

### Dependencies conflicts
```bash
rm -rf node_modules package-lock.json
npm install
```

### Token not persisting after refresh
- Check browser localStorage is enabled
- Verify `verifyToken()` matches token format from login

### Build errors
```bash
npm run lint  # Check for linting errors
npm run build # Check build errors
```

## 📄 License

This project is part of a technical assignment for evaluation purposes.

## ✅ Assignment Requirements Checklist

**Architecture:**
- [x] Clean folder structure
- [x] Separation of concerns
- [x] Service layer for API calls
- [x] Reusable components
- [x] Scalable architecture

**Pages:**
- [x] Auth page (login)
- [x] Teacher dashboard
- [x] Content upload form
- [x] Principal dashboard
- [x] Pending approvals
- [x] All content with filters
- [x] Public live page

**Functionality:**
- [x] Email/password validation
- [x] File type validation
- [x] File size validation
- [x] Time validation
- [x] Loading states
- [x] Error handling
- [x] Empty states
- [x] Search and filter

**API Integration:**
- [x] Service layer pattern
- [x] No direct component API calls
- [x] Easily replaceable design
- [x] Error handling

**Code Quality:**
- [x] Clean, readable code
- [x] Consistent structure
- [x] Proper error handling
- [ ] PropTypes validation (not implemented)
- [ ] Extensive testing (not implemented)

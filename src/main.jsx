import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home    from './pages/Home.jsx'
import Admin   from './pages/Admin.jsx'
import Payment from './pages/Payment.jsx'
import AdminPayment from './pages/admin/AdminPayment.jsx'
import AdminAccounts from './pages/admin/AdminAccounts.jsx'
import AdminReviews from './pages/admin/AdminReviews.jsx'
import AdminAnnouncements from './pages/admin/AdminAnnouncements.jsx'
import AdminGuard from './components/AdminGuard.jsx'

const router = createBrowserRouter([
  { path: '/',        element: <Home />    },
  { path: '/admin',   element: <Admin />   },
  { path: '/payment', element: <Payment /> },
  { path: '/admin/payment', element: <AdminGuard><AdminPayment /></AdminGuard> },
  { path: '/admin/accounts', element: <AdminGuard><AdminAccounts /></AdminGuard> },
  { path: '/admin/reviews', element: <AdminGuard><AdminReviews /></AdminGuard> },
  { path: '/admin/announcements', element: <AdminGuard><AdminAnnouncements /></AdminGuard> },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

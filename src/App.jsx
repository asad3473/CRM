
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import './app.css'
import SideBar from './AdminDashboard/Pages/SideBar'
import HQDashboard from './HQDashboard/Pages/HQDashboard'
import Dashboard from './AdminDashboard/Pages/Dashboard'
import Feedback from './AdminDashboard/Pages/Feedback'
import HQoverview from './AdminDashboard/Components/FeedBack/HQoverview'
import BranchPerformance from './AdminDashboard/Components/FeedBack/BranchPerformance'
import ServiceAnalytics from './AdminDashboard/Components/FeedBack/ServiceAnalytics'
import FeedbackReports from './AdminDashboard/Components/FeedBack/FeedbackReports'
import Compaign from './AdminDashboard/Components/Marketing/Compaign'
import Template from './AdminDashboard/Components/Marketing/Template'
import Audience from './AdminDashboard/Components/Marketing/Audience'
import Services from './AdminDashboard/Components/Operation/Services'
import Customers from './AdminDashboard/Components/Operation/Customers'
import Cars from './AdminDashboard/Components/Operation/Cars'
import Calendar from './AdminDashboard/Components/Operation/Calendar'
import Settings from './AdminDashboard/Pages/Settings'
import AnalyticsReports from './AdminDashboard/Components/AnalyticsReports/AnalyticsReports'
export default function App() {

  const AdminLayout = () => {
    return (
      <div className='flex '>
        <div className="fixed top-0 left-0 w-0 h-screen sm:w-64  text-white">
          <SideBar />
        </div>
        <div className="sm:ml-64 flex-1 h-screen overflow-y-auto bg-gray-50 p-4">
          <Outlet />
        </div>
      </div>
    )
  }
  const HQLayout = () => {
    return (
      <div className="flex">
        <div className="fixed top-0 left-0 h-screen w-64 bg-[#0B1F2D] text-white">
          <SideBar />
        </div>
        <div className="ml-64 flex-1 h-screen overflow-y-auto bg-gray-50 p-4">
          <Outlet />
        </div>
      </div>
    )
  }

  const router = createBrowserRouter([
    {
      path: '/',
      element: <AdminLayout />,
      children: [
        {
          path: "/dashboard", element: <Dashboard />,
        },
        {
          path: "/feedback", element: <Feedback />,
        },
        {
          path: "/feedback/hqoverview", element: <HQoverview />,
        },
        {
          path: "/feedback/performance", element: <BranchPerformance />,
        },
        {
          path: "/feedback/analytics", element: <AnalyticsReports />,
        },
        {
          path: "/feedback/report", element: <FeedbackReports />,
        },
        {
          path: "/analytics-report", element: <AnalyticsReports />,
        },
        {
          path: "/marketing/compaign", element: <Compaign/>,
        },
        {
          path: "/marketing/templates", element: <Template/>,
        },
        {
          path: "/marketing/audience", element: <Audience/>,
        },
        {
          path: "/operations/customers", element:<Customers/>,
        },
        {
          path: "/operations/services", element:<Services/>,
        },
        {
          path: "/operations/cars", element:<Cars/>,
        },
        {
          path: "/operations/calendar", element:<Calendar/>,
        },
        {
          path: "/settings", element:<Settings/>,
        },
      ]
    },
    {
      path: '/',
      element: <HQLayout />,
      children: [
        {
          path: '/', element: <HQDashboard />
        }
      ]
    }
  ])
  return <RouterProvider router={router} />
}

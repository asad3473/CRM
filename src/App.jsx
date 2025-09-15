
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import SideBar from './AdminDashboard/Pages/SideBar'
import HQoverview from './AdminDashboard/Components/FeedBack/HQoverview'
import BranchPerformance from './AdminDashboard/Components/FeedBack/BranchPerformance'
import Dashboard from './AdminDashboard/Pages/Dashboard'
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
      <div className="flex">
        <div className="fixed top-0 z-40 left-0 h-screen text-white">
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
      <div className='flex '>
        <SideBar />
        <Outlet />
      </div>
    )
  }

  const router = createBrowserRouter([
    {
      path: '/',
      element: <AdminLayout />,
      children: [
        {
          path: "/", element: <Dashboard />,
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
          path: "/marketing/compaign", element: <Compaign />,
        },
        {
          path: "/marketing/templates", element: <Template />,
        },
        {
          path: "/marketing/audience", element: <Audience />,
        },
        {
          path: "/operations/customers", element: <Customers />,
        },
        {
          path: "/operations/services", element: <Services />,
        },
        {
          path: "/operations/cars", element: <Cars />,
        },
        {
          path: "/operations/calendar", element: <Calendar />,
        },
        {
          path: "/settings", element: <Settings />,
        },
      ]
    },
    {
      path: '/',
      element: <HQLayout />,
      children: [
        // {
        //   path:'/',element:<HQDashboard/>

        // }
      ]
    }
  ])
  return <RouterProvider router={router} />
}

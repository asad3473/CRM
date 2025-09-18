
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import SideBar from './AdminDashboard/Pages/SideBar'

import { HQRoutes } from './AdminDashboard/Pages/HQRoutes'
import { BranchRoute } from './HQDashboard/Pages/BranchRoutes'
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
        <div className="fixed top-0 z-40 left-0 h-screen text-white">
          <SideBar />
        </div>
        <div className="sm:ml-64 flex-1 h-screen overflow-y-auto bg-gray-50 p-4">
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
        ...HQRoutes
      ]
    },
    {
      path: '/',
      element: <HQLayout />,
      children: [
        ...BranchRoute
      ]
    }
  ])
  return <RouterProvider router={router} />
}

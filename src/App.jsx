
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import './app.css'
import SideBar from './AdminDashboard/Pages/SideBar'
import HQDashboard from './HQDashboard/Pages/HQDashboard'
import Dashboard from './AdminDashboard/Pages/Dashboard'
export default function App() {

  const AdminLayout=()=>{
    return(
      <div className='flex '>
        <SideBar/>
        <Outlet/>
      </div>
    )
  }
  const HQLayout=()=>{
    return(
      <div className='flex '>
        <SideBar/>
        <Outlet/>
      </div>
    )
  }

  const router=createBrowserRouter([
    {
      path:'/',
      element:<AdminLayout/>,
      children:[
          {
            path:"/dashboard",element:<Dashboard/>,
          }
      ]
    },
    {
      path:'/',
      element:<HQLayout/>,
      children:[
        {
          path:'/',element:<HQDashboard/>
        }
      ]
    }
  ])
  return <RouterProvider router={router}/>
}

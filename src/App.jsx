
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import './app.css'
import SideBar from './Dashboard/Pages/SideBar'
export default function App() {

  const AdminLayout=()=>{
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
        
      ]
    }
  ])
  return <RouterProvider router={router}/>
}

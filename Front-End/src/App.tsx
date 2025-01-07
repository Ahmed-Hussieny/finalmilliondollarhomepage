import {createHashRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Layout from './Components/Layout/Layout'
import { Provider } from 'react-redux'
import { Config } from './Store/store'
import ContactUs from './Pages/ContactUs/ContactUs'
import AboutUs from './Pages/AboutUs/AboutUs'
import Login from './Pages/Login/Login'
// import ManageLogosWithoutPaying from './Pages/Admin/manageLogosWithoutPaying/manageLogosWithoutPaying'
import PolicyPage from './Pages/Policy/PolicyPage'
import HomePage from './Pages/HomePage/HomePage'
import AddPixel from './Pages/AddPixel/AddPixel'
import ManagePixels from './Pages/Admin/ManagePixels'
import UpdatePixels from './Pages/UpdatePixels/UpdatePixels'

const App = () => {
  const router = createHashRouter([
    
    {path:"/", element:<Layout/>, children:[
      {path:"/", element:<HomePage/>},
      {path:"/buyPixel", element:<AddPixel/>},
      {path:"/ContactUs", element:<ContactUs/>},
      {path:"/AboutUs", element:<AboutUs/>},
      {path: "policyPage", element: <PolicyPage />},
      {path:"/login", element:<Login/>},
      {path:"/UpdatePixels", element:<UpdatePixels/>},
      {path:"/ManagePixels", element:<ManagePixels/>}
    ],},
    
  ])
  return (
    <div className=''>
      <Provider store={Config}>
      <RouterProvider router={router}/>
      </Provider>
    </div>
  )
}

export default App

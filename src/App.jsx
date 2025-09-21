import { createBrowserRouter, RouterProvider, Outlet, useLocation } from 'react-router-dom'
import NavBar from './components/NavBar'
import SettingPage from './pages/SettingPage'
import StatusPage from './pages/StatusPage'
import SignDocuments from './pages/SignDocument'
import StatusInfo from './components/StatusInfo'
 



function Layout() {
  
    const location = useLocation();

  // Define routes where the navbar should be hidden
  const hideNavbarRoutes = ['/loading'];

  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);
  return (
    <>
       {!shouldHideNavbar && <NavBar />}
      <Outlet />
    </>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: 'setting',
        element: <SettingPage />
      },
       {
        path: 'status',
        element: <StatusPage/>
      },
      {
        path: 'sign-doc',
        element: <SignDocuments/>
      }, 
       { path: 'status/:signatureId/:documentId', element: <StatusInfo /> }, 

      // {
      //   path:'generate-potfolio',
      //   element:<ResumeForm/>
      // },
      // {
      //   path:'how-it-works',
      //   element:<HowWorks/>
      // },
      // {
      //   path:'about',
      //   element:<About/>
      // },
      // {
      //   path:'verify',
      //   element:<VerifyEmail/>
      // }
    ]
  }
])

function App() {
  
  return <RouterProvider router={router} />
}

export default App
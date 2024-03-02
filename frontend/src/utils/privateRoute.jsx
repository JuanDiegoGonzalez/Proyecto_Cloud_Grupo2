import { getToken } from '../services/auth';
import { Outlet, Navigate } from 'react-router-dom'

const PrivateRoutes=() =>  {
  const isAuthenticated = getToken();

  return isAuthenticated ?  <Outlet/>  :
    <Navigate to="/"  />
  ;
}


export default PrivateRoutes




import {Navigate, Outlet, useLocation} from 'react-router';
import { useAuth } from '../hooks/useAuth';

export default function AdminRoute(){
    const {user, isAuthenticated, isLoading} = useAuth();
    const location = useLocation();

    if(isLoading){
        return (
      <div className="flex justify-center items-center h-screen bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
    }

    // if not logged in  - admin
   if(!isAuthenticated){
       return <Navigate to={"/admin/login"} state={{from: location}} replace/>
   }

  // logged out if you not admin
  if(user?.role !== 'admin'){
     return <Navigate to='/dashboard' replace/>
  } 

  return <Outlet/>
}

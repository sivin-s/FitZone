import {Navigate, Outlet, useLocation} from 'react-router'
import { useAuth } from '../hooks/useAuth'

export default function ProtectedRoute(){
    const {isAuthenticated, isLoading} = useAuth();
    const location = useLocation();

    if(isLoading){
        return(
            <div className="flex justify-center items-center h-screen bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
        )
    }

    if(!isAuthenticated){ // not authenticated
        return <Navigate to='/login' state={{from: location}} replace/>
    }

    return <Outlet/>
}
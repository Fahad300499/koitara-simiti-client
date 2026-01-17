import { useContext } from 'react'
import { AuthContext } from '../Provider/AuthContext'




const useAuth = () => {
  const auth = useContext(AuthContext)
  console.log("Auth Context Value:", auth);
  return auth
}

export default useAuth
import { useEffect, useState } from 'react'
import {
  GoogleAuthProvider,
  getAuth,
  getRedirectResult,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut,
} from 'firebase/auth'
import { app } from '../firebase/firebase.config'
import { AuthContext } from './AuthContext'
import axios from 'axios'



const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider()

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)



  const signInWithGoogle = () => {
    setLoading(true)
    // return signInWithPopup(auth, googleProvider)
    return signInWithRedirect(auth, googleProvider)
  }

  const logOut = async () => {
    setLoading(true)
    return signOut(auth)
  }

 

  // onAuthStateChange
 useEffect(() => {

  // ১. রিডাইরেক্ট হয়ে ফিরে আসার পর রেজাল্ট চেক করা
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          console.log("Logged in after redirect:", result.user);
        }
      })
      .catch((error) => {
        console.error("Redirect Error:", error);
      });

    // ২. অ্যাথ স্ট্যাটাস চেক করা

  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    setUser(currentUser);
    
    if (currentUser?.email) {
      try {
        // Axios সরাসরি ডাটা দেয়, তাই .json() লাগবে না
        const res = await axios.get(`https://koitara-simiti-2.onrender.com/users/${currentUser.email}`);
        // ডাটাবেজের রেসপন্স অনুযায়ী ডাটা সেট করুন
        setRole(res.data.role); 
      } catch (error) {
        console.error("Error fetching role:", error);
      }
    } else {
      setRole(null);
    }
    
    setLoading(false);
  });

  return () => unsubscribe();
}, []);

  const authInfo = {
    user,
    setUser,
    signInWithGoogle,
    logOut,
   
  }

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  )
}

export default AuthProvider

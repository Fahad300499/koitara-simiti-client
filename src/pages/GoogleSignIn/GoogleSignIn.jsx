import { FcGoogle } from "react-icons/fc"; // গুগল আইকন
import { Link, useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";
import axios from "axios";

const GoogleSignIn = () => {
    const {signInWithGoogle} = useAuth();
    const navigate = useNavigate();

    // ২. গুগল দিয়ে লগইন
  const handleGoogleSignIn = async () => {
    try {
      //User Registration using google
      const { user } = await signInWithGoogle()
      const userData = {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL
      }
      await axios.post('https://koitara-simiti-2.onrender.com/users', userData)
        .then(result => {
          console.log(result.data)
        })

      navigate("/")
      toast.success('Signup Successful')
    } catch (err) {
      console.log(err)
      toast.error(err?.message)
    }
  };

    return (
        <div className="flex flex-col items-center justify-center p-4 mt-70">
            <p className="my-5">দয়া করে Google দিয়ে লগইন করুন</p>
            <button
                onClick={handleGoogleSignIn}
                className="group relative flex items-center justify-center gap-3 px-6 py-3 
                           bg-white border-2 border-gray-100 rounded-full shadow-md 
                           hover:shadow-xl hover:border-blue-400 transition-all duration-300 
                           active:scale-95 font-hind"
            >
                {/* আইকন কন্টেইনার */}
                <div className="bg-white p-1 rounded-full group-hover:scale-110 transition-transform duration-300">
                    <FcGoogle className="text-2xl" />
                </div>

                

                {/* টেক্সট কন্টেইনার */}
                <span className="text-gray-700 font-bold text-lg">
                    Continue with Google
                </span>

                {/* একটি সূক্ষ্ম গ্লো ইফেক্ট (ঐচ্ছিক) */}
                <div className="absolute inset-0 rounded-full bg-blue-400 opacity-0 group-hover:opacity-10 transition-opacity"></div>
            </button>

            <Link className="btn my-3 shadow" to="/">Go To Home</Link>
            
            <p className="mt-4 text-xl text-gray-500 font-hind">
                আপনার তথ্য আমাদের কাছে সুরক্ষিত।
            </p>
        </div>
    );
};

export default GoogleSignIn;
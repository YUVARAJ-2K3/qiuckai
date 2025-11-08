import { Heart } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react'; 
import { dummyPublishedCreationData } from '../assets/assets';
import axios from 'axios';
import toast from 'react-hot-toast';

axios.defaults.baseURL=import.meta.env.VITE_BASE_URL;


const Community = () => {
  const [creations, setCreations] = useState([]);
  const { user } = useUser();
  const [loading,setLoading] = useState(true)
  const {getToken} =useAuth()

  const fetchCreations = async () => {
    try{

      const {data} = await axios.get('/api/user/get-published-creations',{
        headers:{Authorization:`Bearer ${await getToken()}`}
      })
      if(data.success){
        setCreations(data.creations)
      }
      else{
        toast.error(data.message)
      }
    }
    catch(error){
      toast.error(error.message)

    }
    setLoading(false)
  };

  const imageLikeToggle =async(id)=>{
    try{
       const {data} = await axios.post('/api/user/toggle-like-creations',{id},{
        headers:{Authorization:`Bearer ${await getToken()}`}
      })
     
      if(data.success){
        toast.success(data.message)
        await fetchCreations()
      }
      else{
        toast.error(data.message)
      }
      
    }catch(error){
      toast.error(error.message)

    }
  }

  useEffect(() => {
    if (user) {
      fetchCreations();
    }
  }, [user]);

  return !loading ?(
    <div className="flex-1 h-full flex flex-col gap-4 p-6">
      <h2 className="text-xl font-semibold">Creations</h2>
      <div className="bg-white h-full w-full rounded-xl overflow-y-scroll p-3">
        <div className="flex flex-wrap gap-4">
          {creations.map((creation, index) => (
            <div
              key={index}
              className="relative group w-full sm:w-[48%] lg:w-[31%] rounded-lg overflow-hidden"
            >
              <img
                src={creation.content}
                alt=""
                className="w-full h-48 object-cover rounded-lg"
              />

              <div className="absolute inset-0 flex flex-col justify-end p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity text-white">
                <p className="text-sm">{creation.prompt}</p>
                <div className="flex gap-1 items-center mt-1">
                  <p>{creation.likes.length}</p>
                  <Heart onClick={()=> imageLikeToggle(creation.id)}
                    className={`w-5 h-5 cursor-pointer hover:scale-110 transition-transform ${
                      creation.likes.includes(user.id)
                        ? 'fill-red-500 text-red-600'
                        : 'text-white'
                    }`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ):(
   <div className="flex justify-center items-center w-full h-full min-h-[400px]">
  <span className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></span>
</div>
  )
};

export default Community;

'use client'

import React, {useState} from 'react'
import { useRouter } from 'next/navigation'

const UpLink = () => {

  const router = useRouter();
  const [formData, setFormData] = useState({
      vlink: ''
  });
  
  const upLink = async (e) => {

  }

    return (
        <>
            <form onSubmit={upLink}>
                <input type="text" name="vlink" placeholder="Paste Video Link"
                className="fixed right-4 text-right text-[#555] bottom-4 px-8 py-2 rounded-full bg-transparent border-[1px] border-[#111] placeholder-[#333]"
                ></input>
                <button type="submit" className="hidden"></button>
            </form>
        </>
    );

}

export default UpLink;


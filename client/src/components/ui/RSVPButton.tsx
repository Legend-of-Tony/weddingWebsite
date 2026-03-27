import {useState} from 'react'

const RSVPButton = () => {

    const [isComing, setIsComing] = useState("yes");

        console.log("RSVPButton render", isComing);
  return (
    <div className='bg-gray-300 w-1/2 rounded-full flex gap-0'>
        <button type="button" onClick={()=>setIsComing("yes")} className={`flex-1 rounded-full px-4 py-2 text-sm transition ${isComing === 'yes' ? 'bg-primary shadow-xl text-white ' : 'bg-transparent '}`} >
            YES
        </button>
        <button type="button" onClick={()=>setIsComing("no")} className={`flex-1 rounded-full px-4 py-2 text-sm transition ${isComing === 'no' ? 'bg-primary shadow-xl text-white ' : 'bg-transparent '}`} >
            NO
        </button>
        <input type="hidden" name="attending" value={isComing} />
    </div>
  )
}

export default RSVPButton
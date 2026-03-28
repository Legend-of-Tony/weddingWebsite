import GridLayout from "../../components/layout/GridLayout"
import FormImage from '../../assets/formImage.jpeg'
import RSVPButton from "../../components/ui/RSVPButton"
import { useState } from 'react';
import GuestAutocomplete from '../../components/ui/GuestAutocomplete';

const Rsvp = () => {
    const [name, setName] = useState('');

  return (
    <GridLayout id='rsvp' className='w-full bg-secondary'>
           
            <h1 className="text-7xl text-center lg:col-start-1 lg:col-span-4 lg:row-start-1 row-span-1 items-center pt-24 lg:px-0 px-4 text-accent">VIP SECTION</h1>
            <p className="text-4xl font-light text-center lg:col-start-1 lg:col-span-4 lg:row-start-2 row-span-1 items-center lg:pt-24 text-accent">RSVP NOW</p>

            <form action="" className=" grid  lg:col-start-2 lg:col-span-2 lg:row-start-3 row-span-3 gap-6 pb-24 lg:pb-0 lg:pt-24 w-full lg:h-auto h-[50vh] px-15 lg:px-0">
                
                <div className="grid gap-2 ">
                    <label htmlFor="name" className="text-accent">Name</label>
                    <GuestAutocomplete value={name} onChange={setName} />
                    {/* <input type="text" id="name" name="name" defaultValue=''className="bg-white rounded-xl px-4"/> */}
                </div>

                <div className="grid gap-2">
                    <label htmlFor="partySize" className="text-accent">How many guests in your party?</label>
                    <input type="number" id="partySize" name="partySize" min="1" defaultValue='1' className="bg-white rounded-xl outline-none px-4"/>
                </div>

                <div className="grid gap-2 ">
                    <label htmlFor="attending" className="text-accent">Will you be attending?</label>
                    <RSVPButton />
                </div>

                <button type="submit" className='bg-primary hover:bg-accent text-white hover:text-primary font-bold py-2 px-4 rounded '>Submit</button>

            </form>

            <div style={{ backgroundImage: `url(${FormImage})` }} className='w-full h-[75vh] aspect-4/3 lg:aspect-auto lg:h-full bg-cover bg-center lg:col-start-5 lg:col-span-4 lg:row-start-1 lg:row-span-9 row-span-4'>

            </div>
    </GridLayout>
  )
}

export default Rsvp
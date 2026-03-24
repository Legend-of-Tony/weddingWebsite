import GridLayout from "../../components/layout/GridLayout"

const Rsvp = () => {
  return (
    <GridLayout id='rsvp' className='w-full h-screen bg-indigo-500'>
        <div className="col-start-3 col-span-4 row-start-2 row-span-7 justify-center items-center flex flex-col">
            <h1 className="">RSVP</h1>
            <form action="" className="flex flex-col w-2/3 h-auto gap-4 items-center justify-center">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" defaultValue='Enter your Name'/>

                <div className="flex flex-row">
                    <label htmlFor="partySize">How many guests in your party?</label>
                    <input type="number" id="partySize" name="partySize" min="1" defaultValue='1'/>
                </div>

                <div>
                    <label htmlFor="attending">Will you be attending?</label>
                    <select id="attending" name="attending">
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                </div>

                <button type="submit" className='bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded'>Submit</button>
            </form>
        </div>
    </GridLayout>
  )
}

export default Rsvp
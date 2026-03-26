import GridLayout from "../../components/layout/GridLayout"

const Map = () => {
  return (
    <GridLayout id='map' className='w-full h-screen bg-primary'>
        <div id='map-container' className='col-start-1 col-span-4 row-start-2 row-span-9 '>
            <iframe width="600" height="500" className="border:0" loading="lazy" allowFullScreen src="https://www.google.com/maps/embed/v1/place?q=place_id:EigxOTE1IFcgR3VhZGFsdXBlIFJkLCBNZXNhLCBBWiA4NTIwMiwgVVNBIjESLwoUChIJqfhITpcHK4cRiP13HDBPGGUQ-w4qFAoSCZc4mjopqCuHEaQRLxUItSYs&key=AIzaSyAR7XiEpmSnVko_4a9sP2XS-BmVsEBHvGo"></iframe> 
        </div>
        <div id='details-container' className="bg-indigo-950 col-start-5 col-span-3 row-start-2 row-span-7">
            <h2>Event Details</h2>
            <hr />
            <h3>When & Where</h3>
            <hr />
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
    </GridLayout>
  )
}

export default Map
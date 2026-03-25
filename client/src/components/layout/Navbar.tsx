
import Logo from '../../assets/website_logo.png';

const Navbar = () => {
  return (
    <div className='fixed top-0 right-0  w-auto h-screen bg-amber-300/70 flex flex-col p-10 justify-between items-end  z-10'>
        <div className='flex'>
            <a href="#hero">
                <img src={Logo} alt="logo" className='w-20 h-20' />
            </a>
        </div>
        <ul className='flex flex-col gap-4 items-end'>
            <li><a href="#map">
                <button className=' hover:bg-black/50 text-4xl text-white font-bold px-4 pt-2 '>DETAILS</button>
                <hr className='text-white  w-full'/>
            </a></li>
            {/* <li><a href="#donate">Donate</a></li> */}
            <li><a href="#rsvp">
                    <button className=' hover:bg-black/50 text-4xl text-white font-bold px-4 pt-2 '>RSVP</button>
                    <hr className='text-white  w-full'/>
            </a></li>
        </ul>
    </div>
  )
}

export default Navbar
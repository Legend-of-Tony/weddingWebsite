
import Logo from '../../assets/logoPlaceholder.png';

const Navbar = () => {
  return (
    <div className='fixed top-0 right-0 left-0 w-full h-auto bg-amber-300/70 flex p-4 justify-between items-center z-10'>
        <div className='flex'>
            <a href="#hero">
                <img src={Logo} alt="logo" className='w-12 h-12' />
            </a>
        </div>
        <ul className='flex gap-4 items-center'>
            <li><a href="#map">Details</a></li>
            <li><a href="#donate">Donate</a></li>
            <li><a href="#rsvp">
                    <button className='bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded'>RSVP</button>
            </a></li>
        </ul>
    </div>
  )
}

export default Navbar

import Logo from '../../assets/website_logo.png';
import GridLayout from './GridLayout';

const Navbar = () => {
  return (
    <GridLayout className='fixed top-0 right-0  w-auto h-screen  p-10   z-10'>
        <div className='col-start-9 col-span-1 row-start-1 row-span-1 flex flex-col items-end'>
            <a href="#hero">
                <img src={Logo} alt="logo" className='w-20 h-20' />
            </a>
        </div>
        <ul className=' col-start-9 col-span-1 row-start-8 row-span-1 flex flex-col items-end'>
            <li ><a href="#map">
                <button className='btn-primary text-2xl font-semibold lg:text-4xl lg:font-extralight'>DETAILS</button>
                <hr className='text-white  w-full'/>
            </a></li>
            {/* <li><a href="#donate">Donate</a></li> */}
            <li><a href="#rsvp">
                    <button className='btn-primary text-2xl font-semibold lg:text-4xl lg:font-extralight'>RSVP</button>
                    <hr className='text-white  w-full'/>
            </a></li>
        </ul>
    </GridLayout>
  )
}

export default Navbar

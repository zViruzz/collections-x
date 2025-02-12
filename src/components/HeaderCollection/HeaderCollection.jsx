import Menu from '../../components/Menu/Menu'
import { getAuth } from 'firebase/auth'
import logo from '../../assets/logo.svg'

function HeaderCollection({ setData }) {
  const auth = getAuth()
  const user = auth.currentUser

  return (
    <header>
      <nav className='flex items-center justify-between max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8'>
        <div className='flex items-center flex-shrink-0'>
          <img
            referrerPolicy='no-referrer'
            src={`${user ? user.photoURL : 'https://th.bing.com/th/id/R.71138be7873b7220a3033fe53a77e411?rik=YpmvabLjSJyvKg&riu=http%3a%2f%2fmybookcave.com%2fapp%2fthemes%2fmybookcave%2fassets%2fimg%2fdefault-profile.png&ehk=tFRLZyr6mE8vFzpK4mK57dOtLLH0so9hugJmq8SoCUE%3d&risl=&pid=ImgRaw&r=0'}`}
            alt='Workflow'
            className='h-8 rounded-full'
          />
        </div>
        <div className='flex items-center flex-shrink-0'>
          <img
            className='h-8 w-auto'
            src={logo}
            alt='logo'
          />
        </div>
        <Menu setData={setData} />
      </nav>
    </header>
  )
}

export default HeaderCollection

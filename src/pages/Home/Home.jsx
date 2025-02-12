import { Link } from 'react-router-dom'
import useLogin from '../../hooks/useLogin'
import logo from '../../assets/logo.svg'

function Home() {
  const { isLogin } = useLogin()

  return (
    <div className='grid grid-cols-1  justify-between min-h-screen w-screen'>
      <header className='h-min'>
        <nav className='flex items-center justify-between max-w-7xl mx-auto px-3 py-3 sm:px-6 lg:px-8'>
          <div className='flex items-center flex-shrink-0 gap-3'>
            <img
              className='h-8 w-auto'
              src={logo}
              alt='logo'
            />
            <h2 className='text-sm text-inherit font-bold'>Collections X</h2>
          </div>
          <div className='block'>
            <div className='flex items-center justify-end'>
              <div className='md:block'>
                <Link
                  to='/login'
                  className='text-sm text-inherit'
                >Log in
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <main className='flex items-center justify-center h-full'>

        <div className='h-full flex flex-col gap-10'>
          <h1 className='text-2xl font-bold text-center w-60'>Collect all your links</h1>
          <div className='flex justify-center'>
            <Link
              className='w-40 h-14 bg-blue-700 rounded-lg flex items-center justify-center gap-2 transition duration-150 ease-in-out shadow-lg text-white hover:bg-blue-600 hover:text-white '
              to={`${isLogin ? '/collections' : '/login'}`}
            >
              <span className='font-bold text-sm'>Get started</span>
            </Link>
          </div>
        </div>

      </main>

    </div>
  )
}

export default Home

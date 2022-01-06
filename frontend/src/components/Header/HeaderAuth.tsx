import { useCookies } from 'react-cookie';

const HeaderAuth = () => {
  const [cookies, setCookies] = useCookies();

  if (!cookies.user) {
    return (
      <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
        <a
          href="/signin"
          className="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900"
        >
          Sign in
        </a>
        <a
          href="/signup"
          className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Sign up
        </a>
      </div>
    );
  } else {
    return (
      <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
        <p className="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900">
          Welcome Back
        </p>
      </div>
    );
  }
};

export default HeaderAuth;

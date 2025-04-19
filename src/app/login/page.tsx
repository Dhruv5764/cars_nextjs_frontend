'use client'; // Ensures this component is client-side
import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION } from '../../graphql/mutations'; 
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Use this for Next.js 13's app directory

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<any>(null); // Store user details after successful login
  const [login, { loading, error }] = useMutation(LOGIN_MUTATION);
  const router = useRouter(); // Initialize the router

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await login({ variables: { identifier: email, password } });
      if (data?.login?.user) {
        setUser(data.login.user); // Save the user data to state
        localStorage.setItem('jwt', data.login.jwt); // Optionally save JWT to localStorage
        localStorage.setItem("user",JSON.stringify(data.login.user))
        router.push('/cars'); // Redirect to the /cars page after login success
      }
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 space-y-6">
        <div className="flex justify-center">
          <img src="https://www.pluggedin.com/wp-content/uploads/2019/12/cars-2-1536x857.jpg" alt="Logo" style={{height:100,width:300}} />
        </div>
        <h2 className="text-3xl font-semibold text-center text-gray-800 mt-4">Sign in</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="email" className="text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="mt-2 p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password" className="text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="mt-2 p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 rounded-lg mt-4 hover:bg-blue-600 focus:outline-none"
          >
            {loading ? (
              <span className="flex justify-center items-center space-x-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 0116 0"
                  ></path>
                </svg>
                <span>Logging in...</span>
              </span>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        {error && <p className="mt-4 text-red-600 text-center">{error.message}</p>}

      

        <div className="text-center">
          <a href="#" className="text-sm text-blue-500 hover:underline">Forgot password?</a>
        </div>
        <div className="text-center">
          <a href="#" className="text-sm text-blue-500 hover:underline">Create an account</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

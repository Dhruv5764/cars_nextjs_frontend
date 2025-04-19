// utils/getUser.js
export const getUserFromLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      console.log("userr",JSON.stringify(user));
      
      return user ? JSON.parse(user) : null;
    }
    return null;
  };
  
import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_PUBLIC_BASE_URL}/api`;

export const login = async (identifier, password) => {
  try {
    const res = await axios.post(`${API_URL}/auth/local`, {
      identifier,
      password
    });

    // Save JWT to cookies
    Cookies.set('token', res.data.jwt, { expires: 7 });
    Cookies.set('user', JSON.stringify(res.data.user), { expires: 7 });

    return res.data;
  } catch (err) {
    throw err.response?.data?.error?.message || 'Login failed';
  }
};

export const register = async (username, email, password) => {
  try {
    const res = await axios.post(`${API_URL}/auth/local/register`, {
      username,
      email,
      password
    });

    Cookies.set('token', res.data.jwt, { expires: 7 });
    Cookies.set('user', JSON.stringify(res.data.user), { expires: 7 });

    return res.data;
  } catch (err) {
    throw err.response?.data?.error?.message || 'Registration failed';
  }
};

export const logout = () => {
  Cookies.remove('token');
  Cookies.remove('user');
};


export const isAuthenticated = () => {
  return !!Cookies.get('token');
};

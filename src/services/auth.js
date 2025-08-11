import Cookies from 'js-cookie';

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_PUBLIC_BASE_URL}/api`;

export const login = async (identifier, password) => {
  try {
    const res = await fetch(`${API_URL}/auth/local`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password })
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw errorData?.error?.message || 'Login failed';
    }

    const data = await res.json();

    // Save JWT & user to cookies
    Cookies.set('token', data.jwt, { expires: 7 });
    Cookies.set('user', JSON.stringify(data.user), { expires: 7 });

    return data;
  } catch (err) {
    throw err;
  }
};

export const register = async (username, email, password) => {
  try {
    const res = await fetch(`${API_URL}/auth/local/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw errorData?.error?.message || 'Registration failed';
    }

    const data = await res.json();

    Cookies.set('token', data.jwt, { expires: 7 });
    Cookies.set('user', JSON.stringify(data.user), { expires: 7 });

    return data;
  } catch (err) {
    throw err;
  }
};

export const logout = () => {
  Cookies.remove('token');
  Cookies.remove('user');
};

export const isAuthenticated = () => {
  return !!Cookies.get('token');
};

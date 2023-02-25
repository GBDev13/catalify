import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';
import { onSignOut } from 'src/helpers/sign-out';

const baseURL = process.env.NEXT_PUBLIC_API_URL

const ApiClient = () => {
  const defaultOptions = {
    baseURL,
  };

  const instance = axios.create(defaultOptions);

  instance.interceptors.request.use(async (request) => {
    const session = await getSession();
    if (session?.user?.access_token) {
      (request.headers as any)!.Authorization = `Bearer ${session.user?.access_token}`;
    }
    return request;
  });

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (typeof window !== 'undefined' && error?.response?.status && error.response.status === 401) {
        await onSignOut()
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export default ApiClient();
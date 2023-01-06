import axios from 'axios';
import { getSession } from 'next-auth/react';

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

  return instance;
};

export default ApiClient();
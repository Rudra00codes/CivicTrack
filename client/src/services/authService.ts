import api from '../utils/api';
import { IUser } from '../types';

export const login = (credentials: any) => {
  return api.post<IUser>('/users/login', credentials);
};

export const register = (userData: any) => {
  return api.post<IUser>('/users/register', userData);
};

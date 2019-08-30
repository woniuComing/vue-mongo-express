import {get, post } from './request';

export const userLogin = post('/users/login');
export const userRegister = post('/users/register');
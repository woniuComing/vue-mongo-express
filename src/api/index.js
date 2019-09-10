import {get, post } from './request';

export const userLogin = post('/users/login');
export const userRegister = post('/users/register');
export const userList = post('/users/list');
export const userDelete = post('/users/delete');
export const userUpdate = post('/users/update');
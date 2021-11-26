import axiosClient from "./axiosClient";
import transformToFormData from './transformToFormData';
import getToken from './getToken';
import catchAxiosErrors from './catchAxiosErrors';
import slugify from "./slugify";
import assignCustomizer from "./assignCustomizer";
import moneyFormat from "./moneyFormat";
import checkGender from "./checkGender";
import months from "./months";
import { formatTime } from "./formatTime";
import getAuthUserType from "./getUserType";
import locationRef from "./locationRef";
import getFromStorage from "./getFromStorage";
import stringSeparator from "./stringSeparator";

export { 
  transformToFormData, 
  getToken, 
  catchAxiosErrors, 
  slugify, 
  moneyFormat, 
  assignCustomizer, 
  checkGender, 
  months, 
  formatTime,
  getAuthUserType, 
  locationRef,
  getFromStorage,
  stringSeparator,
};

export default axiosClient;
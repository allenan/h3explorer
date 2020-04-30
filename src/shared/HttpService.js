import { endpoints } from "./app.constant";
import axiosInstance from "./axios";



/**
 * @author Ashish Yadav
/**
 * @description API URL {{location-gateway-url}}/panel_api/h3/all"
 */
export const getAllHex = _ => {
  return axiosInstance
    .get(`${endpoints.fetchAllHexa}`)
    .then(res => res)
    .catch(error => error);
};


export const getAllActiveHex = _ => {
  return axiosInstance
    .get(`${endpoints.fetchAllActiveHex}`)
    .then(res => res)
    .catch(error => error);
};

export const saveHex = param => {
  return axiosInstance
    .post(`${endpoints.saveHex}`, param)
    .then(res => res)
    .catch(error => error);
};




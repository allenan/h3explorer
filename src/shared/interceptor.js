import React, { useEffect } from 'react';

import { notification } from 'antd';

import axiosInstance from './axios';

const WithErrorhandler = WrappedComponent => {
  return function Hanlder(props) {
    const reqInterceptor = axiosInstance.interceptors.request.use(req => {
    //   req.headers["X-Client-App"] = `react`;
    //   req.headers["X-Client-Version"] = process.env.REACT_APP_VERSION;
    //   req.headers["X-Client-OS-Type"] = window.navigator.platform.split(" ")[0];
    //   req.headers["X-Client-OS-Version"] = window.navigator.appVersion.split(
    //     " "
    //   )[0];
      return req;
    });
    const resInterceptor = axiosInstance.interceptors.response.use(
      res => {
        if (res.status === 200) {
          return res.data;
        } else if (res.status === 400) {
          return res;
        } else if (res.status === 401) {
          return res;
        } else if (res.status === 500) {
          return res;
        } else {
          return res;
        }
      },
      err => {
        console.error("err", err.response);
        notification.destroy();
        openNotification(err.response.data.message);
        return err.response.data;
      }
    );
    useEffect(() => {
      return () => {
        axiosInstance.interceptors.request.eject(reqInterceptor);
        axiosInstance.interceptors.response.eject(resInterceptor);
      };
    }, [reqInterceptor, resInterceptor]);

    const openNotification = title => {
      notification.error({
        message: "Error",
        description: title
      });
    };

    return (
        <WrappedComponent {...props}></WrappedComponent>
    );
  };
};
export default WithErrorhandler;

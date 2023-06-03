import { useEffect } from 'react';
import React, { useState,useContext } from 'react';
import Cookies from 'js-cookie';

const User = () => {

      useEffect(async () => {
      const code = Cookies.get('cognitoCode');
      console.log("Hi");
      console.log(code);
      if (code) {
        const response = await fetch(`/api/userinfo`, {
          headers: {
            Authorization: `Bearer ${code}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
      }
      }
      ,[]);

  return (
  <div>
    Hi
  </div>
    );
};

export default User;

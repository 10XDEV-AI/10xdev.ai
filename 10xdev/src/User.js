import { useEffect } from 'react';
import React from 'react';
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
        console.log(data);
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

import type { NextPage } from 'next'
import {Cadastro} from "../containers/Cadastro";
import {useEffect, useState} from "react";
import {Home} from "../containers/Home";

const Register: NextPage = () => {
  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    if(typeof window !== 'undefined'){
      const token = localStorage.getItem('accessToken');
      if(token){
        setAccessToken(token);
      }
    }
  }, [setAccessToken]);
  return (
      !accessToken ? <Cadastro setAccessToken={setAccessToken} /> : <Home setAccessToken={setAccessToken} />
  )
}

export default Register

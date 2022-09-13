

import React, {MouseEvent, useState} from "react";
import {executeRequest} from "../services/apiServices";
import {NextPage} from "next";
import {string} from "prop-types";
import {AccessTokenProps} from "../types/AccessTokenProps";
import Router from "next/router";

//Gerenciamento de state por hooks

export const Cadastro:NextPage<AccessTokenProps> = ({setAccessToken}) => {

    //const = constante, contexto global
    //let variável, contexto local
    //var variável, contexto global (não usar)
    const [nome, setNome] = useState('');
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const doRegister = async (evento: MouseEvent) => {
        try {
            evento.preventDefault();
            setMessage('');
            //Early return: testar os caminhos de erro e retornar anteriormente
            if(!login || !password || !nome){
                return setMessage('Favor informar nome, usuário e senha!');
            }

            const body = {email: login, password, name: nome};

            const result = await executeRequest('user', 'POST', body);
            if(!result || !result.data){
                return setMessage('Ocorreu um erro ao processar cadastro, tente novamente!');
            }

            const {msg} = result.data;
            setMessage(msg + '\n, redirecionando para a página de login...');
            setTimeout(() => {
                Router.push('/');
            }, 4000)
        }catch (e: any){
            console.log(e);
            if(e?.response?.data?.error){
                return setMessage(e?.response?.data?.error);
            }

            return setMessage('Ocorreu um erro ao processar cadastro, tente novamente!');
        }
    }
    //Tag específica do React quando não se quer usar div, por exemplo. (<>)
    return (
        // <>
            <div className="container-login">
                <img src="/logo.svg" alt="Logo FIAP" className="logo"/>
                <form>
                    <p className="error">{message}</p>
                    <div className="input">
                        {/* Perdão pelo ícone na cor errada, não consegui achar na cor adequada*/}
                        <img src="/person.svg" alt="Informe seu nome"/>
                        <input type="text" placeholder="Nome" value={nome} onChange={evento => setNome(evento.target.value)}/>
                    </div>
                    <div className="input">
                        <img src="/mail.svg" alt="Informe seu Login"/>
                        <input type="text" placeholder="Login" value={login} onChange={evento => setLogin(evento.target.value)}/>
                    </div>
                    <div className="input">
                        <img src="/lock.svg" alt="Informe sua senha"/>
                        <input type="password" placeholder="Senha" value={password} onChange={evento => setPassword(evento.target.value)}/>
                        {/*<img className="password" src="/eye.svg" alt="Ver senha senha"/>*/}

                    </div>
                    <button onClick={doRegister}>Cadastrar</button>
                {/*    Isso seria diferente de passar, por exemplo, doLogin() (nesse caso, seria como falar para executar a função quando o elemento carregasse*/}
                </form>
            </div>
        // </>
    );
}
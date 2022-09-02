import { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import { Filter } from '../components/Filter';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { List } from '../components/List';
import { executeRequest } from '../services/apiServices';
import { AccessTokenProps } from '../types/AccessTokenProps';
import { Task } from '../types/Task';

export const Home : NextPage<AccessTokenProps> = ({setAccessToken}) => {

    const [tasks, setTasks] = useState<Task[]>([]);
    const [previsionDateStart, setPrevisionDateStart] = useState('');
    const [previsionDateEnd, setPrevisionDateEnd] = useState('');
    const [status, setStatus] = useState('0');

    const getFilteredList = async() =>{
        try{
            let query = '?status=' + status;

            if(previsionDateStart){
                query += '&previsionDateStart=' + previsionDateStart;
            }

            if(previsionDateEnd){
                query += '&previsionDateEnd=' + previsionDateEnd;
            }

            const result = await executeRequest('task' + query, 'GET');
            if(result && result.data){
                setTasks(result.data);
            }
        }catch(e){
            console.log(e);
        }
    }

    useEffect(() =>{
        getFilteredList();
    }, [
        previsionDateStart, previsionDateEnd, status
    ]);

    const sair = () =>{
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userName');
        localStorage.removeItem('userMail');
        setAccessToken('');
    }

    return (
        <>
            <Header sair={sair}/>
            <Filter setPeriodoDe={setPrevisionDateStart} setPeriodoAte={setPrevisionDateEnd} setStatus={setStatus} 
            periodoDe={previsionDateStart} periodoAte={previsionDateEnd} status={status}
            />
            <List tasks={tasks} getFilteredList={getFilteredList} />
            <Footer />
        </>
    );
}
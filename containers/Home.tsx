import { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
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

    //Modal
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState('');
    const [name, setName] = useState('');
    const [modalPrevisionDateStart, setFormPrevisionDateStart] = useState('');


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

    const salvar = async () => {
        try {
            if(!name || !name.trim() || !modalPrevisionDateStart || !modalPrevisionDateStart.trim()){
                setError('Favor preencher formulário');
                return;
            }
            const body = {
                name: name,
                previsionDate: modalPrevisionDateStart
            }

            await executeRequest('task', 'POST', body);
            await getFilteredList();   
            closeModal();
        } catch (error: any) {
            if(error?.response?.data?.error){
                setError(error?.response?.data?.error);
            }else{
                setError('Ocorreu um erro ao salvar a tarefa!');
            }
        }
    }

    const closeModal = () => {
        setName('');
        setFormPrevisionDateStart('');
        setError('');
        setShowModal(false);
    }

    return (
        <>
            <Header sair={sair} setShowModal={setShowModal}/>
            <Filter setPeriodoDe={setPrevisionDateStart} setPeriodoAte={setPrevisionDateEnd} setStatus={setStatus} 
            periodoDe={previsionDateStart} periodoAte={previsionDateEnd} status={status}
            />
            <List tasks={tasks} getFilteredList={getFilteredList} />
            <Footer setShowModal={setShowModal} />
            <Modal 
            show={showModal}
            onHide={closeModal}
            className="container-modal"
            >
                <Modal.Body>
                    <p>Adicionar tarefa</p>
                    {error && <p className='error'>{error}</p>}
                    <input
                        type="text"
                        placeholder='Nome da tarefa'
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                    <input
                        type={modalPrevisionDateStart ? 'date' : 'text'}
                        onFocus={e => e.target.type = 'date'}
                        onBlur={e => modalPrevisionDateStart ? e.target.type = 'date' : e.target.type = 'text'}
                        placeholder='Data de Previsão'
                        value={modalPrevisionDateStart}
                        onChange={e => setFormPrevisionDateStart(e.target.value)}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <div className='button col-12'>
                        <button onClick={salvar}>Salvar</button>
                        <button onClick={closeModal}>Fechar</button>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
}
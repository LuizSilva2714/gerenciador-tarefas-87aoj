import { NextPage } from 'next';
import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Task } from '../types/Task';
import { Item } from './Item';
import { executeRequest } from '../services/apiServices';
import moment from 'moment';


type ListProps = {
    tasks: Task[],
    getFilteredList(): void
}

export const List: NextPage<ListProps> = ({tasks, getFilteredList}) => {

    //Modal
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState('');
    const [_id, setId] = useState('');
    const [name, setName] = useState('');
    const [modalPrevisionDateStart, setFormPrevisionDateStart] = useState('');
    const [modalPrevisionDateEnd, setFormPrevisionDateEnd] = useState<string|undefined>('');

    const selectToEdit = (task: Task) =>{
        setId(task._id);
        setName(task.name);
        setFormPrevisionDateStart(moment(task.previsionDate).format('yyyy-MM-DD'));
        setFormPrevisionDateEnd(task.finishDate);
        setShowModal(true);
    }

    const closeModal = () => {
        setName('');
        setFormPrevisionDateStart('');
        setError('');
        setShowModal(false);
    }

    const atualizar = async () => {
        try {
            if(!name || !name.trim() || !modalPrevisionDateStart || !modalPrevisionDateStart.trim()
            || !_id || !_id.trim()
            ){
                setError('Favor preencher formulário');
                return;
            }
            const body = {
                name: name,
                previsionDate: modalPrevisionDateStart,
                finishDate: modalPrevisionDateEnd,
            }

            await executeRequest('task?id=' + _id, 'PUT', body);
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

    return (
        <>
        <div className={"container-listagem" + (tasks && tasks.length > 0 ? "" : " vazia")}>
            {
                tasks &&tasks.length > 0 ?
                    tasks.map(t => <Item key={t._id} task={t} selectTaskToEdit={selectToEdit} /> )
                    : <>
                        <img src="not-found.svg" alt="Nenhuma atividade encontrada"/>
                        <p>Você ainda não possui tarefas cadastradas!</p>
                    </>
            }

        </div>
        <Modal 
            show={showModal}
            onHide={closeModal}
            className="container-modal"
            >
                <Modal.Body>
                    <p>Editar tarefa</p>
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
                    <input
                        type={modalPrevisionDateEnd ? 'date' : 'text'}
                        onFocus={e => e.target.type = 'date'}
                        onBlur={e => modalPrevisionDateEnd ? e.target.type = 'date' : e.target.type = 'text'}
                        placeholder='Data de Conclusão'
                        value={modalPrevisionDateEnd}
                        onChange={e => setFormPrevisionDateEnd(e.target.value)}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <div className='button col-12'>
                        <button onClick={atualizar}>Salvar</button>
                        <button onClick={closeModal}>Fechar</button>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
}

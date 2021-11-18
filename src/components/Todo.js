import React, { useState, useEffect } from 'react';
import TodoForm from './TodoForm';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { confirmDialog } from 'primereact/confirmdialog';

function Todo({ todos, completeTodo, removeTodo, updateTodo, hideRegister }) {
  const [edit, setEdit] = useState({
    id: null,
    value: '',
    isComplete: false,
  });

  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [listFinished, setListFinished] = useState([]);

  useEffect(() => {
    setListFinished(todos);
    setIsFinished(false);
  }, [todos]);

  const submitUpdate = (value) => {
    updateTodo(edit.id, value.text.trim());
    setEdit({
      id: null,
      value: '',
      isComplete: false,
    });
  };

  const showEditTodo = (todo) => {
    hideRegister();
    setEdit({
      id: todo.id,
      value: todo.text,
      isComplete: todo.isComplete,
    });
  };

  const handleSelectAll = () => {
    const isSelected = todos.filter((todo) => todo.isComplete !== true);
    if (isSelected.length > 0 && !isFinished) {
      setIsCheckAll(!isCheckAll);
      setIsCheck(listFinished.map((todo) => todo.id.toString()));
    }
  };

  const handleUnSelectAll = () => {
    setIsCheck([]);
  };

  const handleSelect = (e) => {
    const { id, checked } = e.target;
    setIsCheck([...isCheck, id]);
    if (!checked) {
      setIsCheck(isCheck.filter((item) => item !== id));
    }
  };

  const handleFinishAll = () => {
    isCheck.forEach((id) => {
      completeTodo(parseInt(id));
    });
    setIsCheck([]);
  };

  const dateCheckbox = (data) => {
    if (!data.isComplete)
      return (
        <Checkbox
          id={data.id.toString()}
          onChange={handleSelect}
          checked={isCheck.includes(data.id.toString())}
        ></Checkbox>
      );
  };

  const dateTask = (data) => {
    if (data.isComplete) {
      return <div className='font-bold'>{data.text}</div>;
    }
    return data.text;
  };

  const rowClassTask = (data) => {
    return {
      'bg-orange-300': data.isComplete === true,
    };
  };

  const dateActions = (data) => {
    return (
      <div key={data.id}>
        {!data.isComplete ? (
          <Button
            className='m-2'
            icon='pi pi-pencil'
            label='Editar'
            onClick={() => showEditTodo(data)}
          />
        ) : null}
        <Button
          className='m-2 p-button-danger'
          icon='pi pi-times'
          label='Excluir'
          onClick={() => confirmRemoveTodo(data.id)}
        />
        {!data.isComplete ? (
          <Button
            className='m-2 p-button-success'
            icon='pi pi-check'
            label='Finalizar'
            onClick={() => confirmCompleteTodo(data.id)}
          />
        ) : null}
      </div>
    );
  };

  const confirmRemoveTodo = (id) => {
    confirmDialog({
      message: 'Tem certeza que deseja excluir a tarefa?',
      header: 'Excluir tarefa',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      acceptClassName: 'p-button-danger',
      accept: () => removeTodo(id),
    });
  };

  const confirmCompleteTodo = (id) => {
    confirmDialog({
      message: 'Tem certeza que deseja finalizar a tarefa?',
      header: 'Finalizar tarefa',
      icon: 'pi pi-info-circle',
      acceptLabel: 'Finalizar',
      rejectLabel: 'Cancelar',
      acceptClassName: 'p-button-success',
      accept: () => completeTodo(id),
    });
  };

  const confirmHandleFinishAll = () => {
    if (isCheck.length > 0) {
      confirmDialog({
        message: 'Tem certeza que deseja finalizar a(s) tarefa(s)?',
        header: 'Finalizar tarefa(s)',
        icon: 'pi pi-info-circle',
        acceptLabel: 'Finalizar toda(s)',
        rejectLabel: 'Cancelar',
        acceptClassName: 'p-button-success',
        accept: () => handleFinishAll(),
      });
    }
  };

  const handleFilterIsFinished = () => {
    setIsCheck([]);
    setIsFinished(!isFinished);
    if (!isFinished) {
      setListFinished(listFinished.filter((item) => item.isComplete === true));
      return;
    }
    setListFinished(todos);
  };

  if (edit.id) {
    return <TodoForm edit={edit} onSubmit={submitUpdate} />;
  }

  return (
    <>
      <div className='card mt-5 mb-5 fadeinleft animation-duration-500 datatable-style'>
        <div className='p-col-12 mb-2'>
          <Checkbox
            inputId='filter'
            onChange={handleFilterIsFinished}
            checked={isFinished}
          ></Checkbox>
          <label htmlFor='filter' className='p-checkbox-label ml-1'>
            Mostrar apenas tarefas concluídas
          </label>
        </div>
        <DataTable
          value={listFinished}
          responsiveLayout='scroll'
          rowClassName={rowClassTask}
        >
          <Column field='' body={dateCheckbox}></Column>
          <Column
            field='text'
            header='Tarefa'
            sortable={true}
            body={dateTask}
            className='task'
          ></Column>
          <Column header='Ações' body={dateActions}></Column>
        </DataTable>
      </div>
      {listFinished.length === isCheck.length ? (
        <Button
          icon='pi pi-list'
          className='p-button-secondary m-2 fadein animation-duration-500'
          label='Desmarcar todos'
          onClick={handleUnSelectAll}
        />
      ) : (
        <Button
          icon='pi pi-list'
          className='p-button-secondary m-2 fadein animation-duration-500'
          label='Selecionar todos'
          onClick={handleSelectAll}
        />
      )}
      <Button
        icon='pi pi-check'
        className='p-button-success m-2 fadein animation-duration-500'
        label='Finalizar selecionados'
        onClick={confirmHandleFinishAll}
      />
    </>
  );
}

export default Todo;

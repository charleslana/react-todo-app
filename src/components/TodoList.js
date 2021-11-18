import React, { useState, useRef } from 'react';
import Todo from './Todo';
import TodoForm from './TodoForm';
import { Toast } from 'primereact/toast';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [hidden, setHidden] = useState(false);

  const toast = useRef(null);

  const addTodo = (todo) => {
    todo.text = todo.text.trim();
    const existTodo = todos.some(
      (item) => item.text.toLowerCase() === todo.text.toLowerCase().trim()
    );

    if (!todo.text) {
      return;
    }

    if (existTodo) {
      toast.current.show({
        severity: 'error',
        detail: 'Já existe uma tarefa com a mesma descrição.',
      });
      return;
    }

    const newsTodos = [todo, ...todos];

    setTodos(newsTodos);

    toast.current.show({
      severity: 'success',
      detail: 'Tarefa adicionada com sucesso.',
    });
  };

  const updateTodo = (todoId, newValue) => {
    setHidden(false);

    if (!newValue) {
      return;
    }

    const existTodo = todos.some(
      (item) =>
        item.text.toLowerCase() === newValue.toLowerCase().trim() &&
        item.id !== todoId
    );

    if (existTodo) {
      toast.current.show({
        severity: 'error',
        detail: 'Já existe uma tarefa com a mesma descrição.',
      });
      return;
    }

    setTodos((prevState) =>
      prevState.map((item) =>
        item.id === todoId ? { ...item, text: newValue } : item
      )
    );

    toast.current.show({
      severity: 'success',
      detail: 'Tarefa atualizada com sucesso.',
    });
  };

  const removeTodo = (id) => {
    const removeArray = [...todos].filter((todo) => todo.id !== id);

    setTodos(removeArray);

    toast.current.show({
      severity: 'success',
      detail: 'Tarefa excluída com sucesso.',
    });
  };

  const completeTodo = (id) => {
    let updatedTodos = todos.map((todo) => {
      if (todo.id === id && !todo.isComplete) {
        todo.isComplete = !todo.isComplete;
      }
      return todo;
    });

    setTodos(updatedTodos);

    toast.current.show({
      severity: 'success',
      detail: 'Tarefa(s) finalizada(s) com sucesso.',
    });
  };

  const hideRegister = () => {
    setHidden(true);
  };

  return (
    <div className='grid justify-content-center'>
      <div className='col-12 md:col-12 lg:col-9'>
        <h1 className='text-5xl'>My TODO List</h1>
        <Toast ref={toast} />
        <TodoForm onSubmit={addTodo} hidden={hidden ? true : false} />
        {todos.length > 0 ? (
          <Todo
            todos={todos}
            completeTodo={completeTodo}
            removeTodo={removeTodo}
            updateTodo={updateTodo}
            hideRegister={hideRegister}
          />
        ) : null}
      </div>
    </div>
  );
}

export default TodoList;

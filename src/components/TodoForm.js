import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

function TodoForm(props) {
  const [input, setInput] = useState(props.edit ? props.edit.value : '');
  const [count, setCount] = useState(1);

  const inputRef = useRef(null);

  useEffect(() => {
    if (props.edit) {
      inputRef.current.focus();
    }
  });

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    props.onSubmit({
      id: count,
      text: input,
      isComplete: false,
    });

    setInput('');

    if (input.trim() !== '') {
      setCount(count + 1);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {props.edit ? (
        <div className='formgroup-inline'>
          <div className='field'>
            <InputText value={input} onChange={handleChange} ref={inputRef} />
          </div>
          <Button label='Atualizar' />
        </div>
      ) : (
        <div className={`formgroup-inline ${props.hidden ? 'hidden' : ''}`}>
          <div className='field'>
            <label>Descrição:</label>
            <InputText value={input} onChange={handleChange} ref={inputRef} />
          </div>
          <Button
            icon='pi pi-plus'
            className='p-button-secondary'
            label='Cadastrar'
          />
        </div>
      )}
    </form>
  );
}

export default TodoForm;

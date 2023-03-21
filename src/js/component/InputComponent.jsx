
import React, { useState, useEffect } from "react";

const InputComponent = () => {
  const URL = "https://assets.breatheco.de/apis/fake/todos/user/jorge2";
  const [inputValue, setInputValue] = useState("");
  const [tasks, setTasks] = useState([]);
  const [check, setCheck] = useState(false);
  const [checkedTasks, setCheckedTasks] = useState([]);

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleTask = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      setTasks([...tasks, { label: inputValue, done: false }]);
      editList();
      setInputValue("");
    }
  };
const getTaskList =() =>{
  setCheck(true);
  fetch(URL, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => {
    console.log(response.ok);
    console.log(response.status);
    setCheck(false)
    return response.json()}
    )
    .then((data) => {
      
      console.log(data);
      setTasks(data);
    })
    .catch((error) => {
      console.log(error);
    });
}
  useEffect(() => {
  getTaskList();
  }, []);

  const editList = () => {
    fetch(URL, {
      method: "PUT",
      body: JSON.stringify(tasks),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        console.log(response.ok);
        console.log(response.status);
        console.log(response.text());
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setTasks(data); 
      })
      .catch((error) => {
        console.log(error);
      });
      
  };
  

  const handleDelete =(taskId) =>{
    
    setTasks(tasks.filter((task, index) => index !== taskId));
    
    editList()
  }
  const handleCheckedDelete =(taskId) =>{
    
    setCheckedTasks(checkedTasks.filter((task, index) => index !== taskId));
    editList()
  }
const consultCheck = (e, index) => {
  const newTasks = [...tasks];
  newTasks[index].done = e.target.checked;
  setTasks(newTasks);
  editList();
  if (e.target.checked) {
    const completedTask = tasks[index];
    setCheckedTasks([...checkedTasks, completedTask]);
    setTasks(tasks.filter((task, i) => i !== index));
  }

  
}
  return (
    <>
    
      <div className="inputContainer">
        <input
          type="text"
          onChange={handleChange}
          value={inputValue}
          onKeyDown={handleTask}
        />
      </div>

      <div className="TodoList">
        <div className="tarea">
        {check ? <div>...loading</div> :tasks.length === 0 ? <div>No hay taréas todavía</div> : tasks.map((task, index) => (
            <div className="task" key={index}>
             <div >{task.label}</div>
             <input
                  type="checkbox"
                  key={index}
                  name="topping"
                  checked={task.done}
                  onChange={(e) => consultCheck(e, index)}
                />
            <button onClick={()=>  handleDelete (index) }>X</button>
            </div>
          ))
          }         
        </div>
        <div className="checkedList">
          <h3>Checked tasks:</h3>
          
          {checkedTasks.length ===0 ? <div>No hay Tareas completadas</div> :  checkedTasks.map((task, index) => (
            <div className="Checkedtask" key={index}>
            <div >{task.label}</div>
            <input
                  type="checkbox"
                  key={index}
                  name="topping"
                  checked={task.done}
                  onChange={(e) => consultCheck(e, index)}
                />
                <button onClick={()=>  handleCheckedDelete (index) }>X</button>
                </div>
          ))}
          
        </div>
      </div>
    </>
  );
};

export default InputComponent;
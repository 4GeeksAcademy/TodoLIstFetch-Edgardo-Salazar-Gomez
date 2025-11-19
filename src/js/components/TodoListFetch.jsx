import { useEffect, useState } from "react";


export const TodoListFetch = () => {
  const baseURL = 'https://playground.4geeks.com/todo';
  const user = 'sp-todos-edgardo';

  const [newTask, setNewTask] = useState('');
  const [editTask, setEditTask] = useState('');
  const [editCompleted, setEditCompleted] = useState()
  const [todos, setTodos] = useState([]);
  const [editTodo, setEditTodo] = useState({})
  const [isEdit, setIsEdit] = useState(false);

  const handleNewTaskd = event => setNewTask(event.target.value);
  const handleEditTask = event => setEditTask(event.target.value);
  const handleEditCompleted = event => setEditCompleted(event.target.checked);

  const handleEdit = (tareaAModificar) => {
    setIsEdit(true)
    setEditTodo(tareaAModificar)
    setEditTask(tareaAModificar.label)
    setEditCompleted(tareaAModificar.is_done)
    console.log(tareaAModificar);
    
  }

  const handelDelete = async (id) => {
    const uri = `${baseURL}/todos/${id}`
    const options ={
      method:'DELETE'
    };
    console.log('clinck en delete');
    const response = await fetch(uri, options);
    if (!response.ok){
      console.log("Error eliminado", response.status);
      return;      
    }
    getTodos();
  };

  const handleCancel = () => {
  setIsEdit(false);
  setEditTodo({});
  setEditTask('');
  setEditCompleted(false);
};
  

const handelSubmitAdd = async (event) => {
  event.preventDefault()
  const dataToSend = {
    label: newTask,
    is_done: false
  }
//POST de un todo
const uri = `${baseURL}/todos/${user}`
const options = {
  method: 'POST',
  headers:{
    "Content-Type": 'application/json'
  },
  body: JSON.stringify(dataToSend)
}
console.log(options);

const response = await fetch(uri, options)
if(!response.ok){
  // taratar el error
console.log('error', response.status)
return
}
const data = await response.json()
console.log(data)
setNewTask('')
getTodos()

}

const handleSubmitEdit = async (event) => {
  event.preventDefault()
const dataToSend = {
  label: editTask,
  is_done: editCompleted
}
const uri =`${baseURL}/todos/${editTodo.id}`
console.log(uri);
const options = {
method:'PUT',
headers: {
  "Content-Type": 'application/json'
},
body: JSON.stringify(dataToSend)
}
const response = await fetch(uri, options)
if(!response.ok) {
  console.log('error');
  return
}
 const data = await response.json()
 console.log('error');
 setIsEdit(false)
 getTodos()
}

  const getTodos = async () => {
    const uri = `${baseURL}/users/${user}`
    const options = {
      method: 'GET'
    }
    const response = await fetch(uri, options)
    if (!response.ok) {
      //Tratar el error 
      console.log('error', response.status, response.statusText);
      if (response.status == 404) {
        console.log('Por favor, crea el usuario', user);
      }
      if (response.status == 400) {
        console.log('has lo necesario para resolver este error');

      }
      return

    }
    const data = await response.json()
    console.log(data)
    //Logica de la aplicacion
    setTodos(data.todos)

  }

  useEffect(() => {
    getTodos ()
  }, [])


  return (
    <div className="container my-2">
      <h1 className="text-success">Todo List with Fetch</h1>

      {isEdit ?
        <form onSubmit={handleSubmitEdit}>
          <div className="text-start mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">Edit Task</label>
            <input type="text" className="form-control" id="exampleInputPassword1"
              value={editTask} onChange={handleEditTask} />
          </div>
          <div className="text-start mb-3 form-check">
            <input type="checkbox" className="form-check-input" id="exampleCheck1"
              checked={editCompleted} onChange={handleEditCompleted} />
            <label className="form-check-label" htmlFor="exampleCheck1">Completed</label>
          </div>
          <button type="submit" className="btn btn-primary me-2">Submit</button>
          <button type="reset" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
        </form>

        :
        //formulario para agregar tarea
        <form onSubmit={handelSubmitAdd}>  
          <div className="text-start mb-3">
            <label htmlFor="exampleTask" className="form-label">Add Task</label>
            <input type="text" className="form-control" id="exampleTask"
              value={newTask} onChange={handleNewTaskd} />
          </div>
        </form>

      }

      <hr className="my-3" />
      <h2 className="text-primary mt-5">List de tareas</h2>

      <ul className="text-start list-group">
        {todos.map((item) =>
          <li key={item.id}
            className="list-group-item hidden-icon d-flex justify-content-between">
            <div>
              {item.is_done ?
              <i className="far fa-thumbs-up text-success me-2"></i>
              :
              <i className="fas fa-times-circle text-danger me-2"></i>

            }
             {item.label}
            </div>
            <div>
              <span onClick={() => handleEdit(item)}>
                <i className="fas fa-edit text-primary me-2"></i>
              </span>

              <span onClick={() => handelDelete(item.id)}>
                <i className="fas fa-trash text-danger"></i>
              </span>
            </div>
          </li>


        )}
        <li className="list-group-item text-end">{
          todos.length == 0 ?
          'No tasks, please add a nesw taks'
          :
          todos.length + ' tasks'}
        </li>
      </ul>
    </div>
  )
}


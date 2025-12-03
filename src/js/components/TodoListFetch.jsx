import { useEffect, useState } from "react";

export const TodoListFetch = () => {
  const baseURL = "https://playground.4geeks.com/todo";
  const user = "sp-todos-edgardo";

  const [newTask, setNewTask] = useState("");
  const [editTask, setEditTask] = useState("");
  const [editCompleted, setEditCompleted] = useState(false);
  const [todos, setTodos] = useState([]);
  const [editTodo, setEditTodo] = useState({});
  const [isEdit, setIsEdit] = useState(false);

  const handleNewTaskd = (e) => setNewTask(e.target.value);
  const handleEditTask = (e) => setEditTask(e.target.value);
  const handleEditCompleted = (e) => setEditCompleted(e.target.checked);

  // === CREAR USUARIO SI NO EXISTE ===
  const createUser = async () => {
    const uri = `${baseURL}/users/${user}`;
    const options = { method: "POST" };

    const response = await fetch(uri, options);
    if (!response.ok) {
      console.log("Error creando usuario", response.status);
      return;
    }

    getTodos();
  };

  // === EDITAR ===
  const handleEdit = (tarea) => {
    setIsEdit(true);
    setEditTodo(tarea);
    setEditTask(tarea.label);
    setEditCompleted(tarea.is_done);
  };

  // === ELIMINAR ===
  const handelDelete = async (id) => {
    const uri = `${baseURL}/todos/${id}`;
    const options = { method: "DELETE" };
    const response = await fetch(uri, options);

    if (!response.ok) {
      console.log("Error eliminando", response.status);
      return;
    }

    getTodos();
  };

  const handleCancel = () => {
    setIsEdit(false);
    setEditTodo({});
    setEditTask("");
    setEditCompleted(false);
  };

  // === AGREGAR ===
  const handelSubmitAdd = async (e) => {
    e.preventDefault();

    if (!newTask.trim()) return;

    const dataToSend = {
      label: newTask,
      is_done: false,
    };

    const uri = `${baseURL}/todos/${user}`;
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend),
    };

    const response = await fetch(uri, options);
    if (!response.ok) {
      console.log("Error agregando", response.status);
      return;
    }

    setNewTask("");
    getTodos();
  };

  // === EDITAR SUBMIT ===
  const handleSubmitEdit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      label: editTask,
      is_done: editCompleted,
    };

    const uri = `${baseURL}/todos/${editTodo.id}`;
    const options = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend),
    };

    const response = await fetch(uri, options);
    if (!response.ok) {
      console.log("Error editando");
      return;
    }

    console.log("Editado correctamente");
    setIsEdit(false);
    getTodos();
  };

  // === OBTENER TODOS ===
  const getTodos = async () => {
    const uri = `${baseURL}/users/${user}`;
    const response = await fetch(uri);

    if (!response.ok) {
      console.log("Error", response.status);

      // Crear usuario si no existe
      if (response.status === 404) {
        console.log("Usuario no existe, creando...");
        await createUser();
      }
      return;
    }

    const data = await response.json();
    setTodos(data.todos);
  };

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <div className="container my-2">
      <h1 className="text-success">Todo List with Fetch</h1>

      {isEdit ? (
        <form onSubmit={handleSubmitEdit}>
          <div className="text-start mb-3">
            <label className="form-label">Edit Task</label>
            <input
              type="text"
              className="form-control"
              value={editTask}
              onChange={handleEditTask}
            />
          </div>

          <div className="form-check mb-3">
            <input
              type="checkbox"
              className="form-check-input"
              checked={editCompleted}
              onChange={handleEditCompleted}
            />
            <label className="form-check-label">Completed</label>
          </div>

          <button type="submit" className="btn btn-primary me-2">
            Submit
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
        </form>
      ) : (
        <form onSubmit={handelSubmitAdd}>
          <div className="text-start mb-3">
            <label className="form-label">Add Task</label>
            <input
              type="text"
              className="form-control"
              value={newTask}
              onChange={handleNewTaskd}
            />
          </div>

          <button type="submit" className="btn btn-success">
            Add Task
          </button>
        </form>
      )}

      <hr className="my-3" />
      <h2 className="text-primary mt-5">Lista de tareas</h2>

      <ul className="list-group text-start">
        {todos.map((item) => (
          <li key={item.id} className="list-group-item d-flex justify-content-between">
            <div>
              {item.is_done ? (
                <i className="far fa-thumbs-up text-success me-2"></i>
              ) : (
                <i className="fas fa-times-circle text-danger me-2"></i>
              )}
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
        ))}

        <li className="list-group-item text-end">
          {todos.length === 0 ? "No tasks, please add a new task" : `${todos.length} tasks`}
        </li>
      </ul>
    </div>
  );
};

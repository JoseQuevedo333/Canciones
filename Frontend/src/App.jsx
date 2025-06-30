import { useEffect, useState } from "react";
import TodoForm from "./components/TodoForm";
import { canciones } from "./components/canciones";

const App = () => {
  const [canciones, setcanciones] = useState([]);

  const getcanciones = async () => {
    const response = await fetch("http://localhost:5000/canciones");
    const canciones = await response.json();
    setcanciones(canciones);
  };

  useEffect(() => {
    getcanciones();
  }, []);

  const addTodo = async (title) => {
    const response = await fetch("http://localhost:5000/canciones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    const todo = await response.json();
    setcanciones([...canciones, todo]);
  };

  const removeTodo = async (id) => {
    const response = await fetch(`http://localhost:5000/canciones/${id}`, {
      method: "DELETE",
    });
    if (response.status !== 200) {
      return alert("Something went wrong");
    }
    setcanciones(canciones.filter((todo) => todo.id !== id));
  };

  const updateTodo = async (id) => {
    const response = await fetch(`http://localhost:5000/canciones/${id}`, {
      method: "PUT",
    });
    if (response.status !== 200) {
      return alert("Something went wrong");
    }
    setcanciones(
      canciones.map((todo) => {
        if (todo.id === id) {
          todo.done = !todo.done;
        }
        return todo;
      })
    );
  };

  return (
    <div className="container">
      <h1 className="">canciones APP</h1>
      <TodoForm addTodo={addTodo} />
      <canciones
        canciones={canciones}
        removeTodo={removeTodo}
        updateTodo={updateTodo}
      />
    </div>
  );
};
export default App;

import Todo from "./Todo";

export const canciones = ({ canciones, removeTodo, updateTodo }) => {
  return (
    <ul className="list-group mt-5">
      {canciones.map((todo) => (
        <Todo
          key={todo.id}
          todo={todo}
          removeTodo={removeTodo}
          updateTodo={updateTodo}
        />
      ))}

      {canciones.length === 0 && (
        <li className="list-group-item">
          <div className="d-flex">
            <h5>No canciones found</h5>
          </div>
        </li>
      )}
    </ul>
  );
};

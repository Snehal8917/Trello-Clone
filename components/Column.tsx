import { PlusCircleIcon } from "@heroicons/react/20/solid";
import { Draggable, Droppable } from "react-beautiful-dnd";
import TodoCard from "./TodoCard";
import { useBoardStore } from "@/store/BoardStore";
import { useModalStore } from "@/store/ModalStore";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


type Props = {
  id: TypedColumn;
  todos: Todo[];
  index: number;
};
const idToColumnText: {
  [key in TypedColumn]: string;
} = {
  todo: "To Do",
  inprogress: "In Progress",
  done: "Done",
};
function Column({ id, todos, index }: Props) {
  const [searchString, setNewTaskType] = useBoardStore((state) => [
    state.searchString,
    state.setNewTaskType,
  ]);

  const { data: session } = useSession();
  const openModal = useModalStore((state) => state.openModal);

  const handleAddTodo = () => {
    if (session) {
      setNewTaskType(id);
      openModal();
    } else {
      toast.error("Please log in to add a todo.");
    }
  };

  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <Droppable droppableId={id} type="card">
            {(provided, snapshot) => (
              // <div
              //   {...provided.droppableProps}
              //   ref={provided.innerRef}
              //   className={`p-2 rounded-2xl shadow-sm
              //    ${
              //      snapshot.isDraggingOver ? "bg-green-200" : "bg-white/50"
              //    }
              //   `}
              // >
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`p-2 rounded-2xl shadow-sm ${
                  snapshot.isDraggingOver
                    ? "bg-gradient-to-b from-green-200 to-green-300"
                    : "bg-gradient-to-b from-white to-gray-100 dark:from-gray-700"
                }`}
              >
                <h2 className="flex justify-between font-semibold text-2xl p-2">
                  {idToColumnText[id]}
                  <span
                    className="text-gray-500 bg-gray-200 rounded-full px-2 py-1 text-sm font-semibold 
                  dark:bg-gray-500 dark:text-white"
                  >
                    {!searchString
                      ? todos.length
                      : todos.filter((todo) =>
                          todo.title
                            .toLowerCase()
                            .includes(searchString.toLowerCase())
                        ).length}
                  </span>
                </h2>
                <div className="space-y-4">
                  {todos.map((todo, index) => {
                    if (
                      searchString &&
                      !todo.title
                        .toLowerCase()
                        .includes(searchString.toLowerCase())
                    )
                      return null;
                    return (
                      <Draggable
                        key={todo.$id}
                        draggableId={todo.$id}
                        index={index}
                      >
                        {(provided) => (
                          <TodoCard
                            todo={todo}
                            index={index}
                            id={id}
                            innerRef={provided.innerRef}
                            dragHandleProps={provided.dragHandleProps}
                            draggableProps={provided.draggableProps}
                          />
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                  <div className="flex items-end justify-end p-4">
                    <button
                      onClick={handleAddTodo}
                      className="text-green-500 hover:text-green-600 focus:outline-none"
                    >
                      <PlusCircleIcon className="h-10 w-10" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
}

export default Column;

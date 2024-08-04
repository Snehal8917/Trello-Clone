"use client";
import { useBoardStore } from "@/store/BoardStore";
import { useEffect } from "react";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import Column from "./Column";
const Board = () => {
  const [board, getBoard, setBoardState, updateTodoInDB] = useBoardStore(
    (state) => [
      state.board,
      state.getBoard,
      state.setBoardState,
      state.updateTodoInDB,
    ]
  );

  useEffect(() => {
    getBoard();
  }, [getBoard]);

  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;

    // check if user dragged card outside of board
    if (!destination) return;

    // handle column drag
    if (type === "column") {
      const entries = Array.from(board.columns.entries());
      const [removed] = entries.splice(source.index, 1);
      entries.splice(destination.index, 0, removed);
      const rearrangedColumns = new Map(entries);
      setBoardState({
        ...board,
        columns: rearrangedColumns,
      });
    } else {
      // Handle task drag
      const startColIndex = board.columns.get(source.droppableId);
      const finishColIndex = board.columns.get(destination.droppableId);

      if (!startColIndex || !finishColIndex) {
        console.error("Invalid startColIndex or finishColIndex.");
        return;
      }

      const startCol: Column = {
        id: startColIndex.id,
        todos: startColIndex.todos,
      };

      const finishCol: Column = {
        id: finishColIndex.id,
        todos: finishColIndex.todos,
      };

      if (source.index === destination.index && startCol === finishCol) return;

      const newTodos = startCol.todos;
      const [todoMoved] = newTodos.splice(source.index, 1);

      if (startCol.id === finishCol.id) {
        // Same column task drag
        newTodos.splice(destination.index, 0, todoMoved);
        const newCol = {
          id: startCol.id,
          todos: newTodos,
        };
        const newColumns = new Map(board.columns);
        newColumns.set(startCol.id, newCol);

        setBoardState({ ...board, columns: newColumns });
      } else {
        // Dragging to another column
        const finishTodos = Array.from(finishCol.todos);
        finishTodos.splice(destination.index, 0, todoMoved);

        const newColumns = new Map(board.columns);
        const newCol = {
          id: startCol.id,
          todos: newTodos,
        };
        newColumns.set(startCol.id, newCol);
        newColumns.set(finishCol.id, {
          id: finishCol.id,
          todos: finishTodos,
        });

        // Update in DB
        updateTodoInDB(todoMoved, finishCol.id);

        setBoardState({ ...board, columns: newColumns });
      }
    }
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="board" direction="horizontal" type="column">
        {(provided) => (
          <div
            className=" grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {Array.from(board.columns.entries()).map(([id, column], index) => (
              <Column key={id} id={id} todos={column.todos} index={index} />
            ))}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default Board;

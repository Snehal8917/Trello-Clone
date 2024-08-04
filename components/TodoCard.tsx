"use client";
import getUrl from "@/lib/getUrl";
import { useBoardStore } from "@/store/BoardStore";
import { XCircleIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  DraggableProvidedDragHandleProps,
  DraggableProvidedDraggableProps,
} from "react-beautiful-dnd";

type Props = {
  todo: Todo;
  index: number;
  id: TypedColumn;
  innerRef: (element: HTMLElement | null) => void;
  draggableProps: DraggableProvidedDraggableProps;
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
};
function TodoCard({
  todo,
  index,
  id,
  innerRef,
  draggableProps,
  dragHandleProps,
}: Props) {
  const deleteTask = useBoardStore((state) => state.deleteTask);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (todo.image) {
      const fetchImage = async () => {
        try {
          const url = await getUrl(todo.image!);
          if (url) {
            setImageUrl(url.toString());
          }
        } catch (error) {
          console.error("Error fetching image URL:", error);
        }
      };
      fetchImage();
    }
  }, [todo]);

  return (
    <>
      <div
        className="text-gray-500 bg-gradient-to-br from-blue-200 to-blue-300 rounded-md shadow-lg dark:bg-gradient-to-br dark:from-[#3B3B3B] dark:to-[#1C1C1C] dark:text-white"
        {...draggableProps}
        {...dragHandleProps}
        ref={innerRef}
      >
        <div className="flex justify-between items-center p-5">
          <p className="text-lg font-semibold">{todo.title}</p>
          <button
            onClick={() => deleteTask(index, todo, id)}
            className="text-red-500 hover:text-red-600 focus:outline-none"
            // className="text-red-500 hover:text-red-600"
          >
            <XCircleIcon className="h-8 w-8 text-red-500 hover:text-red-600" />
          </button>
        </div>

        {imageUrl && (
          <div className="w-full h-48 rounded-b-md overflow-hidden shadow-md">
            <Image
              src={imageUrl}
              alt="Task image"
              width={400}
              height={200}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    </>
  );
}

export default TodoCard;

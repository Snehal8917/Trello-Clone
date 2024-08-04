interface Board{
    columns: Map<TypedColumn, Column>
}

type TypedColumn = "todo" | "inprogress"| "done" | string

interface Column {
    id: TypedColumn,
    todos: Todo[]
}

interface Todo{
    $id: string,
    $createdAt: string,
    title: string,
    status: TypedColumn,
    image?: Image,
}

type Image = {
    bucketId: string;
    fileId: string

}
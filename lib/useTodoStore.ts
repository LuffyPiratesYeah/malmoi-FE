import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TodoItem {
    id: string;
    text: string;
    completed: boolean;
}

interface TodoStore {
    todos: TodoItem[];
    addTodo: (text: string) => void;
    removeTodo: (id: string) => void;
    toggleTodo: (id: string) => void;
}

export const useTodoStore = create<TodoStore>()(
    persist(
        (set) => ({
            todos: [
                { id: 'default-1', text: '예습 PDF 1회 읽기 (추천)', completed: false }
            ],

            addTodo: (text) => set((state) => ({
                todos: [...state.todos, { id: crypto.randomUUID(), text, completed: false }]
            })),

            removeTodo: (id) => set((state) => ({
                todos: state.todos.filter((t) => t.id !== id)
            })),

            toggleTodo: (id) => set((state) => ({
                todos: state.todos.map((t) =>
                    t.id === id ? { ...t, completed: !t.completed } : t
                )
            })),
        }),
        {
            name: 'todo-store',
        }
    )
);

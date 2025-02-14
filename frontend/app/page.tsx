"use client";
import { useState, useEffect } from "react";
import { List, Task } from "./types";
import Sidebar from "./components/Sidebar";
import TextInputForm from "./components/TextInputForm";
import Button from "./components/Button";
import { TASKS_API_URL, TASK_BY_LISTID_API_URL } from "./APIconfig";
import CustomDateTimePicker from "./components/DateTimePicker";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editedTask, setEditedTask] = useState<Task>({
    id: -1,
    listId: -1,
    text: "",
    description: "",
    dueDate: new Date(Date.now()),
    completed: false,
  });
  const [currentList, setCurrentList] = useState<List>({
    id: -1,
    userId: -1,
    name: "",
  });
  const [showCompleted, setShowCompleted] = useState<Boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<Boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(TASK_BY_LISTID_API_URL + currentList.id);
        const data = await response.json();
        console.log("Fetched Data:", data);
        setTasks(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch tasks");
      }
    };
    fetchTasks();
  }, [currentList.id]);

  const handleTaskEdit = async () => {
    if (editedTask.text) {
      try {
        const response = await fetch(TASKS_API_URL + editedTask.id, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: editedTask.text,
            description: editedTask.description,
            dueDate: editedTask.dueDate,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error updating task");
        }

        const data = await response.json();
        const updatedTasks = tasks.map((task) =>
          task.id === editedTask.id ? data : task
        );
        setTasks(updatedTasks);
      } catch (error: any) {
        console.error(error);
      }
    }

    setEditedTask({
      id: -1,
      listId: -1,
      text: "",
      description: "",
      dueDate: new Date(Date.now()),
      completed: false,
    });
  };

  const handleTaskDelete = async (id: number) => {
    try {
      const response = await fetch(TASKS_API_URL + id, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error: any) {
      console.error(error);
    }
  };

  const handleSubmit = async (value: string) => {
    try {
      const response = await fetch(TASKS_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ listId: currentList.id, text: value }),
      });

      if (!response.ok) {
        throw new Error("Failed to create task");
      }

      const newTask = await response.json();
      setTasks([...tasks, newTask]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const isToday = today.toDateString() === date.toDateString();

    if (isToday) {
      return `${date.getHours().toString().padStart(2, "0")}:${date
        .getMinutes()
        .toString()
        .padStart(2, "0")} Today`;
    }

    return new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="flex h-screen">
      <Sidebar
        currentList={currentList}
        setCurrentList={setCurrentList}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <div className="mx-auto basis-full md:basis-1/2">
      <button
              className="p-2 text-white rounded md:hidden"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
        {currentList.id != -1 && (
          <div className="text-4xl mb-4 flex">
            <div className="mr-auto">{currentList.name}</div>

            {!showCompleted ? (
              <Button
                onClick={() => setShowCompleted(!showCompleted)}
                type="showNotCompleted"
              />
            ) : (
              <Button
                onClick={() => setShowCompleted(!showCompleted)}
                type="showCompleted"
              />
            )}
          </div>
        )}
        <ul>
          {tasks
            .filter((task) => showCompleted || !task.completed)
            .map((task) => (
              <li
                key={task.id}
                className="flex flex-col items-start text-3xl mb-4"
              >
                {editedTask.id === task.id ? (
                  <div className="relative w-full space-y-2">
                    <input
                      type="text"
                      value={editedTask.text}
                      onChange={(e) =>
                        setEditedTask({ ...editedTask, text: e.target.value })
                      }
                      className="w-full pr-10 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Edit name..."
                    />
                    <textarea
                      value={editedTask.description}
                      onChange={(e) =>
                        setEditedTask({
                          ...editedTask,
                          description: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Edit description..."
                    />
                    <CustomDateTimePicker
                      value={new Date(editedTask.dueDate)}
                      onChange={(date: Date) =>
                        setEditedTask({ ...editedTask, dueDate: date })
                      }
                    />
                    <Button onClick={handleTaskEdit} type="apply" />
                  </div>
                ) : (
                  <div className="flex w-full items-center">
                    <div className="mr-auto">
                      <div>{task.text}</div>
                      <div className="text-sm text-gray-500">
                        {task.description}
                      </div>
                      {new Date(task.dueDate).getTime() > 0 && (
                        <div
                          className={`text-sm ${
                            new Date(task.dueDate) < new Date()
                              ? "text-red-500"
                              : "text-gray-400"
                          }`}
                        >
                          Due {formatDate(new Date(task.dueDate))}
                        </div>
                      )}
                    </div>

                    {!task.completed ? (
                      <Button
                        type="notCompleted"
                        onClick={() =>
                          setTasks(
                            tasks.map((mapTask) =>
                              mapTask.id === task.id
                                ? { ...mapTask, completed: !mapTask.completed }
                                : mapTask
                            )
                          )
                        }
                      />
                    ) : (
                      <Button
                        type="completed"
                        onClick={() =>
                          setTasks(
                            tasks.map((mapTask) =>
                              mapTask.id === task.id
                                ? { ...mapTask, completed: !mapTask.completed }
                                : mapTask
                            )
                          )
                        }
                      />
                    )}

                    <Button onClick={() => setEditedTask(task)} type="edit" />
                    <Button
                      onClick={() => handleTaskDelete(task.id)}
                      type="delete"
                    />
                  </div>
                )}
              </li>
            ))}
          <li key="addList">
            {!isSidebarOpen && currentList.id !== -1 && (
              <TextInputForm onSubmit={handleSubmit} text="a task" />
            )}
          </li>
        </ul>
      </div>
    </div>
  );
}

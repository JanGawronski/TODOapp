import { useState, useEffect } from "react";
import { User, List } from "../types";
import TextInputForm from "./TextInputForm";
import Button from "./Button";
import { LISTS_API_URL, LIST_BY_USERID_API_URL } from "../APIconfig";

interface Probs {
  currentUser: User;
  currentList: List;
  setCurrentList: (list: List) => void;
}

const ListBar = ({ currentUser, currentList, setCurrentList }: Probs) => {
  const [lists, setLists] = useState<List[]>([]);
  const [editedList, setEditedList] = useState<List>({
    id: -1,
    userId: -1,
    name: "",
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const response = await fetch(LIST_BY_USERID_API_URL + currentUser.id);
        const data = await response.json();
        console.log("Fetched Data:", data);
        setLists(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch lists");
      }
    };
    fetchLists();
  }, [currentUser.id]);

  const handleListEdit = async () => {
    if (editedList.name) {
      try {
        const response = await fetch(LISTS_API_URL + editedList.id, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: editedList.name }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error updating list");
        }

        const data = await response.json();
        const newLists = [...lists];
        const index = newLists.findIndex((list) => list.id === editedList.id);
        newLists[index].name = editedList.name;
        setLists(newLists);
      } catch (error: any) {
        console.error(error);
      }
    }
    setEditedList({ id: -1, userId: -1, name: "" });
  };

  const handleListDelete = async (id: number) => {
    try {
      const response = await fetch(LISTS_API_URL + id, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete list");
      }

      setLists(lists.filter((list) => list.id !== id));
      if (id == currentList.id)
        setCurrentList({
          id: -1,
          userId: -1,
          name: "",
        });
    } catch (error: any) {
      console.error(error);
    }
  };

  const handleSubmit = async (value: string) => {
    try {
      const response = await fetch(LISTS_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: currentUser.id, name: value }),
      });

      if (!response.ok) {
        throw new Error("Failed to create list");
      }

      const newList = await response.json();
      setLists([...lists, newList]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="mt-5">
      <ul>
        {lists.map((list) => (
          <li key={list.id} className="flex items-center">
            {editedList.id === list.id ? (
              <div className="relative w-full">
                <input
                  type="text"
                  value={editedList.name}
                  onChange={(e) =>
                    setEditedList({
                      id: editedList.id,
                      userId: currentUser.id,
                      name: e.target.value,
                    })
                  }
                  className="w-full pr-10 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Edit name..."
                />
                <Button onClick={() => handleListEdit()} type="apply" />
              </div>
            ) : (
              <>
                <button
                  onClick={() => setCurrentList(list)}
                  className={
                    currentList.id === list.id
                      ? "pb-1 text-lg mr-auto font-bold"
                      : "pb-1 text-lg mr-auto"
                  }
                >
                  {list.name}
                </button>
                <Button onClick={() => setEditedList(list)} type="edit" />
                <Button
                  onClick={() => handleListDelete(list.id)}
                  type="delete"
                />
              </>
            )}
          </li>
        ))}
        <li key="addList">
          <TextInputForm onSubmit={handleSubmit} text="a list" />
        </li>
      </ul>
    </div>
  );
};

export default ListBar;

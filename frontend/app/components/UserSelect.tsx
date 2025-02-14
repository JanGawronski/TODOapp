import { useState, useEffect } from "react";
import { User } from "../types";
import TextInputForm from "./TextInputForm";
import { USERS_API_URL } from "../APIconfig";
import Button from "./Button";

interface Probs {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  isOpen: boolean;
}

const UserSelect = ({ currentUser, setCurrentUser, isOpen }: Probs) => {
  const [users, setUsers] = useState<User[]>([]);
  const [editedUser, setEditedUser] = useState<User>({ id: -1, name: "" });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(USERS_API_URL);
        const data = await response.json();
        setUsers(data);
        setCurrentUser(data[0]);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch users");
      }
    };
    fetchUsers();
  }, []);

  const handleUserEdit = async () => {
    if (editedUser.name) {
      try {
        const response = await fetch(USERS_API_URL + editedUser.id, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: editedUser.name }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error updating user");
        }

        const data = await response.json();
        const newUsers = [...users];
        const index = newUsers.findIndex((user) => user.id === editedUser.id);
        newUsers[index].name = editedUser.name;
        setUsers(newUsers);
      } catch (error: any) {
        console.error(error);
      }
    }
    setEditedUser({ id: -1, name: "" });
  };

  const handleUserDelete = async (id: number) => {
    try {
      const response = await fetch(USERS_API_URL + id, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      setUsers(users.filter((user) => user.id !== id));
    } catch (error: any) {
      console.error(error);
    }
  };

  const handleSubmit = async (value: string) => {
    try {
      const response = await fetch(USERS_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: value }),
      });

      if (!response.ok) {
        throw new Error("Failed to create user");
      }

      const newUser = await response.json();
      setUsers([...users, newUser]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <>
      {isOpen && (
        <ul>
          {users
            .filter((user) => user.id !== currentUser.id)
            .map((user) => (
              <li key={user.id} className="flex items-center">
                {editedUser.id === user.id ? (
                  <div className="relative w-full">
                    <input
                      type="text"
                      value={editedUser.name}
                      onChange={(e) =>
                        setEditedUser({
                          id: editedUser.id,
                          name: e.target.value,
                        })
                      }
                      className="w-full pr-10 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Edit name..."
                    />
                    <Button onClick={() => handleUserEdit()} type="apply" />
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => setCurrentUser(user)}
                      className="pb-1 text-lg mr-auto"
                    >
                      {user.name}
                    </button>
                    <Button onClick={() => setEditedUser(user)} type="edit" />
                    <Button
                      onClick={() => handleUserDelete(user.id)}
                      type="delete"
                    />
                  </>
                )}
              </li>
            ))}
          <li key="addUser">
            <TextInputForm onSubmit={handleSubmit} text="a user" />
          </li>
        </ul>
      )}
    </>
  );
};

export default UserSelect;

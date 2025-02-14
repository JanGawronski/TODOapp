import { useState } from "react";
import { User, List } from "../types";
import UserSelect from "./UserSelect";
import ListBar from "./ListBar";

interface Probs {
  currentList: List;
  setCurrentList: (list: List) => void;
  isSidebarOpen: Boolean;
  setIsSidebarOpen: (value: Boolean) => void;
}

const Sidebar = ({
  currentList,
  setCurrentList,
  isSidebarOpen,
  setIsSidebarOpen,
}: Probs) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>({
    id: -1,
    name: "No user",
  });

  return (
    <div>
      <div
        className={`fixed top-0 left-0 w-full h-full bg-gray-800 text-white p-5 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:relative md:flex md:basis-1/6 md:h-full md:w-auto`}
      >
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
        <div className="w-full">
          <h2 className="inline-flex w-full text-2xl font-bold">
            {currentUser.name}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="mb-2 ml-auto pl-1 pb-2 pt-1 focus:outline-none"
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
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg>
            </button>
          </h2>
          <UserSelect
            setCurrentUser={setCurrentUser}
            currentUser={currentUser}
            isOpen={isOpen}
          />

          <ListBar
            currentUser={currentUser}
            currentList={currentList}
            setCurrentList={setCurrentList}
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

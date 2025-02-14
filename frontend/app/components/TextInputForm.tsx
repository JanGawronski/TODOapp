import { useState, ChangeEvent, FormEvent } from "react";

interface Probs {
  text: string;
  onSubmit: (value: string) => void;
}

const TextInputForm = ({ text, onSubmit }: Probs) => {
  const [inputValue, setInputValue] = useState<string>("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inputValue) onSubmit(inputValue);
    setInputValue("");
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full ">
      <input
        type="text"
        className="w-full p-3 pr-12 border rounded-lg focus:outline-none bg-gray-800 border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder={"Enter name to add " + text + "..."}
        value={inputValue}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setInputValue(event.target.value)
        }
      />
      <button
        type="submit"
        className="absolute inset-y-0 right-0 flex items-center justify-center w-12 bg-transparent text-blue-500 hover:text-blue-600 focus:outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      </button>
    </form>
  );
};

export default TextInputForm;

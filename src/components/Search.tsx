import React from "react";
import Icons from "./Icons"; // Import your custom Icons component

interface SearchProps {
  searchTerm: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Search: React.FC<SearchProps> = ({ searchTerm, onChange }) => {
  return (
    <div className="mb-3 w-25 position-relative">
      <input
        type="text"
        value={searchTerm}
        onChange={onChange}
        className="form-control"
        placeholder="Search…"
      />
      {/* Replace the <i> tag with the Icons component */}
      <Icons
        name="Search" // The name of the feather icon you want to use
        color="#182433"
        size={18}
        className="position-absolute"
        style={{ top: "50%", left: "90%", transform: "translateY(-50%)" }}
      />
    </div>
  );
};

export default Search;

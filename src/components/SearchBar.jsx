
const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="جستجو بر اساس نام یا ایمیل..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <span className="icon"><p>&#x26B2;</p></span>
    </div>
  );
};

export default SearchBar;
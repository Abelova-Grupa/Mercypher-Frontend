interface SearchProps {
  onSearchChange: (value: string) => void;
}

export default function DashboardSearch({ onSearchChange }: SearchProps) {
  return (
    <div className="dashboard-searchbar">
      <div className="search-container">
        <img className="search-img" src="/search.svg" alt="search" />
        <input
          className="searchbar-input"
          type="text"
          placeholder="Search chats..."
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  )
}
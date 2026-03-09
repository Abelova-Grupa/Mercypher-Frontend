interface FilterProps {
  activeFilter: "all" | "groups";
  onFilterChange: (filter: "all" | "groups") => void;
}

export default function DashboardFilter({ activeFilter, onFilterChange }: FilterProps) {
  return (
    <div className="dashboard-filter">
      <div className="filter-container">
        <button
          className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => onFilterChange("all")}
        >
          All
        </button>
        <button
          className={`filter-btn ${activeFilter === 'groups' ? 'active' : ''}`}
          onClick={() => onFilterChange("groups")}
        >
          Groups
        </button>
      </div>
    </div>
  )
}
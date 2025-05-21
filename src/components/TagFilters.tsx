import React from 'react';
import { Button } from "@/components/ui/button"; // Assuming this is the correct path

interface TagFiltersProps {
  allTags: string[];
  activeFilter: string | null;
  onFilterChange: (tag: string | null) => void;
}

const TagFilters: React.FC<TagFiltersProps> = ({ allTags, activeFilter, onFilterChange }) => {
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      <Button
        variant={activeFilter === null ? "default" : "outline"}
        onClick={() => onFilterChange(null)}
      >
        ทั้งหมด
      </Button>
      {allTags.map(tag => (
        <Button
          key={tag}
          variant={activeFilter === tag ? "default" : "outline"}
          onClick={() => onFilterChange(tag)}
        >
          {tag}
        </Button>
      ))}
    </div>
  );
};

export default TagFilters;

import React, { useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command';
import { 
  Plus,
  X,
  Tag,
  Check,
  Hash
} from 'lucide-react';

// Predefined tag categories with colors
export const tagCategories = {
  dietary: {
    label: 'Dietary',
    color: 'bg-green-100 text-green-800 border-green-300',
    tags: ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Low-Carb', 'High-Protein']
  },
  medical: {
    label: 'Medical',
    color: 'bg-red-100 text-red-800 border-red-300',
    tags: ['Allergy', 'Diabetes', 'Injury-Recovery', 'Supplement-User', 'Medical-Clearance']
  },
  goals: {
    label: 'Goals',
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    tags: ['Weight-Gain', 'Weight-Loss', 'Muscle-Building', 'Endurance', 'Recovery', 'Performance']
  },
  status: {
    label: 'Status',
    color: 'bg-purple-100 text-purple-800 border-purple-300',
    tags: ['New-Player', 'Veteran', 'Captain', 'Injured', 'Returning', 'Trial']
  },
  priority: {
    label: 'Priority',
    color: 'bg-orange-100 text-orange-800 border-orange-300',
    tags: ['High-Priority', 'Needs-Attention', 'Close-Monitor', 'Check-In', 'Follow-Up']
  },
  sport: {
    label: 'Sport-Specific',
    color: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    tags: ['Pre-Season', 'In-Season', 'Off-Season', 'Competition', 'Training-Camp']
  }
};

// Get tag color based on category
const getTagColor = (tagName: string) => {
  for (const category of Object.values(tagCategories)) {
    if (category.tags.includes(tagName)) {
      return category.color;
    }
  }
  return 'bg-gray-100 text-gray-800 border-gray-300'; // Default color
};

// Get all available tags
const getAllAvailableTags = () => {
  return Object.values(tagCategories).flatMap(category => category.tags);
};

interface PlayerTagManagerProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  disabled?: boolean;
  maxTags?: number;
  placeholder?: string;
}

function PlayerTagManager({ 
  tags, 
  onTagsChange, 
  disabled = false, 
  maxTags = 8,
  placeholder = "Add tags..." 
}: PlayerTagManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const availableTags = getAllAvailableTags();
  
  const filteredTags = availableTags.filter(tag => 
    !tags.includes(tag) && 
    tag.toLowerCase().includes(inputValue.toLowerCase()) &&
    (selectedCategory === 'all' || Object.values(tagCategories).find(cat => 
      cat.tags.includes(tag) && Object.keys(tagCategories).find(key => 
        tagCategories[key] === cat
      ) === selectedCategory
    ))
  );

  const handleTagAdd = (tag: string) => {
    if (!tags.includes(tag) && tags.length < maxTags) {
      onTagsChange([...tags, tag]);
      setInputValue('');
    }
  };

  const handleTagRemove = (tagToRemove: string, event: React.MouseEvent) => {
    // Prevent event from bubbling up to parent elements
    event.preventDefault();
    event.stopPropagation();
    
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleCreateCustomTag = () => {
    if (inputValue.trim() && !tags.includes(inputValue.trim()) && tags.length < maxTags) {
      onTagsChange([...tags, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handlePopoverTrigger = (event: React.MouseEvent) => {
    // Prevent event from bubbling up to parent elements
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
      {/* Display current tags */}
      <div className="flex flex-wrap gap-1">
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant="outline"
            className={`${getTagColor(tag)} text-xs font-medium`}
          >
            <Hash className="w-3 h-3 mr-1" />
            {tag}
            {!disabled && (
              <button
                onClick={(e) => handleTagRemove(tag, e)}
                className="ml-1 hover:bg-black/10 rounded-full p-0.5 transition-colors"
                type="button"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </Badge>
        ))}
        
        {/* Add tag button */}
        {!disabled && tags.length < maxTags && (
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-6 px-2 text-xs border-dashed"
                onClick={handlePopoverTrigger}
                type="button"
              >
                <Plus className="w-3 h-3 mr-1" />
                {tags.length === 0 ? placeholder : 'Add tag'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-0" align="start">
              <Command>
                <CommandInput
                  placeholder="Search tags..."
                  value={inputValue}
                  onValueChange={setInputValue}
                />
                <CommandList>
                  <CommandEmpty>
                    <div className="text-center py-2">
                      <p className="text-sm text-muted-foreground mb-2">
                        No tags found
                      </p>
                      {inputValue.trim() && (
                        <Button
                          size="sm"
                          onClick={handleCreateCustomTag}
                          className="text-xs"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Create "{inputValue}"
                        </Button>
                      )}
                    </div>
                  </CommandEmpty>
                  
                  {/* Category filter */}
                  <CommandGroup heading="Categories">
                    <CommandItem
                      onSelect={() => setSelectedCategory('all')}
                      className={selectedCategory === 'all' ? 'bg-accent' : ''}
                    >
                      All Categories
                    </CommandItem>
                    {Object.entries(tagCategories).map(([key, category]) => (
                      <CommandItem
                        key={key}
                        onSelect={() => setSelectedCategory(key)}
                        className={selectedCategory === key ? 'bg-accent' : ''}
                      >
                        <Tag className="w-3 h-3 mr-2" />
                        {category.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>

                  {/* Available tags */}
                  {filteredTags.length > 0 && (
                    <CommandGroup heading="Available Tags">
                      {filteredTags.slice(0, 10).map((tag) => (
                        <CommandItem
                          key={tag}
                          onSelect={() => handleTagAdd(tag)}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center">
                            <Badge
                              variant="outline"
                              className={`${getTagColor(tag)} text-xs mr-2`}
                            >
                              <Hash className="w-3 h-3 mr-1" />
                              {tag}
                            </Badge>
                          </div>
                          <Check className="w-3 h-3" />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}

                  {/* Custom tag creation */}
                  {inputValue.trim() && !availableTags.includes(inputValue.trim()) && (
                    <CommandGroup heading="Create Custom">
                      <CommandItem onSelect={handleCreateCustomTag}>
                        <Plus className="w-3 h-3 mr-2" />
                        Create "{inputValue}"
                      </CommandItem>
                    </CommandGroup>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}
      </div>
      
      {/* Tag limit indicator */}
      {tags.length >= maxTags && (
        <p className="text-xs text-muted-foreground">
          Maximum {maxTags} tags reached
        </p>
      )}
    </div>
  );
}

export default PlayerTagManager;
import React from 'react';
import { Button } from './ui/button';

const categories = [
  'All',
  'Music',
  'Gaming',
  'Movies',
  'News',
  'Sports',
  'Technology',
  'Comedy',
  'Education',
  'Science',
  'Travel',
  'Food',
  'Fashion',
];

const CategoryTab = () => {
  const [activeCategory, setActiveCategory] = React.useState('All');
  return (
    <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => (
        <Button
          key={category}
          variant={activeCategory === category ? 'default' : 'outline'}
          className="whitespace-nowrap"
          onClick={() => setActiveCategory(category)}
        >
          {category}
        </Button>
      ))}
    </div>
  );
};

export default CategoryTab;

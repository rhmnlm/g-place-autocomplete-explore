import { Chip } from '@mui/material';
import type { Category } from '../../types';

interface CategoryChipProps {
  category: Category;
  size?: 'small' | 'medium';
  onClick?: () => void;
}

export const CategoryChip = ({ category, size = 'small', onClick }: CategoryChipProps) => {
  return (
    <Chip
      label={category.label}
      size={size}
      onClick={onClick}
      sx={{
        backgroundColor: category.color,
        color: '#ffffff',
        fontWeight: 500,
        fontSize: '0.7rem',
        height: size === 'small' ? 22 : 28,
        '&:hover': {
          backgroundColor: category.color,
          opacity: 0.9,
        },
      }}
    />
  );
};

export default CategoryChip;

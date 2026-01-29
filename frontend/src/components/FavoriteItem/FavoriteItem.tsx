import { Box, Typography, IconButton } from '@mui/material';
import { Star as StarIcon } from '@mui/icons-material';
import type { Location, Category } from '../../types';
import CategoryChip from '../CategoryChip/CategoryChip';

interface FavoriteItemProps {
  location: Location;
  category: Category;
  onRemove?: (locationId: string) => void;
  onClick?: (location: Location) => void;
}

export const FavoriteItem = ({ location, category, onRemove, onClick }: FavoriteItemProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        py: 1.25,
        px: 1,
        borderRadius: 1,
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
        },
      }}
      onClick={() => onClick?.(location)}
    >
      <IconButton
        size="small"
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation();
          onRemove?.(location.id);
        }}
        sx={{
          color: '#FFD700',
          p: 0.5,
          '&:hover': {
            backgroundColor: 'rgba(255, 215, 0, 0.1)',
          },
        }}
      >
        <StarIcon fontSize="small" />
      </IconButton>
      <CategoryChip category={category} />
      <Typography
        variant="body2"
        sx={{
          flex: 1,
          color: 'text.primary',
          fontWeight: 400,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {location.name}
      </Typography>
    </Box>
  );
};

export default FavoriteItem;

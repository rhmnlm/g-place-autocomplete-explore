import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Box,
  Typography,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  Edit as EditIcon,
  Add as AddIcon,
  Check as CheckIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchCategories, createCategory, updateCategory } from '../../store/slices/categoriesSlice';

interface CategoryDialogProps {
  open: boolean;
  onClose: () => void;
}

export const CategoryDialog = ({ open, onClose }: CategoryDialogProps) => {
  const dispatch = useAppDispatch();
  const clientId = useAppSelector((state) => state.client.clientId);
  const categories = useAppSelector((state) => state.categories.items);
  const isLoading = useAppSelector((state) => state.categories.isLoading);

  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  useEffect(() => {
    if (open && clientId) {
      dispatch(fetchCategories({ clientId }));
    }
  }, [open, clientId, dispatch]);

  const handleCreateCategory = async () => {
    if (!clientId || !newCategoryName.trim()) return;

    await dispatch(createCategory({ clientId, categoryName: newCategoryName.trim() }));
    setNewCategoryName('');
  };

  const handleStartEdit = (id: string, name: string) => {
    setEditingId(id);
    setEditingName(name);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleSaveEdit = async () => {
    if (!clientId || !editingId || !editingName.trim()) return;

    await dispatch(updateCategory({ id: editingId, clientId, categoryName: editingName.trim() }));
    setEditingId(null);
    setEditingName('');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Manage Categories</DialogTitle>
      <DialogContent>
        {/* Create new category */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2, mt: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="New category name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCreateCategory();
              }
            }}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateCategory}
            disabled={!newCategoryName.trim() || isLoading}
          >
            Add
          </Button>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Existing categories */}
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
          Your Categories
        </Typography>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress size={24} />
          </Box>
        ) : categories.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
            No categories yet. Create one above.
          </Typography>
        ) : (
          <List dense>
            {categories.map((category) => (
              <ListItem key={category.id} sx={{ borderRadius: 1 }}>
                {editingId === category.id ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                    <TextField
                      fullWidth
                      size="small"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEdit();
                        if (e.key === 'Escape') handleCancelEdit();
                      }}
                      autoFocus
                    />
                    <IconButton size="small" onClick={handleSaveEdit} color="primary">
                      <CheckIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={handleCancelEdit}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ) : (
                  <>
                    <ListItemText primary={category.categoryName} />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        size="small"
                        onClick={() => handleStartEdit(category.id, category.categoryName)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </>
                )}
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryDialog;

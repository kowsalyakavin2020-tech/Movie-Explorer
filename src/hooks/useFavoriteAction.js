import { useFavorites } from '../context/FavoritesContext';
import { useToast } from '../context/ToastContext';

export function useFavoriteAction() {
  const { toggleFavorite, isFavorite } = useFavorites();
  const { showToast } = useToast();

  const toggle = (movie, event) => {
    event?.stopPropagation();
    const wasFavorite = isFavorite(movie.id);
    toggleFavorite(movie.id);
    showToast(
      wasFavorite ? `Removed “${movie.title}” from your favourites.` : `Added “${movie.title}” to your favourites.`,
      wasFavorite ? 'remove' : 'save',
    );
  };

  return { toggle, isFavorite };
}

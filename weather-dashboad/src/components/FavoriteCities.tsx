import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCity, faTrash } from '@fortawesome/free-solid-svg-icons';

interface FavoriteCitiesProps {
  favorites: string[];
  onSelectCity: (city: string) => void;
  onRemoveCity: (city: string) => void;
}

const FavoriteCities: React.FC<FavoriteCitiesProps> = ({ favorites, onSelectCity, onRemoveCity }) => {
  return (
    <div className="favorite-cities">
      <h3>Favorite Cities</h3>
      <div className="favorite-list">
        <ul className="list-group">
          {favorites.map((city, index) => (
            <li 
              key={index} 
              className="list-group-item d-flex align-items-center justify-content-between py-3 px-4"
            >
              <a 
                href="#"
                className="text-decoration-none d-flex align-items-center"
                onClick={(e) => {
                  e.preventDefault();
                  const link = e.currentTarget;
                  const originalContent = link.innerHTML;
                  link.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Loading...';
                  link.style.pointerEvents = 'none';
                  onSelectCity(city);
                  setTimeout(() => {
                    link.innerHTML = originalContent;
                    link.style.pointerEvents = 'auto';
                  }, 1000);
                }}
              >
                <FontAwesomeIcon icon={faCity} className="me-3" />
                {city}
              </a>
              <button 
                className="btn btn-sm btn-danger"
                onClick={() => onRemoveCity(city)}
                aria-label={`Remove ${city} from favorites`}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FavoriteCities;
import React, { useState, useEffect } from 'react';
import Searchbar from './Searchbar';
import ImageGallery from './ImageGallery';
import Button from './Button';
import Loader from './Loader';
import Modal from './Modal';
import { fetchGalleryItems } from './API';

const App = () => {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadMoree, setLoadMore] = useState(false);

  const handleSearchSubmit = query => {
    if (query.trim() === '') {
      return;
    }

    setImages([]);
    setPage(1);
    setSearchQuery(query);
  };

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handleImageClick = imageUrl => {
    setSelectedImage(imageUrl);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchGalleryItems(searchQuery, page);
        const { hits, totalHits } = response.data;

        setImages(prev => [...prev, ...hits]);
        setLoadMore(page < Math.ceil(totalHits / 12));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching images:', error);
        setLoading(false);
      }
    };
    if (searchQuery) {
      fetchData();
    }
  }, [page, searchQuery]);

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  return (
    <div>
      <Searchbar onSubmit={handleSearchSubmit} />
      <ImageGallery
        images={images}
        onImageClick={handleImageClick}
        loading={loading}
      />
      {loading && <Loader />}
      {images.length > 0 && !loading && <Button onClick={handleLoadMore} />}
      {selectedImage && (
        <Modal imageUrl={selectedImage} onClose={handleCloseModal} />
      )}
      {loadMoree && images.length > 0 && !loading && (
        <Button onClick={handleLoadMore} />
      )}
    </div>
  );
};

export { App };

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
    if (page === 1) {
      setImages([]);
    }

    const fetchData = async () => {
      try {
        const response = await fetchGalleryItems(searchQuery, page);
        const { hits } = response.data;

        setImages(prev => [...prev, ...hits]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching images:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [page, searchQuery]);

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const handleModalClick = e => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
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
        <Modal
          imageUrl={selectedImage}
          onClose={handleCloseModal}
          onClick={handleModalClick}
        />
      )}
    </div>
  );
};

export { App };

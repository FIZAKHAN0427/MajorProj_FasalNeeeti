import React, { useState } from 'react';

const PhotoUpload = ({ onPhotoSelect, existingPhotos = [] }) => {
  const [photos, setPhotos] = useState(existingPhotos);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newPhoto = {
            id: Date.now() + Math.random(),
            file,
            preview: e.target.result,
            name: file.name,
            size: file.size,
            date: new Date().toISOString()
          };
          
          setPhotos(prev => [...prev, newPhoto]);
          onPhotoSelect([...photos, newPhoto]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removePhoto = (photoId) => {
    const updated = photos.filter(p => p.id !== photoId);
    setPhotos(updated);
    onPhotoSelect(updated);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
        Crop Photos (Optional)
      </label>
      
      <div className="border-2 border-dashed border-secondary-300 dark:border-secondary-600 rounded-lg p-4">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          id="photo-upload"
        />
        <label
          htmlFor="photo-upload"
          className="cursor-pointer flex flex-col items-center space-y-2"
        >
          <div className="text-4xl">📷</div>
          <div className="text-sm text-center">
            <span className="font-medium text-primary-600">Click to upload photos</span>
            <p className="text-secondary-500">PNG, JPG up to 5MB each</p>
          </div>
        </label>
      </div>

      {photos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group">
              <img
                src={photo.preview}
                alt={photo.name}
                className="w-full h-24 object-cover rounded-lg"
              />
              <button
                onClick={() => removePhoto(photo.id)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg">
                {photo.name.length > 15 ? photo.name.substring(0, 15) + '...' : photo.name}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;
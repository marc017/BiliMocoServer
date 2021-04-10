const config = require('config');

const mapper = (listing) => {
  const baseUrl = config.get('assetsBaseUrl');
  const mapImage = (image, index) => ({
    url: `${baseUrl}${index}${image.fileName}_full.jpg`,
    thumbnailUrl: `${baseUrl}${image.fileName}_thumb.jpg`,
  });

  return {
    ...listing,
    images: listing.images.map(mapImage, index),
  };
};

module.exports = mapper;

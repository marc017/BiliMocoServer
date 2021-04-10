const config = require('config');

const mapper = (store) => {
  const baseUrl = config.get('assetsBaseUrl');
  const mapImage = (img) => ({
    url: `${baseUrl}${img[0].fileName}_full.jpg`,
    thumbnailUrl: `${baseUrl}${img[0].fileName}_thumb.jpg`,
  });

  return {
    ...store,
    images: mapImage(store.store_img[0]),
  };
};

module.exports = mapper;

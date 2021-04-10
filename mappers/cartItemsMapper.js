const config = require('config');

const mapper = (item) => {
  const baseUrl = config.get('assetsBaseUrl');
  const mapImage = (image) => {
    const img = JSON.parse(image);
    console.log(img);
    let result = [];
    img.map((i) => {
      result.push({
        url: `${baseUrl}${i.fileName}_full.jpg`,
        thumbnailUrl: `${baseUrl}${i.fileName}_thumb.jpg`,
      });
    });
    return result;
  };

  return {
    ...item,
    images: mapImage(item.images),
  };
};

module.exports = mapper;

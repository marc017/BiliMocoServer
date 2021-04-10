const dbUtil = require('../utilities/dbUtil');

const categories = [
  {
    id: 1,
    name: 'Furniture',
    icon: 'floor-lamp',
    backgroundColor: '#fc5c65',
    color: 'white',
  },
  {
    id: 2,
    name: 'Cars',
    icon: 'car',
    backgroundColor: '#fd9644',
    color: 'white',
  },
  {
    id: 3,
    name: 'Cameras',
    icon: 'camera',
    backgroundColor: '#fed330',
    color: 'white',
  },
  {
    id: 4,
    name: 'Games',
    icon: 'cards',
    backgroundColor: '#26de81',
    color: 'white',
  },
  {
    id: 5,
    name: 'Clothing',
    icon: 'shoe-heel',
    backgroundColor: '#2bcbba',
    color: 'white',
  },
  {
    id: 6,
    name: 'Sports',
    icon: 'basketball',
    backgroundColor: '#45aaf2',
    color: 'white',
  },
  {
    id: 7,
    name: 'Movies & Music',
    icon: 'headphones',
    backgroundColor: '#4b7bec',
    color: 'white',
  },
  {
    id: 8,
    name: 'Books',
    icon: 'book-open-variant',
    backgroundColor: '#a55eea',
    color: 'white',
  },
  {
    id: 9,
    name: 'Other',
    icon: 'application',
    backgroundColor: '#778ca3',
    color: 'white',
  },
];

const getCategories = async () => {
  const sql = `SELECT 
      item_categories.id,
      item_categories.id as "value",
      item_categories.name as "label",
      item_categories.commission_rate,
      item_categories.type,
      item_categories.icon,
      item_categories.bg_color as "backgroundColor",
      icon_pack as "iconPack"
    FROM ebilimoko.item_categories ORDER BY name`;
  let data = [];
  let result = {};
  try {
    result = await dbUtil.sqlToDB(sql, data);
    return result.rows;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getCategory = (id) => categories.find((c) => c.id === id);

module.exports = {
  getCategories,
  getCategory,
};

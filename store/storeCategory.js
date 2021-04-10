const dbUtil = require('../utilities/dbUtil');

const getStoreCategories = async () => {
  const sql = `SELECT *
    FROM ebilimoko.store_categories
    WHERE store_categories.is_active = true`;
  let data = [];
  let result = {};
  try {
    result = await dbUtil.sqlToDB(sql, data);
    return result.rows;
  } catch (error) {
    throw new Error(error.message);
  }
}


module.exports = {
  getStoreCategories
};

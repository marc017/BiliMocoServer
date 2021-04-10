const dbUtil = require('../utilities/dbUtil');

const addStore = async (item, userId) => {
  const sql = `INSERT INTO ebilimoko.stores 
                (
                  id,
                  user_id,
                  store_name,
                  store_desc,
                  store_img,
                  store_url,
                  address_id,
                  store_category_id,
                  mobile_no,
                  email
                )
              VALUES
                (
                  DEFAULT,
                  '${userId}',
                  '${item.storeName}',
                  '${item.storeDesc}',
                  array['${JSON.stringify(item.images)}']::json[],
                  '${item.storeUrl}',
                  '${item.addressId}',
                  '${item.categoryId}',
                  '${item.mobileNo}',
                  '${item.email}'
                ) RETURNING *;`;
  let data = [];
  let result = {};
  try {
    result = await dbUtil.sqlToDB(sql, data);
    return result.rows;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateStore = async (item) => {
  const sql = `UPDATE ebilimoko.stores
              SET 
                store_name = '${item.storeName.replace("'", "''")}',
                store_desc = '${item.storeDesc.replace("'", "''")}',
                store_img =  array['${JSON.stringify(item.images)}']::json[],
                store_url = '${item.storeUrl}',
                address_id = ${item.addressId},
                store_category_id = '${item.categoryId}',
                mobile_no = '${item.mobileNo}',
                email = '${item.email}'
              WHERE
                id = '${item.id}'
              RETURNING *`;
  let data = [];
  let result = {};
  try {
    result = await dbUtil.sqlToDB(sql, data);
    return result.rows;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getStoreList = async (keyword) => {
  let sql = `SELECT *
                FROM ebilimoko.stores`;
  if (keyword.length > 0 && keyword !== 'undefined') {
    console.log('keyword', keyword, typeof keyword, typeof keyword !== 'undefined');
    sql += ` WHERE ebilimoko.stores.store_name ILIKE '%${keyword}%'`;
  }
  let data = [];
  let result = {};
  try {
    result = await dbUtil.sqlToDB(sql, data);
    return result.rows;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getUserStore = async (userId) => {
  const sql = `SELECT *
                FROM ebilimoko.stores
                WHERE user_id = ${userId}`;
  let data = [];
  let result = {};
  try {
    result = await dbUtil.sqlToDB(sql, data);
    return result.rows;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  getStoreList,
  addStore,
  getUserStore,
  updateStore,
};

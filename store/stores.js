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

const getStoreById = async (storeId) => {
  const sql = `SELECT 
                stores.id as "store_id",
                stores.user_id as "owner_id",
                stores.store_name,
                stores.store_desc,
                stores.store_img,
                stores.store_url,
                stores.mobile_no,
                stores.email,
                store_categories.name,
                address.full_address,
                address.city
                FROM ebilimoko.stores
                JOIN ebilimoko.address ON stores.address_id = address.id
                JOIN ebilimoko.store_categories ON store_categories.id = stores.store_category_id
                WHERE stores.id = ${storeId}`;
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
  getStoreById
};

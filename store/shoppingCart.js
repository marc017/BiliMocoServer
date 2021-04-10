const dbUtil = require('../utilities/dbUtil');

const getCart = async (userId) => {
  const sql = `SELECT 
                  shopping_carts.id,
                  shopping_carts.user_id,
                  shopping_carts.store_id,
                  shopping_carts.total_price,
                  shopping_carts.is_active,
                  stores.store_name, 
                  stores.store_url, 
                  stores.store_img
                FROM ebilimoko.shopping_carts
                JOIN ebilimoko.stores ON stores.id = shopping_carts.store_id
                WHERE shopping_carts.user_id = '${userId}' AND is_active = true`;
  let data = [];
  let result = {};
  try {
    result = await dbUtil.sqlToDB(sql, data);
    return result.rows;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getCartByStoreId = async (userId, storeId) => {
  const sql = `SELECT *
                FROM ebilimoko.shopping_carts
                WHERE user_id = '${userId}' AND store_id = ${storeId} AND is_active = true`;
  let data = [];
  let result = {};
  try {
    result = await dbUtil.sqlToDB(sql, data);
    return result.rows[0];
  } catch (error) {
    throw new Error(error.message);
  }
};

const createCart = async (cartInfo, userInfo) => {
  const sql = `INSERT INTO ebilimoko.shopping_carts 
                (
                  id, store_id, user_id, total_price, is_active
                ) 
                VALUES 
                (
                  DEFAULT, ${cartInfo.store_id}, ${userInfo.userId}, ${cartInfo.total_price}, true
                ) RETURNING *`;
  let data = [];
  let result = {};
  try {
    result = await dbUtil.sqlToDB(sql, data);
    return result.rows[0];
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteCart = async (cartInfo, userInfo) => {
  const sql = `DELETE FROM ebilimoko.shopping_carts
                WHERE id = ${cartInfo.id} AND user_id = ${userInfo.userId} RETURNING *;`;
  let data = [];
  let result = {};
  try {
    result = await dbUtil.sqlToDB(sql, data);
    return result.rows;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateCart = async (cart, userInfo) => {
  const sql = `UPDATE ebilimoko.shopping_carts
                SET 
                  total_price = ${cart.total_price}
                WHERE
                  id = ${cart.id}
                AND 
                  user_id = ${userInfo.userId}
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

module.exports = {
  getCart,
  createCart,
  deleteCart,
  getCartByStoreId,
  updateCart,
};

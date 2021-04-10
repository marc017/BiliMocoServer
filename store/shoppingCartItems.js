const dbUtil = require('../utilities/dbUtil');

const getCartItems = async (cartIds) => {
  const sql = `SELECT 
                  shopping_cart_items.id,
                  shopping_cart_items.shopping_cart_id,
                  shopping_cart_items.store_item_id,
                  shopping_cart_items.quantity,
                  shopping_cart_items.total_price,
                  store_items.item_name,
                  store_items.item_desc,
                  store_items.price,
                  store_items.stock_qty,
                  store_items.images

                FROM ebilimoko.shopping_cart_items
                JOIN ebilimoko.store_items ON store_items.id = shopping_cart_items.store_item_id
                WHERE shopping_cart_items.shopping_cart_id IN (${cartIds})`;
  let data = [];
  let result = {};
  try {
    result = await dbUtil.sqlToDB(sql, data);
    return result.rows;
  } catch (error) {
    throw new Error(error.message);
  }
};

const addToCart = async (cartInfo, storeItem) => {
  const sql = `INSERT INTO ebilimoko.shopping_cart_items 
                (
                  id,
                  shopping_cart_id,
                  store_item_id,
                  quantity,
                  total_price,
                  is_removed
                )
                VALUES (
                  DEFAULT, ${cartInfo.id}, ${storeItem.id}, ${storeItem.quantity}, ${storeItem.total_price}, false
                )`;
  let data = [];
  let result = {};
  try {
    result = await dbUtil.sqlToDB(sql, data);
    return result.rows;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateCartItem = async (storeItem) => {
  const sql = `UPDATE ebilimoko.shopping_cart_items
                SET 
                  quantity = ${storeItem.quantity},
                  total_price = ${storeItem.total_price}
                WHERE
                  id = ${storeItem.id}
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

const getItemById = async (cartItemId) => {
  const sql = `SELECT 
                  shopping_cart_items.quantity,
                  shopping_cart_items.store_item_id,
                  shopping_cart_items.total_price,
                  shopping_cart_items.id,
                  store_items.price
                FROM ebilimoko.shopping_cart_items
                JOIN ebilimoko.store_items ON store_items.id = shopping_cart_items.store_item_id
                WHERE store_item_id = ${cartItemId}`;
  let data = [];
  let result = {};
  try {
    result = await dbUtil.sqlToDB(sql, data);
    return result.rows[0];
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteCartItem = async (cartItemId) => {
  const sql = `DELETE FROM ebilimoko.shopping_cart_items
                WHERE id = ${cartItemId}`;
  let data = [];
  let result = {};
  try {
    result = await dbUtil.sqlToDB(sql, data);
    return result.rows[0];
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  getCartItems,
  getItemById,
  addToCart,
  updateCartItem,
  deleteCartItem,
};

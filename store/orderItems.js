const dbUtil = require('../utilities/dbUtil');

const createOrderItem = async (orderItem, orderId) => {
  const sql = `INSERT INTO ebilimoko.order_items 
                (
                  id, quantity, store_item_id, order_id, total_price
                ) 
                VALUES 
                (
                  DEFAULT, ${orderItem.quantity}, ${orderItem.store_item_id}, ${orderId}, ${orderItem.total_price}
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

const getOrderItems = async (orderId) => {
  const sql = `SELECT
                order_items.id,
                order_items.quantity,
                order_items.store_item_id,
                order_items.status,
                order_items.order_id,
                order_items.total_price,
                store_items.store_id,
                store_items.item_name,
                store_items.item_category_id,
                store_items.price,
                store_items.item_desc,
                store_items.images,
                store_items.stock_qty
               FROM ebilimoko.order_items
               JOIN ebilimoko.store_items ON store_items.id = order_items.store_item_id
               WHERE order_items.order_id = ${orderId}`;
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
  createOrderItem,
  getOrderItems,
};

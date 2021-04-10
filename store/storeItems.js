const dbUtil = require('../utilities/dbUtil');

const searchStoreItemsByKeyword = async (keyword) => {
  const sql = `SELECT *
    FROM ebilimoko.store_items
    WHERE store_items.item_name LIKE %'${keyword}'%`;
  let data = [];
  let result = {};
  try {
    result = await dbUtil.sqlToDB(sql, data);
    return result.rows;
  } catch (error) {
    throw new Error(error.message);
  }
}

const getStoreItemList = async (storeId) => {
  const sql = `SELECT *
                FROM ebilimoko.store_items
                WHERE store_items.store_id = '${storeId}'`;
  let data = [];
  let result = {};
  try {
    result = await dbUtil.sqlToDB(sql, data);
    return result.rows;
  } catch (error) {
    throw new Error(error.message);
  }
};

const addStoreItem = async (item) => {
  const sql = `INSERT INTO  ebilimoko.store_items
                (
                  id,
                  store_id,
                  item_name,
                  item_category_id,
                  price,
                  item_desc,
                  images,
                  stock_qty,
                  commission
                )
                VALUES
                (
                  DEFAULT,
                  ${item.store_id},
                  '${item.item_name}',
                  ${item.item_category_id},
                  ${item.price},
                  '${item.item_desc}',
                  array['${JSON.stringify(item.images)}']::json[],
                  ${item.stock_qty},
                  ${item.commission}
                )
                RETURNING *;`;
  let data = [];
  let result = {};
  try {
    result = await dbUtil.sqlToDB(sql, data);
    return result.rows;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateStoreItem = async (item) => {
  const sql = `UPDATE ebilimoko.store_items
              SET 
                item_name = '${item.item_name.replace("'", "''")}',
                item_category_id = ${item.item_category_id},
                price = '${item.price}',
                item_desc = '${item.item_desc.replace("'", "''")}',
                images = array['${JSON.stringify(item.images)}']::json[],
                stock_qty = ${item.stock_qty},
                commission = ${item.commission}
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

const reduceStockQty = async (storeItemId, quantity) => {
  const sql = `UPDATE ebilimoko.store_items
              SET 
                stock_qty = stock_qty - ${quantity}
              WHERE
                id = '${storeItemId}'
                AND stock_qty >= 0
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
  getStoreItemList,
  addStoreItem,
  updateStoreItem,
  reduceStockQty,
  searchStoreItemsByKeyword
};

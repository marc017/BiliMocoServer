const dbUtil = require('../utilities/dbUtil');

const createOrder = async (orderInfo) => {
  const sql = `INSERT INTO ebilimoko.orders 
                (
                  id, order_code, user_id, status, created_at, created_by, updated_at, updated_by, total_price, store_id, delivery_fee
                ) 
                VALUES 
                (
                  DEFAULT, ${orderInfo.order_code}, ${orderInfo.user_id}, 'pending', NOW(), ${orderInfo.user_id}, NOW(), ${orderInfo.user_id}, ${orderInfo.total_price}, ${orderInfo.store_id}, ${orderInfo.delivery_fee}
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

const getOrderListStore = async (userId) => {
  const sql = `SELECT 
                 orders.id,
                 orders.order_code,
                 orders.user_id as "buyer_id",
                 orders.status,
                 orders.order_notes,
                 orders.created_at,
                 orders.created_by,
                 orders.updated_at,
                 orders.updated_by,
                 orders.total_price,
                 orders.delivery_fee,
                 orders.store_id,
                 stores.store_name,
                 stores.store_img,
                 stores.store_url
                FROM ebilimoko.orders
                JOIN ebilimoko.stores on stores.id = orders.store_id
                WHERE stores.user_id = ${userId}`;
  let data = [];
  let result = {};
  try {
    result = await dbUtil.sqlToDB(sql, data);
    return result.rows;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getOrderListByUser = async (userId) => {
  const sql = `SELECT 
                 orders.id,
                 orders.order_code,
                 orders.user_id as "buyer_id",
                 orders.status,
                 orders.order_notes,
                 orders.created_at,
                 orders.created_by,
                 orders.updated_at,
                 orders.updated_by,
                 orders.total_price,
                 orders.delivery_fee,
                 orders.store_id,
                 stores.store_name,
                 stores.store_img,
                 stores.store_url
                FROM ebilimoko.orders
                JOIN ebilimoko.stores on stores.id = orders.store_id
                WHERE orders.user_id = ${userId}`;
  let data = [];
  let result = {};
  try {
    result = await dbUtil.sqlToDB(sql, data);
    return result.rows;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getOrderById = async (orderId) => {
  const sql = `SELECT 
                 orders.id,
                 orders.order_code,
                 orders.user_id as "buyer_id",
                 orders.status,
                 orders.order_notes,
                 orders.created_at,
                 orders.created_by,
                 orders.updated_at,
                 orders.updated_by,
                 orders.total_price,
                 orders.delivery_fee,
                 orders.store_id,
                FROM ebilimoko.orders
                WHERE orders.store_id = ${orderId}`;
  let data = [];
  let result = {};
  try {
    result = await dbUtil.sqlToDB(sql, data);
    return result.rows;
  } catch (error) {
    throw new Error(error.message);
  }
};

const cancelOrder = async (orderId) => {
  const sql = `UPDATE ebilimoko.orders
                SET
                  status = 'cancelled'
                WHERE id = ${orderId}
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



const confirmOder = async (orderId) => {
  const sql = `UPDATE ebilimoko.orders
                SET
                  status = 'confirmed'
                WHERE id = ${orderId}
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

const completeOrder = async (orderId) => {
  const sql = `UPDATE ebilimoko.orders
                SET
                  status = 'completed'
                WHERE id = ${orderId}
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

const setOrderForDelivery = async (orderId, riderId) => {
  const sql = `UPDATE ebilimoko.orders
                SET
                  status = 'forDelivery',
                  rider_id = ${riderId}
                WHERE id = ${orderId}
                AND rider_id IS NULL
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

const setOrderForShipping = async (orderId) => {
  const sql = `UPDATE ebilimoko.orders
                SET
                  status = 'forShipping'
                WHERE id = ${orderId}
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

// const getOrdersByCity = async (userId, cityName) => {
//   const sql = `SELECT 
//                 orders.id,
//                 orders.order_code,
//                 orders.user_id as "buyer_id",
//                 orders.status,
//                 orders.order_notes,
//                 orders.created_at,
//                 orders.created_by,
//                 orders.updated_at,
//                 orders.updated_by,
//                 orders.total_price,
//                 orders.delivery_fee,
//                 orders.store_id,
//                 orders.rider_id,
//                 stores.store_name,
//                 stores.store_img,
//                 stores.store_url,
//                 stores.user_id as "seller_id",
//               (SELECT address.city FROM ebilimoko.address WHERE address.user_id = orders.user_id AND address.is_default = TRUE AND address.city IN ('${cityName}')) as buyerCity,
//               (SELECT address.city FROM ebilimoko.address WHERE address.id = stores.address_id AND address.city IN ('${cityName}')) as "seller_city"
//               FROM ebilimoko.orders
//               JOIN ebilimoko.stores on stores.id = orders.store_id
// `;
//   let data = [];
//   let result = {};
//   try {
//     result = await dbUtil.sqlToDB(sql, data);
//     return result.rows.filter(order => order.status === 'forShipping' || (+order.rider_id === +userId && (order.status === 'completed' || order.status !== 'cancelled' || order.status !== 'forDelivery')));
//   } catch (error) {
//     throw new Error(error.message);
//   }
// }

const getOrdersByCity = async (userId, cityName) => {
  const sql = `SELECT 
                orders.id,
                orders.order_code,
                orders.user_id as "buyer_id",
                orders.status,
                orders.order_notes,
                orders.created_at,
                orders.created_by,
                orders.updated_at,
                orders.updated_by,
                orders.total_price,
                orders.delivery_fee,
                orders.store_id,
                orders.rider_id,
                stores.store_name,
                stores.store_img,
                stores.store_url,
                stores.user_id as "seller_id",
              (SELECT address.city FROM ebilimoko.address WHERE address.user_id = orders.user_id AND address.is_default = TRUE AND LOWER(address.city) LIKE LOWER('%${cityName}%')) as buyerCity,
              (SELECT address.city FROM ebilimoko.address WHERE address.id = stores.address_id AND LOWER(address.city) LIKE LOWER('%${cityName}%')) as "seller_city"
              FROM ebilimoko.orders
              JOIN ebilimoko.stores on stores.id = orders.store_id
              WHERE 
              (status = 'forShipping'
              and rider_id IS null)
              OR (status != 'forShipping'
              and rider_id = ${userId})

`;
  let data = [];
  let result = {};
  try {
    result = await dbUtil.sqlToDB(sql, data);
    return result.rows.filter(
      order => (order.seller_city !== null && order.buyerCity !== null) && (order.status === 'forShipping' || (+order.rider_id === +userId && (order.status === 'completed' || order.status !== 'cancelled' || order.status !== 'forDelivery'))));
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = {
  createOrder,
  getOrderListByUser,
  cancelOrder,
  confirmOder,
  completeOrder,
  setOrderForDelivery,
  setOrderForShipping,
  getOrderListStore,
  getOrderById,
  getOrdersByCity
};

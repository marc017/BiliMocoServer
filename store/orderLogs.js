const dbUtil = require('../utilities/dbUtil');

const createCancelLog = async (orderInfo) => {
  const sql = `INSERT INTO ebilimoko.order_cancel_logs
                (
                  id, order_id, user_id, reason, cancel_at
                ) 
                VALUES 
                (
                  DEFAULT, ${orderInfo.order_id}, ${orderInfo.user_id}, '${orderInfo.reason}', NOW()
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

const createLog = async (orderInfo) => {
  const sql = `INSERT INTO ebilimoko.order_logs
                (
                  id, order_id, user_id, remarks, type, created_at
                ) 
                VALUES 
                (
                  DEFAULT, ${orderInfo.order_id}, ${orderInfo.user_id}, '${orderInfo.reason}', '${orderInfo.type}', NOW()
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

const getOrderListByUser = async (userId) => {
  const sql = `SELECT *
                FROM ebilimoko.orders
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

const cancelOrder = async (orderId) => {
  const sql = `UPDATE ebilimoko.orders
                SET
                  status = 'cancelled'
                WHERE id = ${orderId}
                RETURNING *`;
};

module.exports = {
  createCancelLog,
  createLog,
  getOrderListByUser,
  cancelOrder,
};

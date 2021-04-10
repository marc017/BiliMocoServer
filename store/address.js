const dbUtil = require('../utilities/dbUtil');

const addAddress = async (item) => {
  const sql = `INSERT INTO ebilimoko.address 
                (
                  id,
                  user_id,
                  label,
                  address,
                  brgy,
                  city,
                  province,
                  latitude,
                  longitude,
                  full_address
                )
              VALUES
                (
                  DEFAULT,
                  '${item.userId}',
                  '${item.label}',
                  '${item.address}',
                  '${item.brgy}',
                  '${item.city}',
                  '${item.province}',
                  '${item.latitude}',
                  '${item.longitude}',
                  '${item.address}, ${item.brgy}, ${item.city}, ${item.province}'
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

const updateAddress = async (item) => {
  const sql = `UPDATE ebilimoko.address
              SET 
                label = '${item.label}',
                address = '${item.address}',
                brgy = '${item.brgy}',
                province = '${item.province}',
                latitude = '${item.latitude}',
                longitude = '${item.longitude}',
                full_address = '${item.address}, ${item.brgy}, ${item.city}, ${item.province}'
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

const deleteAddress = async (addressId) => {
  const sql = `DELETE FROM ebilimoko.address
                WHERE id = ${addressId}
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

const getAddressList = async (userId) => {
  const sql = `SELECT *
                FROM ebilimoko.address
                WHERE address.user_id = '${userId}'
                ORDER BY label`;
  let data = [];
  let result = {};
  try {
    result = await dbUtil.sqlToDB(sql, data);
    return result.rows;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getDefaultAddress = async (userId) => {
  const sql = `SELECT *
                FROM ebilimoko.address
                WHERE address.user_id = '${userId}' 
                AND address.is_default = true`;
  let data = [];
  let result = {};
  try {
    result = await dbUtil.sqlToDB(sql, data);
    return result.rows;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getStoreAddress = async (storeId) => {
  const sql = `SELECT *
                FROM ebilimoko.address
                JOIN ebilimoko.stores ON address.id = stores.address_id
                WHERE stores.id = '${storeId}'`;
  let data = [];
  let result = {};
  try {
    result = await dbUtil.sqlToDB(sql, data);
    return result.rows;
  } catch (error) {
    throw new Error(error.message);
  }
};

const setDefaultAddress = async (addressId) => {
  const sql = `UPDATE ebilimoko.address
              SET 
                is_default = true
              WHERE
                id = ${addressId}
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

const clearDefaultAddress = async (userId) => {
  const sql = `UPDATE ebilimoko.address
              SET 
                is_default = false
              WHERE
                user_id = ${userId}
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
  addAddress,
  getAddressList,
  updateAddress,
  deleteAddress,
  getDefaultAddress,
  getStoreAddress,
  setDefaultAddress,
  clearDefaultAddress,
};

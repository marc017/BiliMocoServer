const dbUtil = require('../utilities/dbUtil');

const getDeliveryRates = async (userId) => {
  const sql = `SELECT *
                FROM ebilimoko.delivery_rates`;
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
  getDeliveryRates,
};

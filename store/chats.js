const dbUtil = require('../utilities/dbUtil');

const getChatRooms = async (userId) => {
  const sql = `SELECT *
                FROM ebilimoko.messages_group
                WHERE members IN ('${userId}') 
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

module.exports = {
  getChatRooms,
};

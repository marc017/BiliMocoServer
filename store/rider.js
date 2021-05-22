const dbUtil = require('../utilities/dbUtil');
const passwordManager = require('../utilities/passwordManager');


const getRiderById = async (id) => {
  const sql = `SELECT first_name, last_name, email, contact_no, address.id as "addressId", address.address, address.brgy, address.city, address.province,
                  address.latitude, address.longitude, address.full_address, users.notification_token as "expoPushToken"
                FROM ebilimoko.users
                JOIN ebilimoko.address ON address.user_id = users.id
                WHERE users.id = '${id}'
                AND address.is_default = true
                AND users.is_rider = true`;
  let data = [];
  let result = {};
  try {
    result = await dbUtil.sqlToDB(sql, data);
    return result.rows;
  } catch (error) {
    throw new Error(error.message);
  }
};


const getRiderByEmail = async (email) => {
  const sql = `SELECT *
                FROM ebilimoko.users
                WHERE users.email = '${email}' OR users.user_name = '${email}'
                AND users.is_rider = true`;
  let data = [];
  let result = {};
  try {
    result = await dbUtil.sqlToDB(sql, data);
    return result.rows;
  } catch (error) {
    throw new Error(error.message);
  }
};

const addUser = (user) => {
  user.id = users.length + 1;
  users.push(user);
};

const createUser = async (user) => {
  // encrypt password
  const passwordEncrypted = passwordManager.encrypt(user.password);
  let sql = `INSERT INTO ebilimoko.users 
              (
                id,
                user_name,
                first_name,
                last_name,
                email,
                email_verified_at,
                password,
                remember_token,
                locked_until,
                contact_no,
                user_type_id,
                is_verified,
                is_rider
              )
            VALUES
              (
                DEFAULT,
                '${user.userName}',
                '${user.firstName}',
                '${user.lastName}',
                '${user.email}',
                null,
                '${passwordEncrypted}',
                null,
                null,
                '${user.contactNo}',
                '1',
                false,
                true
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

module.exports = {
  getRiderById,
  createUser,
  getRiderByEmail
};

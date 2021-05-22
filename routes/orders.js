const express = require('express');
const router = express.Router();
const Joi = require('joi');
const aleaRNGFactory = require('number-generator/lib/aleaRNGFactory');

const helperOrders = require('../utilities/helperOrders');
const ordersStore = require('../store/orders');
const storeItemStore = require('../store/storeItems');
const orderItemsStore = require('../store/orderItems');
const shoppingCart = require('../store/shoppingCart');
const userStore = require('../store/users');
const sendPushNotification = require('../utilities/pushNotifications');
const logger = require('../utilities/logger');
const auth = require('../middleware/auth');

const storeMapper = require('../mappers/stores');
const storeItemMapper = require('../mappers/storeItems');
const orderLogs = require('../store/orderLogs');

const generateOrderCode = (userId) => {
  const generator = aleaRNGFactory(+userId + Date.now());
  return generator.uInt32();
};

router.post('/', auth, async (req, res) => {
  try {
    const orderItems = req.body.items;
    const user = req.user;
    // create order entry
    const orderCode = generateOrderCode(user.userId);
    const orderInfo = {
      order_code: orderCode,
      user_id: user.userId,
      total_price: req.body.total_price,
      delivery_fee: req.body.delivery_fee,
      store_id: req.body.store_id,
    };

    let order = await ordersStore.createOrder(orderInfo);

    // get store push notification token
    const storeOwner = await userStore.getUserByStoreId(req.body.store_id);
    if (storeOwner[0]) {
      sendPushNotification(storeOwner[0].expoPushToken, {
        title: 'New Order!',
        body: 'Hurray! Your store have a new order!',
      });
    }

    if (user) {
      sendPushNotification(user.expoPushToken, {
        title: 'Order Posted!',
        body: 'Nice! Your order has been posted!',
      });
    }
    // console.log(req.body.total_price);
    // create order items
    for (let i = 0; i < orderItems.length; i++) {
      orderItemsStore.createOrderItem(orderItems[i], order.id);
    }

    // remove shopping cart
    let deleteCart = await shoppingCart.deleteCart(
      { id: req.body.cart_id },
      user
    );

    // update stock qty
    for (let i = 0; i < orderItems.length; i++) {
      await storeItemStore.reduceStockQty(
        orderItems[i].store_item_id,
        orderItems[i].quantity
      );
    }
    res.send(order);
  } catch (error) {
    logger.error('ORDERS [POST]: ' + error);
    res
      .status(500)
      .json({ status: 'error', message: error.message, statusCode: 500 });
  }
});

router.put('/', auth, async (req, res) => {
  try {
    const orderInfo = req.body;
    const cancelOrder = await ordersStore.cancelOrder(orderInfo.id);

    // create a cancel log
    // ${orderInfo.order_id}, ${orderInfo.user_id}, ${orderInfo.reason},
    const cancelInfo = {
      order_id: orderInfo.id,
      user_id: req.user.userId,
      reason: orderInfo.reason,
    };
    console.log(orderInfo);
    const cancelLog = await orderLogs.createCancelLog(cancelInfo);
    sendPushNotification(req.user.expoPushToken, {
      title: 'Order Cancelled!',
      body: `Bummer! Order#${orderInfo.order_code}  has been cancelled!`,
    });

    // get store owner token
    const storeOwner = await ordersStore.getOrderById(orderInfo.id);
    // console.log(storeOwner);
    sendPushNotification(storeOwner[0].expoPushToken, {
      title: 'Order Cancelled!',
      body: `Bummer! Order#${orderInfo.order_code} has been cancelled!`,
    });
    res.send(cancelOrder);
  } catch (error) {
    logger.error(error);
    res
      .status(500)
      .json({ status: 'error', message: error.message, statusCode: 500 });
  }
});

router.put('/owner/cancel', auth, async (req, res) => {
  try {
    const orderInfo = req.body;
    const cancelOrder = await ordersStore.cancelOrder(orderInfo.id);

    // create a cancel log
    // ${orderInfo.order_id}, ${orderInfo.user_id}, ${orderInfo.reason},
    const cancelInfo = {
      order_id: orderInfo.id,
      user_id: req.user.userId,
      reason: orderInfo.reason,
    };
    console.log(orderInfo);
    const cancelLog = await orderLogs.createCancelLog(cancelInfo);
    sendPushNotification(req.user.expoPushToken, {
      title: 'Order Cancelled!',
      body: `You cancelled Order#${orderInfo.order_code}!`,
    });

    // get store owner token
    const customer = await userStore.getUserById(orderInfo.buyer_id);
    // console.log(storeOwner);
    sendPushNotification(customer[0].expoPushToken, {
      title: 'Order Cancelled!',
      body: `Bummer! Your Order#${orderInfo.order_code} has been cancelled!`,
    });
    res.send(cancelOrder);
  } catch (error) {
    logger.error(error);
    res
      .status(500)
      .json({ status: 'error', message: error.message, statusCode: 500 });
  }
});

router.post('/owner/actions', auth, async (req, res) => {
  try {
    const orderInfo = req.body;
    let order = null;
    
    switch (orderInfo.type) {
     
      case 'confirmed':
        order = await ordersStore.confirmOder(orderInfo.id);
        break;
      case 'forShipping':
        order = await ordersStore.setOrderForShipping(orderInfo.id);
        break;
      case 'forDelivery':
        order = await ordersStore.setOrderForDelivery(orderInfo.id, req.user.userId);
        break;
      case 'completed':
        order = await ordersStore.completeOrder(orderInfo.id);
        break;
    }

    // const cancelOrder = await ordersStore.cancelOrder(orderInfo.id);

    const messageBody = helperOrders.getOrderDisplays(orderInfo.type);
    const messageBodySeller = helperOrders.getOrderDisplays(orderInfo.type, true);

    // create a log
    // ${orderInfo.order_id}, ${orderInfo.user_id}, ${orderInfo.reason},
    const logInfo = {
      order_id: orderInfo.id,
      user_id: req.user.userId,
      reason: orderInfo.reason,
      type: orderInfo.type
    };
    console.log(req.user);
    const cancelLog = await orderLogs.createLog(logInfo);
    messageBody.body = `[${orderInfo.order_code}]: ${messageBody.body}`;
    if (req.user.expoPushToken) {
      sendPushNotification(req.user.expoPushToken, messageBody);
    }

    // get store owner token
    const storeOwner = await userStore.getUserById(orderInfo.seller_id);
    const customer = await userStore.getUserById(orderInfo.buyer_id);
    console.log(storeOwner);
    res.send(order);
    sendPushNotification(customer[0].expoPushToken, messageBody);
    sendPushNotification(storeOwner[0].expoPushToken, messageBodySeller);
    
  } catch (error) {
    logger.error(error);
    res
      .status(500)
      .json({ status: 'error', message: error.message, statusCode: 500 });
  }
});


const getOrderItems = async (orderId) => {
  let items = await orderItemsStore.getOrderItems(orderId);
  items = items.map(storeItemMapper);
  return items;
};

router.get('/store', auth, async (req, res) => {
  try {
    let orderList = await ordersStore.getOrderListStore(req.user.userId);
    orderList = orderList.map(storeMapper);
    let result = [];
    for (let i = 0; i < orderList.length; i++) {
      // const store = orderList[i].map(storeMapper);
      const items = await getOrderItems(orderList[i].id);

      result.push({ ...orderList[i], items: items });
    }

    res.send(result);
  } catch (error) {
    res
      .status(500)
      .json({ status: 'error', message: error.message, statusCode: 500 });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    let orderList = await ordersStore.getOrderListByUser(req.user.userId);
    orderList = orderList.map(storeMapper);
    let result = [];
    for (let i = 0; i < orderList.length; i++) {
      // const store = orderList[i].map(storeMapper);
      const items = await getOrderItems(orderList[i].id);

      result.push({ ...orderList[i], items: items });
    }

    res.send(result);
  } catch (error) {
    res
      .status(500)
      .json({ status: 'error', message: error.message, statusCode: 500 });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    let orderList = await ordersStore.getOrderListByUser(req.user.userId);
    orderList = orderList.map(storeMapper);
    let result = [];
    for (let i = 0; i < orderList.length; i++) {
      // const store = orderList[i].map(storeMapper);
      const items = await getOrderItems(orderList[i].id);
      result.push({ ...orderList[i], items: items });
    }

    res.send(result);
  } catch (error) {
    res
      .status(500)
      .json({ status: 'error', message: error.message, statusCode: 500 });
  }
});

// router.get('/pending/city/:cityName', auth, async (req, res) => {
//   try {
//     const cityName = req.params.cityName;
//     if (!cityName) {
//       res
//       .status(500)
//       .json({ status: 'error', message: 'Undefined parameter for City Name', statusCode: 500 });
//     }
//     console.log('cityName', cityName);
//     let orderList = await ordersStore.getPendingOrdersByCity(req.user.userId, cityName);
//     orderList = orderList.map(storeMapper);
//     let result = [];
//     for (let i = 0; i < orderList.length; i++) {
//       // const store = orderList[i].map(storeMapper);
//       const items = await getOrderItems(orderList[i].id);
//       if (items) {
//         console.log('items =>', items);
//         result.push({ ...orderList[i], items: items });
//       }
//     }

//     res.send(result);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ status: 'error', message: error.message, statusCode: 500 });
//   }
// });

router.get('/byCity/:cityName', auth, async (req, res) => {
  try {
    
    const cityName = req.params.cityName;
    if (!cityName) {
      res
      .status(500)
      .json({ status: 'error', message: 'Undefined parameter for City Name', statusCode: 500 });
    }
    console.log('cityName', cityName);
    let orderList = await ordersStore.getOrdersByCity(req.user.userId, cityName);
    orderList = orderList.map(storeMapper);
    let result = [];
    for (let i = 0; i < orderList.length; i++) {
      // const store = orderList[i].map(storeMapper);
      const items = await getOrderItems(orderList[i].id);
      if (items) {
        console.log('items =>', items);
        result.push({ ...orderList[i], items: items });
      }
    }

    res.send(result);
  } catch (error) {
    res
      .status(500)
      .json({ status: 'error', message: error.message, statusCode: 500 });
  }
});

module.exports = router;

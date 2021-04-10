const getOrderDisplays = (orderType) => {
  let result = {
    title: '',
    body: ''
  }

  switch (orderType) {
    case 'created':
      result.title = 'Order Created';
      result.body = 'Order has been posted!';
      break;
    case 'confirmed':
      result.title = 'Order Confirmed';
      result.body = 'Order has been confirmed by seller!';
      break;
    case 'forShipping':
      result.title = 'Order for Shipping';
      result.body = 'Order is now ready for shipping!';
      break;
    case 'forDelivery':
      result.title = 'Order for Delivery';
      result.body = 'Order is now being delivered to you!';
      break;
    case 'completed':
      result.title = 'Order Complete';
      result.body = 'Order is now Complete. Thanks for using our services!';
      break;
    case 'cancelled':
      result.title = 'Order Cancelled';
      result.body = 'Order has been Cancelled';
      break;
  }

  return result;
};

module.exports = {
  getOrderDisplays
};
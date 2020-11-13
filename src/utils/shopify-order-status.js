const Hoek = require('@hapi/hoek')
const debug = require('debug')('shopify-order-status')
const Shopify = require('shopify-api-node')

module.exports = async () => {
  let units = 0
  try {
    if (
      !process.env.SHOPIFY_SHOP_NAME ||
      !process.env.SHOPIFY_APIKEY ||
      !process.env.SHOPIFY_PASSWORD
    ) {
      throw new Error('shopify not enabled')
    }

    const shopify = new Shopify({
      shopName: process.env.SHOPIFY_SHOP_NAME,
      apiKey: process.env.SHOPIFY_APIKEY,
      password: process.env.SHOPIFY_PASSWORD,
      apiVersion: '2020-10'
    })

    // TODO -> Verify which orders should be counted
    const orderCount = await shopify.order.count({
      status: 'any',
      financial_status: 'paid'
    })
    debug('Got paid order count', orderCount)
    units = orderCount

    // TODO -> count # of units instead of # of orders?
  } catch (e) {
    debug('ERROR', e)
  } finally {
    return { units }
  }
}

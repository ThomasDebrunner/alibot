/**
 * Configure this file with your values and save it as "config.js"
 */


const config = {
    ZAPIEX_TOKEN: 'TOKEN',
    ALIEXPRESS_USERNAME: 'john@doe.com',
    ALIEXPRESS_PASSWORD: 'password',
    CURRENCY: 'USD',
    SHIP_TO: 'US',
    MAX_ORDER_PRICE: 4,
    SHIPPING_ADDRESS: {
        name: 'John Doe',
        countryCode: 'US',
        city: 'New York',
        zipCode: '1055',
        addressLine1: '69 East Av.',
        addressLine2: '',
        phoneCountry: '+1',
        mobilePhone: '12345678910',
        province: 'Other'
    }
}

module.exports = config

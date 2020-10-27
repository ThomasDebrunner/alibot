const randomWords = require('random-words');
const axios = require('axios')
const config = require('./config')

const VERBOSE = 1

const POST_CFG = {
    headers: {
        'x-api-key': config.ZAPIEX_TOKEN
    }
}

// -----------------------------------------------------------------------------

async function searchAliExpress(searchTerm) {
    const response = await axios.post('https://api.zapiex.com/v3/search', {
        text: searchTerm,
        currency: config.CURRENCY,
        shipTo: config.SHIP_TO,
        shipFrom: 'CN',
        moreThanFourStarsOnly: true
    }, POST_CFG)
    return response.data.data
}


async function selectProduct() {
    const word = randomWords()
    VERBOSE > 0 && console.log(`Searching for "${word}"`)

    const results = await searchAliExpress(word)
    let items = results.items
    
    // Compute total price for items
    items = items.map(item => ({
        ...item,
        totalPrice: item.shippingMinPrice.value + item.productMinPrice.value
    }))
    // Filter too expensive items
    items = items.filter(item => item.totalPrice <= config.MAX_ORDER_PRICE)
    // Sort them by rating
    items = items.sort((a, b) => b.averageRating - a.averageRating)

    if (items.length <= 0) {
        VERBOSE > 0 && console.error('Could not find a product that matches the conditions. Aborting')
        return null
    }

    VERBOSE > 0 && console.log(`Found ${items.length} items that cost less than ${config.MAX_ORDER_PRICE}`)
    const product = items[0]
    VERBOSE > 0 && console.log(`Product search price ${product.productMinPrice.value}, shipping search price ${product.shippingMinPrice.value}`)
    VERBOSE > 0 && console.log(`Selected ${product.productId} "${product.title}" for CHF ${product.totalPrice}`)

    const productDetails = (await axios.post('https://api.zapiex.com/v3/product/details', {
        productId: product['productId'],
        shipTo: config.SHIP_TO,
        shipFrom: 'CN',
        currency: config.CURRENCY,
        getShipping: true
    }, POST_CFG)).data.data

    return productDetails
}

function selectSKU(product) {
    if (!product.hasVariations) {
        return null
    }
    // else choose cheapest variation
    const variations = product.variations
    variations.sort((a, b) => (a.price.web.hasDiscount ? 
        a.price.web.discountedPrice.value : a.price.web.originalPrice.value) - (b.price.web.hasDiscount ? 
            b.price.web.discountedPrice.value : b.price.web.originalPrice.value))
    return variations[0]
}

function selectCarrier(product) {
    const carriers = product.shipping.carriers
    carriers.sort((a, b) => a.price.value - b.price.value)
    return carriers[0]
}


function performOrder(order) {
    return axios.post('https://beta.api.zapiex.com/v3/order/create', order, POST_CFG).then(() => {
        VERBOSE > 0 && console.log('Order performed')
        return true
    }).catch(e => {
        console.error('[ERROR]')
        console.error(e.response.data)
        return false
    })
}

async function main() {
    let ordered = false
    do {
        try {
            const product = await selectProduct()
            if(!product) {
                continue
            }
            const sku = selectSKU(product)
            const carrier = selectCarrier(product)
            if (!carrier) {
                continue
            }
            const itemFinalPrice = sku ? 
                (sku.price.web.hasDiscount ? sku.price.web.discountedPrice.value : sku.price.web.originalPrice.value) :
                (product.price.web.hasDiscount ? product.price.web.discountedPrice.value : product.price.web.originalPrice.value)
            
            const shippingFinalPrice = carrier.price.value
            VERBOSE > 0 && console.log(`Final price: ${itemFinalPrice} shipping: ${shippingFinalPrice}`)

            if (shippingFinalPrice + itemFinalPrice > config.MAX_ORDER_PRICE) {
                VERBOSE > 0 && console.log(`Final price ${shippingFinalPrice + itemFinalPrice} too high. Selecting other product`)
                continue
            }

            VERBOSE > 0 && console.log(`Ordering product ID ${product.productId}`)
            VERBOSE > 0 && console.log(`Title ${product.title}`)
            process.exit(1)

            ordered = await performOrder({
                username: config.ALIEXPRESS_USERNAME,
                password: config.ALIEXPRESS_PASSWORD,
                products: [{
                    productId: product.productId,
                    sku: (sku && sku.sku) || '',
                    quantity: 1,
                    carrierId: carrier.company.id,
                    orderMemo: 'Ordered by alibot'
                }],
                shippingAddress: config.SHIPPING_ADDRESS,
                currency: config.CURRENCY
            })
            
        } catch(e) {
            console.log('[ERROR]')
            console.log(e)
            process.exit(1)
        }
    } while(!ordered)

}


main()


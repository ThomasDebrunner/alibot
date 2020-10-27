# Alibot

Alibot orders random items on Aliexpress.

"A true source of deep meaning, in a consumerist society" - *Myself*

Before use, please read this information carefully.


## What is Alibot and what is it used for?

Alibot is a script that randomly orders items from aliexpress.
Each invocation of the script looks for a random product on aliexpress that, including shipping, costs less
than a user-defined maximum value. The scripts keeps trying until it finds such a product. As soon as
a product is found that satisfies this, alibot places an order on aliexpress.


## How to use Alibot?

Make sure you have nodejs installed on your system.

1. Clone this repository
2. Create an account on zapiex.com
3. Rename `config_example.js` to `config.js`
4. Fill in your information into `config.js`
5. Make sure you have nodejs installed
6. `npm install`
7. Make sure, you really really really want to order a random item from aliexpress
8. `node index.js`


## Possible side effects

Some patents report cases of surprise when they receive items in the mail they did not know they ordered.
Severe cases can lead to euphoria.
There is a high risk of losing money when ordering items from the internet. 


## How to store Alibot

To enjoy the full Alibot experience, it is best to store the script on an always-on device and to let it run once a day.
Then you'll have a packet in the mail every day. 


## Problems with Alibot

The Zapiex API does not allow payments yet. You'll have to login to aliexpress to perform the payments and to release the orders.
You do this best with your eyes closed, not to spoil the fun.


**Note that aliexpress does not officially have an API. All API calls are powered by Zapiex. The author of this software is not affiliated with Zapiex nor Aliexpress. When using this script, personal data such as login credentials, address, telephone number, credit card details will get transferred to Zapiex and aliexpress.**

## License

MIT

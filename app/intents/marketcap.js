import get from 'request-promise';
import Fuse from 'fuse.js';

export default [
	'GetMarketCapIntent',
	function (request, response) {
		const currency = request.slot('Currency');

		console.log(request.data.request.locale, 1);
		return get({uri: 'https://api.coinmarketcap.com/v1/ticker/', json: true}).then(data => {
			if (!currency) {
				return new Promise(resolve => {
					return resolve(response.say(request.__('DATA.HELP_REPROMPT')));
				});
			}
			const fuse = new Fuse(data, {keys: ['name', 'symbol'], threshold: 0.5});
			const result = fuse.search(currency)[0];

			if (result) {
				const answer = request.__('DATA.MARKETCAP', result.name, Math.floor(result.market_cap_usd));
				response.say(answer).send();
			} else {
				response.say(request.__('DATA.HELP_REPROMPT')).send();
			}
		});
	}
];

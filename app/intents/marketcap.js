import get from 'request-promise';
import Fuse from 'fuse.js';

export default [
	'GetMarketCapIntent',
	function (request, response) {
		const currency = request.slot('Currency');

		if (!currency) {
			return new Promise(resolve => {
				return resolve(response.say(request.__('DATA.HELP_REPROMPT')));
			});
		}
		return get({uri: 'https://api.coinmarketcap.com/v1/ticker/', json: true}).then(data => {
			const fuse = new Fuse(data, {
				shouldSort: true,
				threshold: 0.4,
				location: 0,
				distance: 100,
				maxPatternLength: 38,
				minMatchCharLength: 1,
				keys: [
					'symbol',
					'id'
				]
			});
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

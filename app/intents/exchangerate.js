import get from 'request-promise';
import Fuse from 'fuse.js';

export default [
	'GetExchangeRateIntent',
	(request, response) => {
		const currency = request.slot('Currency');
		let count = request.slot('Count') ? request.slot('Count') : 1;
		if (isNaN(count)) {
			count = 1;
		}

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
				const quantity = count === 1 ? 'SINGULAR' : 'PLURAL';
				const args = [result.name, Math.floor(result.price_usd * count).toString(), (Math.round(result.price_usd * count * 100) % 100).toString()];
				if (count !== 1) {
					args.splice(0, 0, count);
				}
				const answer = request.__(`DATA.EXCHANGERATE.${quantity}`, ...args);
				response.say(answer).send();
			} else {
				response.say(request.__('DATA.HELP_REPROMPT')).send();
			}
		});
	}
];

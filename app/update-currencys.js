import fs from 'fs';
import get from 'request-promise';

get({uri: 'https://api.coinmarketcap.com/v1/ticker/', json: true}).then(data => {
	const currencys = [].concat(...data.map(e => {
		if (e.name === 'HempCoin') {
			return [e.id];
		}
		if (e.symbol === 'ARC' || e.symbol === 'APC' || e.symbol === 'UNC') {
			return [e.name];
		}
		if (e.symbol !== e.name) {
			return [e.symbol, e.name];
		}
		return [e.name];
	}));
	fs.writeFile(`${__dirname}/speechAssets/CRYPTOCURRENCY_type.txt`, currencys.join('\r\n'), err => {
		if (err) {
			return console.log(err);
		}
		console.log('successfully wrote file');
	});
});

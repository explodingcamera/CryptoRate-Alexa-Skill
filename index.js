import i18n from 'i18n';
import Express from 'express';

import app from './app';

const expressApp = new Express();

app.pre = function (request) {
	let locale;
	console.log(request.data);
	if (request.data && request.data.request && request.data.request.locale) {
		locale = request.data.request.locale || 'de-DE';
	} else {
		locale = 'en-US';
	}
	i18n.configure({
		locales: ['en-US', 'en-GB', 'de-DE'],
		defaultLocale: locale,
		objectNotation: true,
		directory: `${__dirname}/locales`,
		register: request
	});
	i18n.setLocale(locale || 'en-US');
};

app.express({
	expressApp,
	endpoint: 'alexa/cryptorate',
	checkCert: false,
	debug: true
});

app.post = function (request, response, type, exception) {
	if (exception) {
    // always turn an exception into a successful response
		response.clear().say('An error occured: ' + exception).send();
	}
};

expressApp.listen(8080);

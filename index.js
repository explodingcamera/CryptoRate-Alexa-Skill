import i18n from 'i18n';
import Express, {Router as router} from 'express';

import app from './app';

const expressApp = new Express();

app.express({expressApp,
	router: router(),
	endpoint: 'alexa/cryptorate',
	checkCert: false,
	debug: true
});

app.pre = function (req) {
	let locale;
	if (req.data && req.data.request && req.data.request.locale) {
		locale = req.data.request.locale || 'de-DE';
	} else {
		locale = 'en-US';
	}
	i18n.configure({
		locales: ['en-US', 'en-GB', 'de-DE'],
		defaultLocale: locale,
		objectNotation: true,
		directory: `${__dirname}/locales`,
		register: req
	});
};
app.post = function (request, response, type, exception) {
	if (exception) {
    // always turn an exception into a successful response
		response.clear().say('An error occured: ' + exception).send();
	}
};

expressApp.listen(8080);

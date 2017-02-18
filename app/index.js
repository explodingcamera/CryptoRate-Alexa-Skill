import {app as Alexa} from 'alexa-app';

import intents from './intents';

const app = new Alexa('cryptorate');

console.log(intents);
for (const intent of intents) {
	app.intent(...intent);
}

export default app;

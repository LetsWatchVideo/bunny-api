import path from 'path';
import nconf from 'nconf';
const ENV = process.env.NODE_ENV || 'production';

nconf.argv().env();
nconf.file('default', path.join('config', path.sep, `${ENV}.json`));
nconf.set('base_dir', __dirname);
nconf.defaults({
	server: {
		name: 'letswatch',
		domain: 'letswatch.video',
		whitelist: [
			/(^127\.)|(^10\.)|(^172\.1[6-9]\.)|(^172\.2[0-9]\.)|(^172\.3[0-1]\.)|(^192\.168\.)/
		]
	},
	database: {
		client: 'mysql2',
		connection: {
			host: '127.0.0.1',
			user: 'your_database_user',
			password: 'your_database_password',
			database: 'myapp_test'
		}
	}
});
//nconf.save();

global.nconf = nconf;
global.dbInstance = initDb();
console.log(global.nconf.get('database:connection:database'));
function initDb(){
	return require('knex')({
		client: nconf.get('database:client'),
		connection: {
			host: nconf.get('database:connection:host'),
			user: nconf.get('database:connection:user'),
			password: nconf.get('database:connection:password'),
			database: nconf.get('database:connection:database')
		}
	});
}

import { send } from 'micro';
import { compose } from 'micro-hoofs';
import microCors from 'micro-cors';
import { router, get, post, del } from 'microrouter';
import ratelimit from 'micro-ratelimit2';
import { handleErrors } from 'micro-boom';
import Redis from 'ioredis';

const corsMiddleware = microCors({
	allowMethods: ['POST','GET','PUT','PATCH','DELETE','OPTIONS'],
	allowHeaders: [ 'Content-Type', 'Authorization', 'Accept', 'X-Requested-With', 'Origin'],
	maxAge: 86400,
	origin: '*',
	runHandlerOnPreflightRequest: true
});

const rateLimitMiddleware = ratelimit.bind(ratelimit, {
	db: new Redis(),
	id: (req) => req.headers['x-forwarded-for'] || req.connection.remoteAddress.replace(/^.*:/, ''),
	max: 300,
	duration: 60 * 1000,
	whitelist: req => {
		return nconf.get('server:whitelist')
			.some(r => req.headers.hasOwnProperty('x-forwarded-for') ? r.test(req.headers['x-forwarded-for']) : r.test(req.connection.remoteAddress.replace(/^.*:/, '')));
	}
});

const middleware = compose(...[
	//handleErrors,
	corsMiddleware,
	rateLimitMiddleware,
]);

const notfound = async (req, res) => {
	send(res, 404, await Promise.resolve('Not found route'))
};

module.exports = router(
	post('/auth/register', middleware(require('./routes/auth/register'))),
	post('/auth/login', middleware(require('./routes/auth/login'))),
	post('/room/create', middleware(require('./routes/room/create'))),
	post('/room/remote/give', middleware(require('./routes/room/remote/give'))),
	post('/room/remote/take', middleware(require('./routes/room/remote/take'))),
	post('/*', notfound),
	get('/room/remote', middleware(require('./routes/room/remote/get'))),
	get('/room', middleware(require('./routes/room/get'))),
	get('/room/:name', middleware(require('./routes/room/get'))),
	get('/auth/me', middleware(require('./routes/auth/me'))),
	get('/', middleware(require('./routes/index/get'))),
	get('/*', notfound),
);
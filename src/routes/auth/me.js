import { send, json } from 'micro';
import { compose } from 'micro-hoofs';

import verifyJWTKey from '../../services/verifyJWTKey';

module.exports = compose(
	verifyJWTKey
)(
	async (req, res) => {
		const user = req.user;
		if(user){
			send(res, 200, {
				statusCode: 200,
				accessToken: req.user.accessToken,
				user: {
					id: req.user.id,
					name: req.user.name,
					type: req.user.type
				}
			});
		}else{
			send(res, 401, {
				statusCode: 401,
				error: 'Unauthorized',
				token: null,
				user: null
			});
		}
	}
);
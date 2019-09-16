import { send, json } from 'micro';
import { compose } from 'micro-hoofs';

import verifyJWTKey from '../../services/verifyJWTKey';

module.exports = compose(
	verifyJWTKey
)(
	async (req, res) => {
		// Get the users assigned room, if they have one
		send(res, 401, {
				statusCode: 401,
				token: null,
				user: null
		});
	}
);
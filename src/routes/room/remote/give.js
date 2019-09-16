import { send, json } from 'micro';
import { compose } from 'micro-hoofs';

import verifyJWTKey from '../../services/verifyJWTKey';

module.exports = compose(
	verifyJWTKey
)(
	async (req, res) => {
		send(res, 401, {
				statusCode: 401,
				token: null,
				user: null
		});
	}
);
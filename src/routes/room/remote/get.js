import { send, json } from 'micro';
import { compose } from 'micro-hoofs';

import roomModel from '../../../models/room';

import verifyJWTKey from '../../../services/verifyJWTKey';

module.exports = compose(
	verifyJWTKey
)(
	async (req, res) => {
		const room = new roomModel;
        const jsonData = await json(req);
        
        let isValid = jsonData.password ? room.isValidRemotePassword(jsonData.password) : false;

		send(res, isValid ? 200 : 400, {
			statusCode: isValid ? 200 : 400,
			isValid
		});
	}
);
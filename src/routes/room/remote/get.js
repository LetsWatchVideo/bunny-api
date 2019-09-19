import { send, json } from 'micro';
import { compose } from 'micro-hoofs';

import roomModel from '../../../models/room';

import verifyJWTKey from '../../services/verifyJWTKey';

module.exports = compose(
	verifyJWTKey
)(
	async (req, res) => {
		const room = new roomModel;
        const jsonData = await json(req);
        
        let isValid = jsonData.token ? room.isValidRemoteToken(jsonData.token) : false;

		send(res, isValid ? 200 : 400, {
			statusCode: isValid ? 200 : 400,
			isValid
		});
	}
);
import { send } from 'micro';
import { compose } from 'micro-hoofs';

import verifyJWTKey from '../../services/verifyJWTKey';

import roomModel from '../../models/room';

module.exports = compose(
	verifyJWTKey
)(
	async (req, res) => {
		if(req.user){
			// Get the users assigned room, if they have one
			let rm = new roomModel;
			let room = rm.getUserRoom(req.user.id);
			return send(res, 401, {
				statusCode: 401,
				data: {
					room,
					user: req.user
				}
			});
		}else{
			return send(res, 401, {
					statusCode: 401,
					data: null
			});
		}
	}
);
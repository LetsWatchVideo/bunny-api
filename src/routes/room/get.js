import { send } from 'micro';
import { compose } from 'micro-hoofs';

import verifyJWTKey from '../../services/verifyJWTKey';

import roomModel from '../../models/room';

module.exports = compose(
	verifyJWTKey
)(
	async (req, res) => {
		let rm = new roomModel;
		let room;

		if(req.params && req.params.name){
			room = rm.getRoom(req.params.name);
		}else if(req.user){
			// Get the users assigned room, if they have one
			room = rm.getUserRoom(req.user.id);
		}
		return send(res, room ? 200 : 401, {
			statusCode: room ? 200 : 401,
			data: {
				room,
				user: req.user ? req.user : null
			}
		});
	}
);
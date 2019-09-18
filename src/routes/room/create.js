import {
	send,
	json
} from 'micro';
import {
	compose
} from 'micro-hoofs';

import Docker from 'dockerode';

import verifyJWTKey from '../../services/verifyJWTKey';

const MAX_ROOM_QUOTA = 1;
module.exports = compose(
	verifyJWTKey
)(
	async (req, res) => {
		const jsonData = await json(req);

		// Verify that room name (jsonData.name) is set
		if(!jsonData.name){
			return send(res, 400, {
				statusCode: 400,
				statusMessage: 'Room name not specified'
			});
		}
	
		// Verify that room name (jsonData.name) does not exist
		if(room.getRoom(jsonData.name)){
			return send(res, 400, {
				statusCode: 400,
				statusMessage: 'Room already exists'
			});
		}
	
		// Verify that user only has one active room
		let userRoom = room.getUserRoom(req.user);
		if(!req.user || (userRoom && userRoom.count >= MAX_ROOM_QUOTA)){
			return send(res, 403, {
				statusCode: 403,
				statusMessage: 'User has reached max room quota'
			});
		}

		var docker = new Docker({
			socketPath: '/var/run/docker.sock'
		});

		let container = await docker.run('bunny-vm', [], undefined, {
			'name': `bunny-vm-${jsonData.name}`,
			'Labels': {
			},
			'HostConfig': {
				'PortBindings': {
					'3000/tcp': [{
						'HostPort': '0' //Map container to a random unused port.
					}]
				}
			}
		});

		console.log(container);

		return send(res, 201, {
			statusCode: 201,
			data: {
				name: jsonData.name
			}
		});
	}
);
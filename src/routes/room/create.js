import {
	send,
	json
} from 'micro';
import {
	compose
} from 'micro-hoofs';

import Docker from 'dockerode';

import verifyJWTKey from '../../services/verifyJWTKey';

module.exports = compose(
	verifyJWTKey
)(
	async (req, res) => {
		const jsonData = await json(req);

		// TODO: Verify that room name (jsonData.name) does not exist
		// TODO: Verify that user only has one active room
		var docker = new Docker({
			socketPath: '/var/run/docker.sock'
		});

		docker.run('bunny-vm', [], undefined, {
			'name': jsonData.name,
			'Labels': {
			},
			'HostConfig': {
				'PortBindings': {
					'3000/tcp': [{
						'HostPort': '0' //Map container to a random unused port.
					}]
				}
			}
		})
		.then((data, container) => {
			// TODO: in here we need to get the remote port?
			console.log(data, container);
		})
		.catch((err) => {
			if(err){
				return console.error(err);
			}
		});

		send(res, 401, {
			statusCode: 401,
			token: null,
			user: null
		});
	}
);
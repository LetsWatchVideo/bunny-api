const dbInstance = global.dbInstance;
class Room {
	getUserRoom(user_id) {
		return new Promise((resolve, reject) => {
			dbInstance('rooms').where({
				'users.user_id': user_id
			})
			.debug(true)
			.select('rooms.*', 'users.user_id', 'users.username')
            .innerJoin('users as u', 'rooms.user_id', 'u.user_id')
            .first()
			.then(resolve)
			.catch(reject);
		});
	}
	
	getUserRoomCount(user_id) {
		return new Promise((resolve, reject) => {
			dbInstance('rooms').where({
				'users.user_id': user_id
			})
			.debug(true)
			.count('rooms.name')
            .innerJoin('users as u', 'rooms.user_id', 'u.user_id')
            .first()
			.then(resolve)
			.catch(reject);
		});
	}

	isValidRemoteToken(token) {
		return new Promise((resolve, reject) => {
			dbInstance('rooms').where({
				'token': token
			})
			.debug(true)
			.count('rooms.token')
            .innerJoin('users as u', 'rooms.user_id', 'u.user_id')
			.first()
			.map((data) => {
				return data.count >= 1;
			})
			.then(resolve)
			.catch(reject);
		});
	}

	getRoom(name) {
		return new Promise((resolve, reject) => {
			dbInstance('rooms').where({
				'name': name
			})
			.debug(true)
			.select(
				'rooms.name',
				'users.user_id',
				'users.username'
			)
            .innerJoin('users as u', 'rooms.user_id', 'u.user_id')
            .first()
			.then(resolve)
			.catch(reject);
		});
	}
}
export default Room;
import bcrypt from 'bcrypt';
const dbInstance = global.dbInstance;
class User {
	getUserById(id) {
		return new Promise((resolve, reject) => {
			dbInstance('users').where({
				'users.user_id': id
			})
			.debug(true)
			.select(
				'users.user_id',
				'users.username',
				'users.type'
			)
			.first()
			.then(resolve)
			.catch(reject);
		});
	}

	getUserByUsername(username) {
		return new Promise((resolve, reject) => {
			dbInstance('users').where({
				'users.username': username
			})
			.debug(true)
			.select(
				'users.user_id',
				'users.username',
				'users.type'
			)
			.first()
			.then(resolve)
			.catch(reject);
		});
	}

	addUser(username, password) {
		return new Promise(async (resolve, reject) => {
			const salt = await bcrypt.genSalt(10);

			// hash the password along with our new salt
			const hashedPassword = await bcrypt.hash(password, salt);
				
			dbInstance('users')
			.insert({
				'username': username,
				'password': hashedPassword,
			})
			.debug(true)
			.then(async (data) => {
				if(!data) resolve(false);
				resolve(await this.getUserByUsername(username));
			})
			.catch(reject);
		});
	}

	checkUser(username, password) {
		return new Promise((resolve, reject) => {
			dbInstance('users').where({
				'username': username
			})
			.debug(true)
			.select(
				'users.user_id',
				'users.username',
				'users.password',
				'users.type'
			)
			.first()
			.then(async (data) => {
				if(!data) resolve(false);
				const match = await bcrypt.compare(password, data.password);
0
				if(match){
					resolve({
						'user_id': data.user_id,
						'username': data.username,
						'type': data.type
					});
				}else{
					resolve(false);
				}
			})
			.catch(reject);
		});
	}
}
export default User;
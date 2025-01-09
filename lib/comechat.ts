import { CometChat } from '@cometchat-pro/chat';

const appID = '269249e86f032983'; // Replace with your App ID
const region = 'in'; // Replace with your Region
const authKey = 'c3d111b0e78186e682fe30cf0d2cbeee26b526f3'; // Replace with your Auth Key

export const initializeCometChat = async (): Promise<void> => {
	try {
		await CometChat.init(
			appID,
			new CometChat.AppSettingsBuilder().subscribePresenceForAllUsers().setRegion(region).build()
		);
		console.log('CometChat initialized successfully');
	} catch (error) {
		console.error('CometChat initialization failed:', error);
	}
};

export const loginToCometChat = async (uid: string): Promise<CometChat.User> => {
	try {
		const user = await CometChat.login(uid, authKey);
		console.log('Login successful:', user);
		return user;
	} catch (error) {
		console.error('Login failed:', error);
		throw error;
	}
};

export const createOrJoinGroup = async (groupID: string, groupName: string): Promise<void> => {
	const groupType: any = CometChat.GROUP_TYPE.PUBLIC;

	try {
		const group = await CometChat.getGroup(groupID);
		if (group) {
			await CometChat.joinGroup(groupID, groupType);
			console.log('Joined group successfully');
		}
	} catch (error: any) {
		if (error.code === 'ERR_GUID_NOT_FOUND') {
			const newGroup = new CometChat.Group(groupID, groupName, groupType);
			await CometChat.createGroup(newGroup);
			console.log('Group created successfully');
		} else {
			console.error('Error joining or creating group:', error);
		}
	}
};

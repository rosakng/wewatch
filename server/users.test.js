const Users = require('./users');
const Utils = require('./utils');

afterEach(() => {
    jest.clearAllMocks();
});
   
describe('addUser() Tests', () => {
    test('Should create user given appropriate inputs and add into users array.', () => {
        const user = {id: '1', name: 'jeff', room: '1234'};
        expect(Users.addUser({id:'1', name:'jeff', room: '1234'})).toStrictEqual({user:user});
        expect(Users.getUsersInRoom('1234')).toStrictEqual([user]);
    });
    
    test('Should throw an error if username and/or room is not included.', () => {
        const error = {"error": "name, room, and socket id are required."}
        expect(Users.addUser({room: "1234", id: '1', name: null})).toStrictEqual(error);
        expect(Users.addUser({room: null, id: '1', name: null})).toStrictEqual(error);
        expect(Users.addUser({room: null, id: '1', name: "bill"})).toStrictEqual(error);
    });

    test('Should throw an error if missing fields.', () => {
        const error = {"error": "name, room, and socket id are required."}
        expect(Users.addUser({id: "1"})).toStrictEqual(error);
        expect(Users.addUser({name: "1", room: "1234"})).toStrictEqual(error);
    });

    test('Should throws an error if username is taken', () => {
        const error = {"error": "Username is taken."};
        const user = {id:'1', name:'jeff', room: '1234'};
        Users.addUser(user);
        expect(Users.addUser(user)).toStrictEqual(error);
    });
});

describe('addHost() Tests', () => {
    test('Should throw an error if no name or id in parameters.', () => {
        const error = {"error": "Username required."}
        expect(Users.addHost({id:'1', name: ''})).toStrictEqual(error);
        expect(Users.addHost({id:'', name: 'bill'})).toStrictEqual(error);
        expect(Users.addHost({id:'', name: ''})).toStrictEqual(error);
    });
})

describe('removeUser() Tests', () => { 
    test('Should return a list containing the removed user.', () => {
        const usersReturn = {id: '2', name: 'Derek', room: 'ABCD'}
        Users.addUser(usersReturn);
        expect(Users.removeUser('2')).toStrictEqual(usersReturn);
        expect(Users.getUsersInRoom('ABCD')).toStrictEqual([]);
    });

    test('Should return empty list if user does not exist', () => {
        const usersReturn = {id: '2', name: 'Derek', room: 'ABCD'}
        Users.addUser(usersReturn);
        expect(Users.removeUser('3')).toStrictEqual([]);
        expect(Users.getUsersInRoom('ABCD')).toStrictEqual([usersReturn]);
    });
})

describe('getUsersInRoom() Tests', () => {
    test('Should return empty list if no users in room.', () => {
        const usersReturn = {id: '2', name: 'Derek', room: 'ABCD'};
        Users.addUser(usersReturn);
        expect(Users.getUsersInRoom('room1')).toStrictEqual([]);
    });

    test('Should return all users in room.', () => {
        const user1 = {id: '1', name: 'Bill', room: 'ABCD'};
        const user2 = {id: '2', name: 'Derek', room: 'ABCD'}
        Users.addUser(user1);
        Users.addUser(user2);
        expect(Users.getUsersInRoom('ABCD')).toContainEqual(user1);
        expect(Users.getUsersInRoom('ABCD')).toContainEqual(user2);
    });
})

describe('getHost() Tests', () => {
    test('Should return null if no room ID is empty string.', () => {
        Users.addHost({id:'1', name: 'Bill'});
        expect(Users.getHost('')).toBeUndefined();
    });
})
const Users = require('./users');

afterEach(() => {
    jest.clearAllMocks();
  });
   
describe('addUser tests', () => {
    test('Creates user given appropriate inputs', () => {
        const user = {user:{id: '1', name: 'jeff', room: '1234'}};
        expect(Users.addUser({id:'1', name:'jeff', room: '1234'})).toStrictEqual(user);
    })
    
    test('Throws an error if username and/or room is not included', () => {
        const error = {"error": "Username and room are required."}
        expect(Users.addUser({room: "1234"})).toStrictEqual(error);
    })

    test('Throws an error if inproper entry', () => {
        const error = {"error": "Username and room are required."}
        expect(Users.addUser("pain")).toStrictEqual(error);
    })

    describe('username is taken', () =>  {
        beforeEach(() => {
            existingUser=1;
        })
        test('Throws an error if username is taken', () => {
            const error = {"error": "Username is taken."}
            expect(Users.addUser({id:'1', name:'jeff', room: '1234'})).toStrictEqual(error);
        })   
    })
})

describe('addHost', () => {
    describe('addHost with a generated room ID', () => {
        test('Creates host user given appropriate inputs', () => {
            const user = {user:{id: '1', name: 'jeffHost', room: 'ABCD'}};
            expect(Users.addHost({id:'1', name:'jeffHost'})).toStrictEqual(user);
        })
    }) 
    
    test('Throws an error if no hostName in parameters', () => {
        const error = {"error": "Username required."}
        expect(Users.addHost({id:'1', name:''})).toStrictEqual(error);
    })

    test('Throws an error if no id in parameters', () => {
        const error = {"error": "Username required."}
        expect(Users.addHost({id:'1'})).toStrictEqual(error);
    })
})

//TODO: COMPLETE TESTS
describe('removeUser', () => {
    beforeEach(() => {
        users = [{id: '1', name: 'Jeff', room: 'ABCD'}, {id: '2', name: 'Derek', room: 'ABCD'}]
    })

    
    test('Returns a spliced list with the desired user removed', () => {
        console.log(users);
       const usersReturn = [{id: '2', name: 'Derek', room: 'ABCD'}]
        expect(Users.removeUser('1')).toBe(usersReturn);
    })
})

//TODO: COMPLETE TESTS
describe('getUsersInRoom', () => {
    beforeEach(() => {
        room = 'ABCD';
      
    })
    
})
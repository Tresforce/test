import faker from 'faker';
import User from '../../database/entities/User';

const makeUsers = (numUsers: number): User[] => {
  const users = new Array(numUsers).fill(null) as User[];
  return users.map(() => {
    const person = new User();
    person.id = faker.random.uuid();
    person.firstName = faker.name.firstName();
    person.lastName = faker.name.lastName();
    person.email = faker.internet.email();
    person.phoneNumber = faker.phone.phoneNumber('(###)-###-####');
    return person;
  });
};

export default makeUsers;

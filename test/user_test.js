require('dotenv').config();
const { assert, requester } = require('./set_up');
const { users } = require('./fake_data');
// const sinon = require('sinon');

describe('order', () => {
  it('sign up', async () => {
    const user = {
      provider: 'native',
      name: 'abc',
      email: 'abc@gmail.com',
      password: 'password',
    };

    const res = await requester
      .post('/api/1.0/user/signup')
      .send(user);

    const { data } = res.body;

    const userExpect = {
      id: data.user.id, // need id from returned data
      provider: 'native',
      name: user.name,
      email: user.email,
    };

    assert.deepEqual(data.user, userExpect);
  });
  it('native sign in with correct password', async () => {
    const user1 = users[0];
    const user = {
      provider: user1.provider,
      email: user1.email,
      password: user1.password,
    };

    const res = await requester
      .post('/api/1.0/user/signin')
      .send(user);

    const { data } = res.body;
    const userExpect = {
      id: data.user.id, // need id from returned data
      provider: user1.provider,
      name: user1.name,
      email: user1.email,
      picture: null,
    };

    assert.deepEqual(data.user, userExpect);
  });
});

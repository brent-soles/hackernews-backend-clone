const jwt = require('jsonwebtoken');
const APP_SECRET = 'app_secret'

const getUserId = (context) => {
  const Auth = context.request.get('Authorization');
  if(Auth){
    const token = Auth.replace('Bearer ', '');
    const { userId } = jwt.verify(token, APP_SECRET);
    return userId;
  }

  throw Error('Not Authenticated');
};

module.exports = {
  getUserId,
  APP_SECRET
}
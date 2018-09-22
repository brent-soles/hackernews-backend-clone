const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { APP_SECRET, getUserId } = require('../utils')

// create a post
const post = (root, args, context, info) => {
  const userId = getUserId(context);
  return context.db.mutation.createLink({
    data: {
      url: args.url,
      desc: args.desc,
      postedBy: {
        connect: {
          id: userId
        }
      }
    }
  }, info);
}


// To update a link
const updatePost = async (parent, args, context, info) => {
  return await context.db.mutation.updateLink({
    data: {
      url: args.url,
      desc: arg.desc
    },
    where: {id: args.id},
  }, info);
}

// To 
const deletePost = async (root, args, context, info) => {
  // Deletes a link
  return context.db.mutation.deleteLink({
    where: {
      id: args.id
    }
  }, info);
}


// sign up 
const signup = async (parent, args, context, info) => {
  // Hashes password
  const password = await bcrypt.hash(args.password, 10); //hashes password

  // Creates the user
  const user = await context.db.mutation.createUser({
    data: {
      ...args,
      password
    }
  }, `{ id }`); 
  // Syntax context.db.operation_type.function( {data: ...}, selector (if need be, ref. deleteLink), `{ params to return }` );

  // Creates token (use to auth requests??)
  const token = jwt.sign({userId: user.id}, APP_SECRET);

  return {
    token,
    user
  }
};

//login
const login = async (parent, args, context, info) => {
  // gets user from prisam binding
  const user = await context.db.query.user({ where: { email: args.email } }, ` { id password } `);
  if (!user) {
    throw new Error('Invalid username or password');
  }

  // grabs passwd & validates
  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error('Invalid username or password');
  }
  const token = jwt.sign({ userId: user.id }, APP_SECRET);
  return {
    token,
    user,
  }
}

const vote = async (parent, args, context, info) => {
  //Base case: check permissions
  const userId = getUserId(context);

  const linkExists = await context.db.exists.Vote(
    {
      user: { id: userId },
      link: { id: args.linkId }
    });

    if(linkExists){
      throw new Error("You have already voted for this link");
    }

    return context.db.mutation.createVote(
      {
        data: {
          user: { connect: { id: userId } },
          link: { connect: { id: args.linkId } },
        },
      },
      info,
    );
}

module.exports = {
  post,
  updatePost,
  deletePost,
  login,
  signup,
  vote
}
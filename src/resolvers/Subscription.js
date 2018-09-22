const newLinkSub = (parent, args, context, info) => {
  return context.db.subscription.link(
    {
      where: {
        mutation_in: ['CREATED']
      }
    }, info );
};

const newLink = {
 subscribe: newLinkSub
};

const newVoteSub = (parent, args, context, info) => {
  return context.db.subscription.vote(
    {
      where: {
        mutation_in: ['CREATED']
      }
    }, info);
};

const newVote = {
  subscribe: newVoteSub
}

module.exports = {
  newLink,
  newVote
}
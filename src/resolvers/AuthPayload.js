
// Why passing root and not parent? Or are they interchangeable
const user = async (root, args, context, info) => {
  return context.db.query.user({
    where: {
      id: root.user.id
    }
  }, info)
};

module.exports = {
  user
}
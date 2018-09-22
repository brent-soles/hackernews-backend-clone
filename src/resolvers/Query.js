const feed = async (root, args, context, info) => {
  // Check if filter is present,
  // Then filter based on that
  const where = args.filter ? 
  //If there is a filter
  {
    OR: [
      {url_contains: args.filter},
      {desc_contains: args.filter}
    ]
  } : //else none
  {};

  // Gets queried links, then
  // returns the id for each of those links
  // is of a Array type
  const queriedLinks = await context.db.query.links(
    {
      where,
      skip: args.skip,
      first: args.first,
      orderBy: args.orderBy
    }, `{ id }`);

  //Defines count, which is modified
  // in the following linksConnection db call
  // specifies a query to be fun on the links connection??
  const countSelectionSet = `
  {
    aggregate {
      count
    }
  }`

  // Queries for amount of links stored in db
  const linksConnection = await context.db.query.linksConnection({}, countSelectionSet);

  // Note: Filter is not case sensitive
  return {
    count: linksConnection.aggregate.count,
    linksIds: queriedLinks.map(link => link.id) // returns an array of link id's
  }
};

const users = (root, args, context, info) => {
  return context.db.query.users({}, info);
};

module.exports = {
  feed,
  users
}

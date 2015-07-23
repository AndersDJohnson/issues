var Faker = require('Faker');
var _ = require('lodash');

var LazyObject = require('./lazy-object');

var nodeCount = 100;

module.exports = function() {
  var data = new LazyObject();

  data.set('users', users);
  data.set('nodes', nodes);
  makeLinks(data.get('nodes'));

  return data.toObject();
};

var users = function (ctx) {
  return _.times(100, function (i) {
    return {
      id: i,
      name: Faker.Name.findName(),
      username: Faker.Internet.userName()
    };
  });
};

var linkTypes = ['depend', 'relate'];
var nodeTypes = ['issue', 'comment'];

var nodes = function (ctx) {
  var users = ctx.get('users');

  var count = nodeCount;
  return _.times(count, function (i) {
    var id = i;
    var user = _.sample(users);
    return {
      id: id,
      type: _.sample(nodeTypes),
      title: Faker.Lorem.sentence(),
      body: Faker.Lorem.paragraphs(),
      user: user.id,
      url: '/nodes/' + id,
      completion: Math.floor(Math.random() * 100)/100 
    };
  });
};

var makeLinks = function (nodes) {

  var nodeCount = nodes.length;

  _.each(nodes, function (node) {

    var linkCount = 10;
    var links = _.times(_.random(linkCount), function () {
      var otherNodeId = _.random(nodeCount - 1);
      var otherNode = nodes[otherNodeId];
      return {
        other: {
          id: otherNodeId,
          type: otherNode.type,
          title: otherNode.title,
          url: '/nodes/' + otherNodeId
        },
        out: true,
        type: _.sample(linkTypes)
      }
    });

    node.links = links;
  });

  _.each(nodes, function (node) {
    var links = _.filter(node.links, function (link) { return link.out; });
    _.each(links, function (link) {
      var linkedNode = nodes[link.other.id];
      linkedNode.links = linkedNode.links || [];
      linkedNode.links.push({
        other: {
          id: node.id,
          type: node.type,
          title: node.title,
          url: '/nodes/' + node.id
        },
        out: false,
        type: link.type
      })
    });
  });
};


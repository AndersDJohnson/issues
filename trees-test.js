var trees = require('./trees');
var _ = require('lodash');

var nodes = {
  0: {
    id: 0,
    links: [
      {
        id: 1,
        other: {
          id: 1
        }
      },
      {
        other: {
          id: 2
        }
      }
    ]
  },
  1: {
    id: 1,
    completion: 0.75
  },
  2: {
    id: 2,
    links: [
      {
        other: {
          id: 3
        }
      },
      {
        other: {
          id: 4
        }
      },
      {
        other: {
          id: 5
        }
      }
    ]
  },
  3: {
    id: 3,
    completion: 0.25,
  },
  4: {
    id: 4,
    completion: 0.75,
    links: [
      {
        other: {
          id: 4
        }
      }
    ]
  },
  5: {
    id: 5,
    links: [
      {
        other: {
          id: 4
        }
      }
    ]
  }
};


var getNode = function (id, cb) {
  cb(null, nodes[id]);
};

trees.tree(nodes[0].links, getNode, function (err, tree) {
  console.log(trees.draw(tree));
}, {
  maxDepth: 2
});

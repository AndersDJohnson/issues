/*

    a
  b   c
e  f g  h

a = (B + C) / 2
B = (e + f) / 2
C = (g + h) / 2

*/


var _ = require('lodash');
var async = require('async');

var trees = {};

var draw = trees.draw = function (tree, indent) {
  var indent = indent || 0;
  var indentStr = _.repeat(' ', indent);
  var str = '';
  _.each(tree, function (node) {
    str += indentStr + node.node.id + '\n';
    if (node.tree) {
      str += draw(node.tree, indent + 1);
    }
  });
  return str;
};

var tree = trees.tree = function (links, getNode, cb, options, state) {

  options = options || {};
  options.maxDepth = options.maxDepth || Infinity;

  state = state || {};
  state.visited = state.visited || {};
  state.depth = state.depth || 0;

  var depth = state.depth;

  var length = links.length;

  if (! length) {
    cb(null);
    return;
  }

  // if (state.depth > options.maxDepth) {
  //   console.log('stopping tree walk at depth ' + depth);
  //   cb(null);
  //   return;
  // }

  state.depth += 1;

  var len = links.length;

  async.reduce(
    links,
    {},
    function (memo, link, _cb) {

      if (state.visited[link.other.id]) {
        console.log('stopping tree recursion at depth ' + depth + ' on link to node ' + link.other.id);
        _cb(null, memo);
        return;
      }

      state.visited[link.other.id] = true;

      getNode(link.other.id, function (err, node) {
        if (node.links && node.links.length) {
          tree(node.links, getNode, function (err, tree) {
            memo[node.id] = {
              node: node,
              tree: tree
            };
            _cb(null, memo);
          }, options, state);
        }
        else {
          memo[node.id] = {
            node: node
          };
          _cb(null, memo);
        }
      });
    },
    function (err, tree) {
      cb(err, tree);
    }
  );

  // async.reduce(
  //   links,
  //   {
  //     completion: 0
  //   },
  //   function (memo, link, _cb) {
  //     console.log('reduce link', link.other.id);
  //     getNode(link.other.id, function (err, node) {
  //       console.log('d', depth, 'reduce node', node.id, node.completion);
  //       // if (maxDepth > depth) {
  //       //   _cb(null, memo);
  //       // }
  //       // else
  //       if (node.links && node.links.length) {
  //         // var len = node.links.length;
  //         reduce(node.links, function (err, linkSubMemo) {
  //           memo.completion += linkSubMemo.completion;
  //           _cb(null, memo);
  //         }, depth + 1, maxDepth);
  //       }
  //       else {
  //         memo.completion += node.completion || 0;
  //         _cb(null, memo);
  //       }
  //     });
  //   },
  //   function (err, result) {
  //     result.completion /= len;
  //     console.log('d', depth, 'res', result);
  //     cb(err, result);
  //   }
  // );

  // async.reduce(
  //   links,
  //   {
  //     completion: 0
  //   },
  //   function (memo, node, _cb) {
  //     // console.log('node', node);
  //     if (node.links && node.links.length) {
  //       reduce(node.links, function (err, result) {
  //         memo.completion += result.completion / length;
  //         _cb(null, memo);
  //       }, depth + 1, maxDepth);
  //       return;
  //     }
  //     else {
  //       if (length) {
  //         memo.completion += node.completion / length;
  //       }
  //       _cb(null, memo);
  //       return;
  //     }
  //   },
  //   function (err , result) {
  //     console.log('res', result);
  //     cb(err, result);
  //   }
  // );

  // async.reduce(links, {
  //   completion: 0
  // }, function (memo, link, cb) {
  //   request(apiPath('/nodes/' + link.other.id), function (err, resp, body) {
  //     var node = JSON.parse(body);
  //     memo.nodes = memo.nodes || [];
  //     memo.nodes.push(node.id + '(' + depth + ')');
  //     if (node.links && node.links.length) {
  //       reduce(node.links, function (err, result) {
  //         memo.completion += result.completion / length;
  //         cb(err, memo);
  //       }, depth + 1, maxDepth);
  //       return;
  //     }
  //     else {
  //       memo.completion = node.completion || 0;
  //       cb(null, memo);
  //       return;
  //     }
  //   })
  // }, function (err, result) {
  //   cb(err, result);
  // });
};

// var reduce = function (node, func, acc, depth) {
//   depth = depth || 5;
//   return _.reduce(node.links, function (link) {
//     var otherNode = nodes[link.other.id];
//     func(acc, node, depth, function () {

//     });
//     return reduce(nodes, otherNode, func, acc, depth);
//   });
// };

module.exports = trees;

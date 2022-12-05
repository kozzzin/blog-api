const Category = require('../models/category');
const Post = require('../models/post');
const async = require('async');

exports.getCategories = (req,res) => {
  async.waterfall(
    [
      function(cb) {
        Category
          .find()
          .then(categories => cb(null,categories));
      },
      function(categories, cb) {
        Post
          .find()
          .populate('category')
          .then(posts => {
            const catsWithPostCount = categories.map(
              (cat) => {
                return {
                  ...cat._doc,
                  postsCount: posts.filter(
                    post => {
                      if (post.category === undefined) return false;
                      console.log(post.category._id);
                      return post.category._id.toString() === cat._doc._id.toString();
                    }
                  ).length
                }
              }
            );
            cb(null,catsWithPostCount);
          })
      }
    ],
    function(err, result) {
      console.log(result);
      return res.json(result);
    }
  )
    // Category
    //   .find()
    //   .then(response => response.json())
    //   .then(categories => {
    //     Post
    //       .find()
    //       .populate('category')
    //       .then(response => response.json())
    //       .then(posts => {
    //         console.log(res);
    //         return res.json({"huj":"duj"});
    //         const catsWithPostCount = categories.map(
    //           (cat) => {
    //             return {
    //               ...cat,
    //               postsCount: posts.filter(
    //                 post => post.category._id === cat._id
    //               ).length
    //             }
    //           }
    //         );
    //         console.log(catsWithPostCount);
    //         return res.json(catsWithPostCount);
    //       })
    //       .catch(err => res.json(err));
    //   })
    //   .catch(err => res.json(err));
  }


exports.getCategory = (req,res) => {
    Post
      .find(
        {
          'category': req.params.id
        }
      )
      .populate("category")
      .then(results => {
        return res.json({
          category: results[0].category.name,
          posts: results
        });
      })
      .catch(err => res.json(err));
  }
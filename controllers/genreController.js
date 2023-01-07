const Genre = require("../models/genre");

const Book = require("../models/book");
const async = require("async");

const { body, validationResult } =require("express-validator"); // es el equivalente a from "" import ""
const genre = require("../models/genre");
// Display list of all Genre.
exports.genre_list = function (req, res, nexts) {
  Genre.find()
    .sort([["name", "ascending"]]) 
    .exec(function (err, list_genre) {
      if (err) {
        return next(err);
      }
      //Successful, so render
      res.render("genre_list", {
        title: "Genre List",
        genre_list: list_genre,
      });
    });
};

// Display detail page for a specific Genre.
exports.genre_detail = (req, res, next) => {
  async.parallel(
    {
      genre(callback) {
        Genre.findById(req.params.id).exec(callback);
      },

      genre_books(callback) {
        Book.find({ genre: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.genre == null) {
        // No results.
        const err = new Error("Genre not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render
      res.render("genre_detail", {
        title: "Genre Detail",
        genre: results.genre,
        genre_books: results.genre_books,
      });
    }
  );
};


// Display Genre create form on GET.
exports.genre_create_get = (req, res, next) => {
  res.render("genre_form", { title: "Create Genre" });
};


// Handle Genre create on POST.
exports.genre_create_post = [
  // Validate and sanitize the name field.
  body("name", "Genre name required").trim().isLength({ min: 1 }).escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    const genre = new Genre({ name: req.body.name });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("genre_form", {
        title: "Create Genre",
        genre, // Esto lo pasa para poner en el formulario todos los datos como estaban y no eliminarlos
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Genre with same name already exists.
      Genre.findOne({ name: req.body.name }).exec((err, found_genre) => {
        if (err) {
          return next(err);
        }

        if (found_genre) {
          // Genre exists, redirect to its detail page.
          res.redirect(found_genre.url);
        } else {
          genre.save((err) => {
            if (err) {
              return next(err);
            }
            // Genre saved. Redirect to genre detail page.
            res.redirect(genre.url);
          });
        }
      });
    }
  },
];
;

// Display Genre delete form on GET.
exports.genre_delete_get = (req, res, next ) => {
  async.parallel(
    {
      genre(callback){
        Genre.findById(req.params.id).exec(callback);
      },
      genre_books(callback) {
        Book.find({ genre: req.params.id }).exec(callback);
      }
    },
  (err, results) => {
    if (err) {
      return next(err);
    }
    if (results.genre == null){
      // No results.
      res.redirect("/catalog/genres")
    }
    res.render("genre_delete",{
      title : "Delete Genre",
      genre : results.genre,
      genre_books : results.genre_books,
    });
  });
};

// Handle Genre delete on POST.
exports.genre_delete_post = (req, res) => {
  async.parallel(
    {
      genre(callback){
        Genre.findById(req.params.genreid).exec(callback);
      },
      genre_books(callback) {
        Book.find({ genre: req.params.genreid }).exec(callback);
      }
    },
  (err, results) => {
    if (err) {
      return next(err);
    }
    if (results.genre_books.isLength > 0 ){
      res.render("genre_delete", {
        title:"Delete genre",
        genre: results.genre,
        genre_books : results.genre_books,
      });
      return;
    }

    Genre.findByIdAndRemove(req.body.genreid, (err) => {
      if (err){
        return next(err);
      }

      res.redirect("/catalog/genres")
    })
  });
};

// Display Genre update form on GET.
exports.genre_update_get = (req, res) => {
  Genre.findById(req.params.id)
  .exec((err, genre) => {
    if (err) {
      return next(err);
    }
    if (genre == null){
      const err = new Error("Genre not gound");
      err.status = 404;
      return next(err);
    }
    res.render("genre_form", {
      title: "Update Genre",
      genre: genre,
    })
  }
  )
};

// Handle Genre update on POST.
exports.genre_update_post = [
  body("name", "Genre name required").trim().isLength({ min: 1 }).escape(),
  (req, res, next) => {
    errors = validationResult(req);
    
    const genre = new Genre({
       name: req.body.name,
       _id: req.params.id,
    });

    if(!errors.isEmpty()){
        res.render("genre_form", {
          title: "Update Genre",
          genre: genre,
          errors: errors.array(),
        })
        return;
    }
    Genre.findByIdAndUpdate(req.params.id, genre, {}, (err, thegenre) => {
      if (err) {
        return next(err);
      }
      res.redirect(thegenre.url)
    })

  }
];



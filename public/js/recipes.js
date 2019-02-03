$(document).ready(function() {
  // recipeContainer holds all of our recipes
  var recipeContainer = $(".recipe-container");
  var recipeCategorySelect = $("#category");
  // Click events for the edit and delete buttons
  $(document).on("click", "button.delete", handlePostDelete);
  $(document).on("click", "button.edit", handlePostEdit);
  recipeCategorySelect.on("change", handleCategoryChange);
  var recipes;

  // This function grabs recipes from the database and updates the view
  function getRecipes(category) {
    var categoryString = category || "";
    if (categoryString) {
      categoryString = "/category/" + categoryString;
    }
    $.get("/api/recipes" + categoryString, function(data) {
      console.log("recipes", data);
      recipes = data; 
      if (!recipes || !recipes.length) {
        displayEmpty();
      }
      else {
        initializeRows();
      }
    });
  }

  // This function does an API call to delete recipes
  function deletePost(id) {
    $.ajax({
      method: "DELETE",
      url: "/api/recipes/" + id
    })
      .then(function() {
        getRecipes(recipeCategorySelect.val());
      });
  }

  // Getting the initial list of recipes
  getRecipes();
  // InitializeRows handles appending all of our constructed post HTML inside
  // recipeContainer
  function initializeRows() {
    recipeContainer.empty();
    var recipesToAdd = [];
    for (var i = 0; i < recipes.length; i++) {
      recipesToAdd.push(createNewRow(recipes[i]));
    }
    recipeContainer.append(recipesToAdd);
  }

  // This function constructs a post's HTML
  function createNewRow(post) {
    var newPostCard = $("<div>");
    newPostCard.addClass("card");
    var newPostCardHeading = $("<div>");
    newPostCardHeading.addClass("card-header");
    var deleteBtn = $("<button>");
    deleteBtn.text("x");
    deleteBtn.addClass("delete btn btn-danger");
    var editBtn = $("<button>");
    editBtn.text("EDIT");
    editBtn.addClass("edit btn btn-default");
    var newPostTitle = $("<h2>");
    var newPostDate = $("<small>");
    var newPostCategory = $("<h5>");
    newPostCategory.text(post.category);
    newPostCategory.css({
      float: "right",
      "font-weight": "700",
      "margin-top":
      "-15px"
    });
    var newPostCardBody = $("<div>");
    newPostCardBody.addClass("card-body");
    var newPostBody = $("<p>");
    newPostTitle.text(post.title + " ");
    newPostBody.text(post.body);
    var formattedDate = new Date(post.createdAt);
    formattedDate = moment(formattedDate).format("MMMM Do YYYY, h:mm:ss a");
    newPostDate.text(formattedDate);
    newPostTitle.append(newPostDate);
    newPostCardHeading.append(deleteBtn);
    newPostCardHeading.append(editBtn);
    newPostCardHeading.append(newPostTitle);
    newPostCardHeading.append(newPostCategory);
    newPostCardBody.append(newPostBody);
    newPostCard.append(newPostCardHeading);
    newPostCard.append(newPostCardBody);
    newPostCard.data("post", post);
    return newPostCard;
  }

  // This function figures out which post we want to delete and then calls
  // deletePost
  function handlePostDelete() {
    var currentPost = $(this)
      .parent()
      .parent()
      .data("post");
    deletePost(currentPost.id);
  }

  // This function figures out which post we want to edit and takes it to the
  // Appropriate url
  function handlePostEdit() {
    var currentPost = $(this)
      .parent()
      .parent()
      .data("post");
    window.location.href = "/recipeblog?post_id=" + currentPost.id;
  }

  // This function displays a message when there are no recipes
  function displayEmpty() {
    recipeContainer.empty();
    var messageH2 = $("<h2>");
    messageH2.css({ "text-align": "center", "margin-top": "50px" });
    messageH2.html("No recipes yet for this category, navigate <a href='/recipeblog'>here</a> in order to create a new post.");
    recipeContainer.append(messageH2);
  }

  // This function handles reloading new recipes when the category changes
  function handleCategoryChange() {
    var newPostCategory = $(this).val();
    getRecipes(newPostCategory);
  }

});

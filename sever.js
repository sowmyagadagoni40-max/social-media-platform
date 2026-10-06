const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const PORT = 3000;
const MONGODB_URI = process.env.MONGODB_URI;

if (MONGODB_URI) {
    mongoose.connect(MONGODB_URI)
        .then(() => console.log("MongoDB connected"))
        .catch(error => console.error("MongoDB connection failed:", error.message));
} else {
    console.warn("MONGODB_URI is not set; MongoDB connection skipped.");
}

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

let users = [
    {
        id: 1,
        name: "Sowmya",
        username: "sowmya",
        bio: "B.Tech CSE Student",
        followers: [],
        following: []
    }
];

let posts = [
    {
        id: 1,
        userId: 1,
        content: "Hello everyone! Welcome to my social media platform 🚀",
        likes: [],
        comments: []
    }
];


// Get all posts
app.get("/api/posts", (req, res) => {
    res.json(posts);
});


// Get all users
app.get("/api/users", (req, res) => {
    res.json(users);
});


// Create post
app.post("/api/posts", (req, res) => {

    const { userId, content } = req.body;

    if (!content) {
        return res.status(400).json({
            message: "Post content is required"
        });
    }

    const newPost = {
        id: posts.length + 1,
        userId: userId || 1,
        content: content,
        likes: [],
        comments: []
    };

    posts.unshift(newPost);

    res.json(newPost);
});


// Like / Unlike post
app.post("/api/posts/:id/like", (req, res) => {

    const post = posts.find(
        p => p.id == req.params.id
    );

    if (!post) {
        return res.status(404).json({
            message: "Post not found"
        });
    }

    const userId = req.body.userId || 1;

    if (post.likes.includes(userId)) {
        post.likes = post.likes.filter(id => id !== userId);
    } else {
        post.likes.push(userId);
    }

    res.json(post);
});


// Add comment
app.post("/api/posts/:id/comment", (req, res) => {

    const post = posts.find(
        p => p.id == req.params.id
    );

    if (!post) {
        return res.status(404).json({
            message: "Post not found"
        });
    }

    const comment = {
        id: Date.now(),
        userId: req.body.userId || 1,
        text: req.body.text
    };

    post.comments.push(comment);

    res.json(comment);
});


// Follow / Unfollow
app.post("/api/users/:id/follow", (req, res) => {

    const user = users.find(
        u => u.id == req.params.id
    );

    const currentUser = users.find(
        u => u.id == (req.body.userId || 1)
    );

    if (!user || !currentUser) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    if (currentUser.following.includes(user.id)) {

        currentUser.following =
            currentUser.following.filter(
                id => id !== user.id
            );

        user.followers =
            user.followers.filter(
                id => id !== currentUser.id
            );

    } else {

        currentUser.following.push(user.id);
        user.followers.push(currentUser.id);
    }

    res.json(user);
});


const server = app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

server.on("error", error => {
    console.error(`Could not start server on port ${PORT}: ${error.message}`);
    process.exitCode = 1;
});
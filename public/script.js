// Load posts when page opens

document.addEventListener("DOMContentLoaded", () => {

    if (document.getElementById("posts")) {

        loadPosts();

    }

    if (document.getElementById("followers")) {

        loadProfile();

    }

});


// Load Posts

async function loadPosts() {

    const response =
        await fetch("/api/posts");

    const posts =
        await response.json();

    const container =
        document.getElementById("posts");

    container.innerHTML = "";


    posts.forEach(post => {

        const comments =
            post.comments.map(comment => {

                return `
                    <div class="comment">
                        👤 User ${comment.userId}:
                        ${comment.text}
                    </div>
                `;

            }).join("");


        const postHTML = `

            <div class="post">

                <div class="post-header">

                    <div class="avatar">
                        👤
                    </div>

                    <strong>
                        Sowmya
                    </strong>

                </div>


                <div class="post-content">

                    ${post.content}

                </div>


                <p>
                    ❤️ ${post.likes.length} Likes
                </p>


                <div class="actions">

                    <button
                        onclick="likePost(${post.id})">

                        ❤️ Like

                    </button>

                </div>


                <div class="comment-box">

                    <input
                        id="comment-${post.id}"
                        placeholder="Write a comment..."
                    >

                    <button
                        onclick="addComment(${post.id})">

                        Comment

                    </button>

                </div>


                <div>

                    ${comments}

                </div>

            </div>

        `;

        container.innerHTML += postHTML;

    });

}


// Create Post

async function createPost() {

    const content =
        document.getElementById("postContent").value;

    if (!content.trim()) {

        alert("Please write something");

        return;

    }


    await fetch("/api/posts", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            userId: 1,

            content: content

        })

    });


    document.getElementById("postContent").value = "";

    loadPosts();

}


// Like Post

async function likePost(postId) {

    await fetch(`/api/posts/${postId}/like`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            userId: 1

        })

    });

    loadPosts();

}


// Add Comment

async function addComment(postId) {

    const input =
        document.getElementById(`comment-${postId}`);

    const text = input.value;


    if (!text.trim()) {

        alert("Write a comment");

        return;

    }


    await fetch(`/api/posts/${postId}/comment`, {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            userId: 1,

            text: text

        })

    });


    input.value = "";

    loadPosts();

}


// Load Profile

async function loadProfile() {

    const response =
        await fetch("/api/users");

    const users =
        await response.json();

    const user = users[0];

    document.getElementById("followers")
        .innerText = user.followers.length;

}


// Follow User

async function followUser() {

    const response =
        await fetch("/api/users/1/follow", {

            method: "POST",

            headers: {

                "Content-Type":
                    "application/json"

            },

            body: JSON.stringify({

                userId: 1

            })

        });

    const user =
        await response.json();

    document.getElementById("followers")
        .innerText = user.followers.length;

}
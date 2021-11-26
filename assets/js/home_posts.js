{   
    let base64String = "";
    let Media = "false";
  
    function imageUploaded() {
        Media = "true";
        var file = document.querySelector(
            'input[type=file]')['files'][0];
    
        var reader = new FileReader();
        console.log("next");
        
        reader.onload = function () {
            base64String = reader.result.replace("data:", "")
                .replace(/^.+,/, "");
    
            imageBase64Stringsep = base64String;
    
            // alert(imageBase64Stringsep);
            // console.log(base64String);
        }
        reader.readAsDataURL(file);
    }

    //method to submit the form data for new post using ajax
    let createPost = function(){
        let newPostForm = $('#new-post-form');
        newPostForm.submit(function(e){
            e.preventDefault();

            newPostForm.append('file', $('#media')[0].files[0]);
            const dataForm = {
                user : $('#id').val(),
                content : $('#content').val(),
                media : base64String,
                ismedia: Media
            };

            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: dataForm,
                success: function(data){
                    let newPost = newPostDom(data.data.post);
                    $('#posts-list-container').prepend(newPost);
                    deletePost($('.delete-post-button', newPost));
                    if(data.data.post.media){
                        $('post-content').append(newPostDomMedia);
                    }

                    new Noty({
                        theme: 'relax',
                        text: "Post published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                    
                    // call the create comment class
                    new PostComments(data.data.post._id); 

                    //enable functionality of toggle like button on the new post
                    new ToggleLike($('.toggle-like-button', newPost));

                    
                    
                }, error: function(error){
                    console.log(error.responseText);
                }
            })
        })
    }; 

    //method to create a post in DOM
    let newPostDom = function(post){
        return $(`
                    <li id="post-${post._id}" style="list-style:none;">
                    <div id="card" class="container">
                        <div class="post-body"> 
                            <header>
                                <div class="name-pic">
                                    
                                    <small class="username">
                                        ${post.user.name}
                                    </small>
                                </div>

                                <div class="delete-btn">
                                    <a class="delete-post-button btn btn-danger btn-sm" role="button" href="/posts/destroy/${post._id}">Delete</a>
                                </div>    
                            </header>
                            <hr>

                            <div class="post-content">
                                ${ post.content }
                            </div>

                            <hr>
                            
                            <div class="like-comment">
                                <div class="post-likes">
                                    <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${post._id}&type=Post">
                                        0 <b>Likes</b>
                                    </a>
                                </div>
                                <div>
                                    <a href="#commentsModal" data-bs-toggle="modal" data-bs-target="#commentsModal">
                                        <i class="far fa-comment-dots fa-lg"></i>
                                        <b>Comments</b>
                                    </a>
                                    
                                </div>
                            </div>

                            <div class="post-comment-input">
                                
                                <form id="post-${post._id}-comments-form" action="/comments/create" method="POST">
                                    <!-- <input type="text" name="content" placeholder="Add a comment..." required> -->
                                    <div class="d-flex flex-row justify-content-center">
                                        <div class="form__group field">
                                            <input type="input" class="form__field" placeholder="Add a comment..." name="content" id='comment' required />
                                            <label for="comment" class="form__label">Add a comment...</label>
                                        </div>
                                        <input type="hidden" name="post" value="${post._id}">
                                        <div class="add-btn">
                                            <button type="submit" class="publish-btn btn-grad">
                                                <i class="fas fa-paper-plane"></i>
                                            </button>
                                        </div>
                                    </div>
                                </form>    
                                
                            </div>
                        </div>
                    </div>
                    
                    
                    <!-- Modal -->
                    <div class="modal fade" id="commentsModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div class="modal-content">
                        <div class="modal-header">
                        <h5 class="modal-title" id="commentsModalLabel">Comments</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body"> 
                            <div class="comment-form">
                                <form id="post-${post._id}-comments-form" action="/comments/create" method="POST">
                                    <!-- <input type="text" name="content" placeholder="Add a comment..." required> -->
                                    <div class="d-flex flex-row ">
                                        <div class="comment-form-input">
                                            <input type="input" placeholder="Add a comment..." name="content" id='comment' required />
                                        </div>
                                        <input type="hidden" name="post" value="${post._id}">
                                        <div class="d-grid gap-2 comment-form-btn">
                                            <button type="submit" class="publish-btn btn-grad">
                                                <i class="fas fa-paper-plane"></i>
                                            </button>
                                        </div>
                                    </div>
                                </form> 
                            </div>
                            <div class="post-comments-list">
                                <ul id="post-comments-${post._id}">
                                
                                </ul>
                            </div>
                        </div>
                        <div class="modal-footer">
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
                        <!-- <button type="button" class="btn btn-primary">Save changes</button> -->
                        </div>
                    </div>
                    </div>
                </div>
                </li>`)
    }

    //media
    let newPostDomMedia = function(post){
        return $(`
            <div class="post-media">
                <img src="data:image/png;base64,${post.media}" alt="${post.user.name}">
            </div>
        `)
    }

    //method to delete a post from DOM
    let deletePost = function(deleteLink){ 
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    $(`#post-${data.data.post_id}`).remove();

                    new Noty({
                        theme: 'relax',
                        text: "Post Deleted",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                    
                }, error: function(error){
                    console.lof(error.responseText);
                }
            })
        })
    }

    createPost();
}
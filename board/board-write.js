document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("submitButton").addEventListener("click", submitPost);
});

async function submitPost() {
    const postTitle = document.getElementById("postTitle").value; // Getting the title
    const postContent = editor.getMarkdown(); // Get content directly from TOAST UI Editor
    const token = localStorage.getItem('accessToken');  // Get token from localStorage

    try {
        const response = await axios.post('http://54.248.217.183/board/write/', {
            gather_title: postTitle,
            context: postContent,
            public: true
        }, {
            headers: {
                'Authorization': `Bearer ${token}`  // Add token to header
            }
        });

        if (response.status === 201) { // 201 Created
            alert('게시글이 성공적으로 작성되었습니다.');
            window.location.href = 'board.html';
        }
    } catch (error) {
        console.error('게시글 작성에 실패했습니다.', error);
        console.error('Server Response: ', error.response.data);
    }
}

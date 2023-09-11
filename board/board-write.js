document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("submitButton").addEventListener("click", submitPost);
});

async function submitPost() {
    const postContent = document.getElementById("postContent").value;
    const token = localStorage.getItem('accessToken');  // 토큰을 localStorage에서 가져옵니다.

    try {
        const response = await axios.post('http://localhost/board/write/', {
            gather_title: document.getElementById('postTitle').value,
            context: postContent
        }, {
            headers: {
                'Authorization': `Bearer ${token}`  // 토큰을 헤더에 추가합니다.
            }
        });

        if (response.status === 201) { // 201 Created
            alert('게시글이 성공적으로 작성되었습니다.');
            window.location.href = 'board.html';
        }
    } catch (error) {
        console.error('게시글 작성에 실패했습니다.', error);
        console.error('Server Response: ', error.response.data);  // 이 부분 추가
    }
}


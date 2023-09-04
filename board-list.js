let currentPage = 1;

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("prevPage").addEventListener("click", prevPage);
    document.getElementById("nextPage").addEventListener("click", nextPage);
    loadPosts();
});

async function loadPosts() {
    const token = localStorage.getItem('accessToken');  // 토큰을 localStorage에서 가져옵니다.

    try {
        const response = await axios.get(`http://127.0.0.1:8000/board?ordering=-created_at&page=${currentPage}`, {
            headers: {
                'Authorization': `Bearer ${token}`  // 토큰을 헤더에 추가합니다.
            }
        });

        if (response.status === 200 && response.data) {
            const postList = document.getElementById("postList");
            postList.innerHTML = "";  // Clear the existing posts first

            response.data.forEach(post => {
                const postItem = document.createElement("div");
                postItem.className = "post-item";
                
                const postTitle = document.createElement("h3");
                postTitle.innerText = post.gather_title;
                
                const postContent = document.createElement("p");
                postContent.innerText = post.context;

                postItem.appendChild(postTitle);
                postItem.appendChild(postContent);
                
                postList.appendChild(postItem);
            });
        }
    } catch (error) {
        console.error('게시글을 불러오는 데 실패했습니다.', error);
    }
}



function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        document.getElementById("currentPage").innerText = currentPage;
        loadPosts();
    }
}

function nextPage() {
    currentPage++;
    document.getElementById("currentPage").innerText = currentPage;
    loadPosts();
}

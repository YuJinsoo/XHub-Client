// <!-- 미사용 확인시, 이 파일은 삭제예정 -->
// 페이지 로딩 시 accessToken이 존재하는지 확인하여 isLoggedIn 값을 설정
if (localStorage.getItem('accessToken')) {
    isLoggedIn = true;
} else {
    isLoggedIn = false;
}

window.addEventListener('load', function(){
    updateButtonVisibility(); // 페이지 로드 시 버튼 상태 업데이트

    const qureyString = window.location.search;
    const urlParams = new URLSearchParams(qureyString);
    const value = urlParams.get('post_id');

    axios.get(`http://54.248.217.183/board/${value}/`)
        .then(response => {
            const data = response.data;
            render_post_details(data);
        })
        .catch(error => console.error('Error fetching Posts:', error))
})


function updateButtonVisibility() {
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    if (isLoggedIn) {
        loginBtn.style.display = 'none';
        signupBtn.style.display = 'none';
        logoutBtn.style.display = 'inline';
    } else {
        loginBtn.style.display = 'inline';
        signupBtn.style.display = 'inline';
        logoutBtn.style.display = 'none';
    }
}


function render_post_details(data){
    console.log(data);
    // 데이터로 내용 추가하기
    const detail_container = document.getElementById('PostContainer');
    console.log(data.context);
    console.log(data.created_at);
    console.log(data.updated_at);
    console.log(data.gather_title);
    console.log(data.writer);

    const list = ['gather_title', 'writer', 'like', 'created_at', 'updated_at', 'img', 'context']

    for (let key of list){
        const newrow = document.createElement('tr');
        const cell1 = document.createElement('td');
        const cell2 = document.createElement('td');

        cell1.textContent = key;
        cell2.textContent = data[key];

        newrow.appendChild(cell1);
        newrow.appendChild(cell2);
        detail_container.appendChild(newrow);
    }

}


async function loadPosts() {
    const token = localStorage.getItem('accessToken');  // 토큰을 localStorage에서 가져옵니다.

    try {
        const response = await axios.get(`http://54.248.217.183/board?ordering=-created_at&page=${currentPage}`, {
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



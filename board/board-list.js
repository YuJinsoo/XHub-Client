let currentPage = 1;

axios.get('http://localhost/board/')
.then(response => {
    const data = response.data;
    console.log(data);
    populatePostlist(data);})
.catch(error => console.error('Error fetching Posts:', error))

if (localStorage.getItem('accessToken')) {
    isLoggedIn = true;
} else {
    isLoggedIn = false;
}

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

window.addEventListener('load', function() {
    updateButtonVisibility(); // 페이지 로드 시 버튼 상태 업데이트
});

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("prevPage").addEventListener("click", prevPage);
    document.getElementById("nextPage").addEventListener("click", nextPage);
    // loadPosts();
});

async function loadPosts() {
    const token = localStorage.getItem('accessToken');  // 토큰을 localStorage에서 가져옵니다.

    try {
        const response = await axios.get(`http://localhost/board?ordering=-created_at&page=${currentPage}`, {
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



function populatePostlist(data){
    const postList = document.getElementById('postList');
    postList.innerHTML = '';

    // 임시 css 적용
    data.forEach(post => {
        
        const postItem = document.createElement('div');
        postItem.className = 'meeting-item';

        const title = document.createElement('h2');
        title.textContent= post.gather_title;
        
        const author = document.createElement('p');
        author.textContent = post.writer;

        const time = document.createElement('p');
        time.textContent = post.created_at;

        const content = document.createElement('p');
        // content.textContent = post.context;
        content.textContent = post.context.substr(0, 5) + ' ...'

        const btn = document.createElement('button');
        btn.textContent='보기'
        btn.clssName = 'join-btn'

        btn.onclick = function(e, post_id = post.id){
            // 상세 페이지 로직
            console.log('get details', post_id);
            window.location.href='board-detail.html?post_id='+encodeURIComponent(post.id);
        };  

        postItem.append(title);
        postItem.append(author);
        postItem.append(time);
        postItem.append(content);
        postItem.append(btn);

        postList.append(postItem);

    })
}

let currentPage = 1;

axios.get('http://54.248.217.183/board/')
    .then(response => {
        const data = response.data;
        console.log("서버로 부터 읽어져 오는 데이터", data);
        
        // 데이터 값이 배열인지 확인
        if (data && Array.isArray(data.results)) {
            populatePostlist(data.results);
        } else {
            console.error("Received data does not contain a results array:", data);
        }        
    })
    .catch(error => {
        console.error('Error fetching Posts:', error);
        console.log('Error Details:', error.response);
    });

let isLoggedIn = false;
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
        const response = await axios.get(`http://54.248.217.183/board?ordering=-created_at&page=${currentPage}`, {
            headers: {
                'Authorization': `Bearer ${token}`  // 토큰을 헤더에 추가합니다.
            }
        });

        const data = response.data;

        // 조건문을 사용하여 응답이 성공적인지 확인.
        if (data.results && Array.isArray(data.results)) {
            const postList = document.getElementById("postList");
            postList.innerHTML = "";  // 초기화

            data.results.forEach(post => {
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

            // 게시물의 수에 따라 nextPage 버튼의 활성 상태 설정
            if (data.results.length < 10) {
                document.getElementById("nextPage").disabled = true;
            } else {
                document.getElementById("nextPage").disabled = false;
            }
        }
        
    } catch (error) {
        console.error('게시글을 불러오는 데 실패했습니다.', error);
        console.log('Error Details in loadPosts:', error.response);
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
        btn.className = 'join-btn'

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

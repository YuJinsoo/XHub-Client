document.getElementById('addFriendForm').addEventListener('submit', addFriend);

// 페이지가 로딩되면 자동으로 친구 목록을 불러옵니다.
window.addEventListener('load', fetchFriendList);

// 친구 추가 함수
async function addFriend(event) {
    event.preventDefault();  // 폼의 기본 동작(페이지 리로드)을 막습니다.

    const friendEmail = document.getElementById('friendEmail').value;

    try {
        // API 호출을 통해 친구 추가
        const response = await axios.post('http://54.248.217.183/player/add-friend/', {
            email: friendEmail
        }, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });

        // 친구 추가 성공
        if (response.status === 200) {
            alert('친구 추가 성공');
            // 친구 목록을 다시 불러옵니다.
            await fetchFriendList();
            console.log("API Response:", response.data);
        }
    } catch (error) {
        console.error('Failed to add friend:', error);
        if (error.response && error.response.data) {
            alert('친구 추가 실패: ' + error.response.data.error);
        } else {
            alert('친구 추가 실패');
        }
    }
}
    
    

// 친구 목록 조회 함수
async function fetchFriendList() {
    try {
        // API 호출을 통해 친구 목록 조회
        const response = await axios.get('http://54.248.217.183/player/friends/', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });

        // 응답으로 받은 친구 목록
        const friendList = response.data;

        // 친구 목록을 표시할 컨테이너
        const friendListContainer = document.getElementById('friendListContainer');

        // 기존 친구 목록 초기화
        friendListContainer.innerHTML = "";

        // 새 친구 목록 추가
        friendList.forEach(friend => {
            const listItem = document.createElement('li');
            listItem.textContent = `이메일: ${friend.email}, 닉네임: ${friend.nickname}`;
            friendListContainer.appendChild(listItem);
        });
    } catch (error) {
        console.error('Failed to fetch friend list:', error);
    }
}

// 친구 추가 폼에 이벤트 리스너 추가
document.getElementById('addFriendForm').addEventListener('submit', addFriend);

// 페이지가 로딩되면 자동으로 친구 목록을 불러옵니다.
window.addEventListener('load', fetchFriendList);

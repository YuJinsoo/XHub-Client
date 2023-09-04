// 플레이어 목록 조회 함수
async function fetchUserList() {
    try {
        // API 호출
        const response = await axios.get('http://localhost/player/search/', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });

        // 응답으로 받은 플레이어 목록
        const playerList = response.data;

        // 목록을 표시할 컨테이너
        const playerListContainer = document.getElementById('playerListContainer');

        // 기존 목록 초기화
        playerListContainer.innerHTML = "";

        // 새 목록 추가
        playerList.forEach(player => {
            const listItem = document.createElement('li');
            listItem.textContent = `이메일: ${player.email}, 닉네임: ${player.nickname}, 연령: ${player.age}, 성별: ${player.gender}`;
            playerListContainer.appendChild(listItem);
        });

        // 플레이어 목록을 표시
        playerListContainer.style.display = "block";

    } catch (error) {
        console.error('Failed to fetch player list:', error);
    }
}
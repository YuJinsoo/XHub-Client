// 로그인 상태를 나타내는 변수 (실제 프로젝트에서는 서버에서 관리해야 합니다)
let isLoggedIn = false;

// 로그아웃 버튼의 DOM 요소
const logoutButton = document.getElementById('logoutButton');

// 페이지 로드시 로그아웃 버튼의 상태를 설정
window.addEventListener('load', function() {
  if (isLoggedIn) {
    logoutButton.style.display = 'inline';  // 로그인 상태일 때 버튼을 표시
  } else {
    logoutButton.style.display = 'none';  // 로그아웃 상태일 때 버튼을 숨김
  }
});


// 로그아웃 함수
async function logout() {
  try {
      // Axios를 사용하여 서버에 로그아웃 요청을 보냅니다.
      const response = await axios.delete('http://localhost/player/logout/', {
          headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
      });

      // 로그아웃 성공
      if (response.status === 200) {
          localStorage.removeItem('accessToken');  // Local storage에서 accessToken 제거
          logoutButton.style.display = 'none';     // 로그아웃 버튼 숨기기
          alert('로그아웃 성공');
      }
  } catch (error) {
      // 로그아웃 실패
      alert('로그아웃 실패');
  }
}


// 로그인 함수 (예시)
async function login() {
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;

  try {
      // Axios를 사용하여 서버에 로그인 요청을 보냅니다.
      const response = await axios.post('http://localhost/player/login/', {
          email: email,
          password: password
      });

      // 로그인 성공
      if (response.status === 200) {
          isLoggedIn = true;
          logoutButton.style.display = 'inline';
          alert('로그인 성공');
      }
  } catch (error) {
    // 로그인 실패
    if (error.response && error.response.data) {
        console.log(error.response.data);
    } else {
        console.log(error);
    }
    alert('로그인 실패');
}
}

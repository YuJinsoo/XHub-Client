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

// 회원가입 함수
async function signup() {
  var email = document.getElementById('signupEmail').value;
  var password = document.getElementById('signupPassword').value;

  try {
      // Axios를 사용하여 서버에 회원가입 요청을 보냅니다.
      const response = await axios.post('/api/signup', {
          email: email,
          password: password
      });

      // 회원가입 성공
      if (response.status === 200) {
          alert('회원가입 성공');
      }
  } catch (error) {
      // 회원가입 실패
      alert('회원가입 실패');
  }
}


// 로그아웃 함수
async function logout() {
  try {
      // Axios를 사용하여 서버에 로그아웃 요청을 보냅니다.
      const response = await axios.post('/api/logout');

      // 로그아웃 성공
      if (response.status === 200) {
          isLoggedIn = false;
          logoutButton.style.display = 'none';
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
      const response = await axios.post('/api/login', {
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
      alert('로그인 실패');
  }
}

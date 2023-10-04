// 페이지 로딩 시 accessToken이 존재하는지 확인하여 isLoggedIn 값을 설정
if (localStorage.getItem('accessToken')) {
  isLoggedIn = true;
} else {
  isLoggedIn = false;
}

function updateButtonVisibility() {
  const loginBtn = document.getElementById('loginBtn');
  const signupBtn = document.getElementById('signupBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const profileBtn = document.getElementById('profileBtn');

  if (isLoggedIn) {
      loginBtn.style.display = 'none';
      signupBtn.style.display = 'none';
      logoutBtn.style.display = 'inline';
      profileBtn.style.display = 'inline';
  } else {
      loginBtn.style.display = 'inline';
      signupBtn.style.display = 'inline';
      logoutBtn.style.display = 'none';
      profileBtn.style.display = 'none';
  }
}

window.addEventListener('load', function() {
  updateButtonVisibility(); // 페이지 로드 시 버튼 상태 업데이트

});


// 세션 만료 처리
async function handleResponseError(error) {
  if (error.response.status === 401) {
    alert('세션이 만료되었습니다. 다시 로그인해주세요.');
    // 필요하다면 로그인 페이지로 리디렉션
    localStorage.removeItem('accessToken');
    window.location.href = 'auth/login.html';
  } else {
    console.log(error);
    alert('오류가 발생했습니다.');
  }
}

// 로그아웃 함수
async function logout() {
  try {
      const response = await axios.delete('http://54.248.217.183/player/logout/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
      });

      if (response.status === 200) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userEmail');
        isLoggedIn = false;  // 로그아웃 했으므로 isLoggedIn을 false로 설정
        updateButtonVisibility();
        alert('로그아웃 성공');
    }
  } catch (error) {
      handleResponseError(error);
  }
}


// 로그인 함수
async function login() {
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;

  try {
      const response = await axios.post('http://54.248.217.183/player/login/', {
          email: email,
          password: password
      });

      if (response.status === 200 && response.data && response.data.access) {
          // 로그인 성공 시 accessToken을 localStorage에 저장
          localStorage.setItem('accessToken', response.data.access);
          localStorage.setItem('refreshToken', response.data.refresh);
          localStorage.setItem('userEmail', email);
          isLoggedIn = true;
          updateButtonVisibility();
          alert('로그인 성공');
          document.location.href = '../index.html';
      } else {
          alert('로그인 실패');
      }
  } catch (error) {
    if (error.response && error.response.data) {
        console.log(error.response.data);
    } else {
        console.log(error);
    }
    alert('로그인 실패');
  }
}

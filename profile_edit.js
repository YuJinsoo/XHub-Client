const emailInput = document.getElementById('email');
const activityPointInput = document.getElementById('activity_point');
const profileImgInput = document.getElementById('profile_img');
// ... Other fields ...

// async function handleResponseError(error) {
//     if (error.response.status === 401) {
//         alert('세션이 만료되었습니다. 다시 로그인해주세요.');
//         // 필요하다면 로그인 페이지로 리디렉션
//         localStorage.removeItem('accessToken');
//         window.location.href = 'login.html';
//     } else {
//         console.log(error);
//         alert('오류가 발생했습니다.');
//     }
// }

async function fetchProfile() {
    try {
        const response = await axios.get('http://localhost/player/update/', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });

        const data = response.data;
        emailInput.value = data.email;
        activityPointInput.value = data.activity_point;
        // ... Populate other fields ...

    } catch (error) {
        console.error('Failed to fetch profile:', error);
    }
}

async function submitProfile() {
    try {
        const formData = new FormData();
        formData.append('age', document.getElementById('age').value);
        formData.append('gender', document.getElementById('gender').value);
        formData.append('category', document.getElementById('category').value);
        formData.append('position', document.getElementById('position').value);

        const password = document.getElementById('currentPassword').value;
        const profileImg = profileImgInput.files[0];

        if (password) {
            formData.append('password', password);
        }
        if (profileImg) {
            formData.append('profile_img', profileImg);
        }

        const response = await axios.put('http://localhost/player/update/', formData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });

        if (response.status === 200) {
            alert('회원정보가 성공적으로 수정되었습니다.');
        } else {
            alert('회원정보 수정에 실패하였습니다.');
        }
    } catch (error) {
        if (error.response && error.response.data) {
            const errorMessage = error.response.data;
            if (errorMessage.password) {
                alert(errorMessage.password[0]);
            } else {
                console.error('Failed to update profile:', error);
            }
        } else {
            console.error('Failed to update profile:', error);
        }
    }
}

function goToPasswordChange() {
    // Redirect to password change page
    window.location.href = 'update-ps.html';
}

// Fetch profile on page load
window.onload = fetchProfile;

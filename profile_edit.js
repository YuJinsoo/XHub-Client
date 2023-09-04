const emailInput = document.getElementById('email');
const activityPointInput = document.getElementById('activity_point');
const profileImgInput = document.getElementById('profile_img');
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
    console.log("Fetching profile...");
    try {
        const response = await axios.get('http://localhost/player/update/', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });



        const data = response.data;
        console.log("Fetched data:", data);

        // Update input fields with fetched data
        emailInput.value = data.email;
        activityPointInput.value = data.activity_point;

        // Add the following lines to update other fields
        document.getElementById('age').value = data.age || '';
        document.getElementById('gender').value = data.gender || 'X'; // Default to 'X' if null
        document.getElementById('category').value = data.category || ''; 
        document.getElementById('position').value = data.position || 'X'; // Default to 'X' if null

    } catch (error) {
        console.error('Failed to fetch profile:', error);
    }
}

async function submitProfile() {
    console.log("Submitting profile...");
    try {
        const formData = new FormData();
        formData.append('age', document.getElementById('age').value);
        formData.append('gender', document.getElementById('gender').value);
        formData.append('category', document.getElementById('category').value);
        formData.append('position', document.getElementById('position').value);

        console.log("Form Data: ", formData);

        const password = document.getElementById('currentPassword').value;
        const profileImg = profileImgInput.files[0];

        if (password) {
            formData.append('currentPassword', password);  // 'password'를 'currentPassword'로 수정
        }
        if (profileImg) {
            formData.append('profile_img', profileImg);
        }

        const response = await axios.put('http://localhost/player/update/', formData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });



        console.log("Server response: ", response);

        if (response.status === 200) {
            alert('회원정보가 성공적으로 수정되었습니다.');
        } else {
            alert('회원정보 수정에 실패하였습니다.');
        }
    } catch (error) {
        if (error.response && error.response.data) {
            const errorMessage = error.response.data;
            console.error("Server error message: ", errorMessage);
    
            if (errorMessage.detail) {
                alert(errorMessage.detail);
            } else if (errorMessage.password) {
                alert(errorMessage.password[0]);
            } else {
                console.error('Failed to update profile:', error);
            }
        } else {
            console.error('Failed to update profile:', error);
        }
    }
}    

async function unregister() {
    if (confirm("정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
        try {
            const response = await axios.delete('http://localhost/player/unregister/', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            
            if (response.status === 204 || response.status === 200) {
                alert("회원 탈퇴가 완료되었습니다.");
                localStorage.removeItem('accessToken');
                // 필요하다면 로그인 페이지로 리디렉션
                window.location.href = 'login.html';
            } else {
                alert("회원 탈퇴에 실패했습니다.");
            }
        } catch (error) {
            console.error('Failed to unregister:', error);
            alert('회원 탈퇴에 실패했습니다.');
        }
    }
}


function goToPasswordChange() {
    // Redirect to password change page
    window.location.href = 'update-ps.html';
}


// Fetch profile on page load
window.onload = () => {
    console.log("Window loaded. Fetching profile...");
    fetchProfile();
}

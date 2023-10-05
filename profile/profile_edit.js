const emailInput = document.getElementById('email');
const activityPointInput = document.getElementById('activity_point');
const profileImgInput = document.getElementById('imageUpload');


// 프로필 이미지 미리보기
document.getElementById('imageUpload').addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('profileImagePreview').src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
});

// 위도, 경도값 변수 선언
let latitude = null;
let longitude = null;

async function fetchProfile() {
    console.log("Fetching profile...");
    try {
        const response = await axios.get('http://54.248.217.183/player/update/', {
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
        document.getElementById('gender').value = data.gender || 'X';
        document.getElementById('category').value = data.category || ''; 
        document.getElementById('position').value = data.position || 'X';

        const profileImagePreview = document.getElementById('profileImagePreview');
        profileImagePreview.src = data.profile_img + "?" + new Date().getTime();

    } catch (error) {
        console.error('Failed to fetch profile:', error);
    }
}


// 지도 및 위도, 경도값 받기
function sample5_execDaumPostcode() {
    new daum.Postcode({
        oncomplete: function(data) {
            var addr = data.address; // 최종 주소 정보

            // 해당 필드에 주소 정보를 삽입합니다.
            document.getElementById("sample5_address").value = addr;
            // 주소를 기반으로 상세 정보 검색
            geocoder.addressSearch(data.address, function(results, status) {
                // 검색이 정상적으로 완료된 경우
                if (status === daum.maps.services.Status.OK) {
                    var result = results[0]; // 첫 번째 결과 값을 사용합니다.

                    // 주소에 대한 좌표를 받습니다.
                    latitude = result.y;
                    longitude = result.x;

                    // 지도를 표시합니다.
                    mapContainer.style.display = "block";
                    map.relayout();
                    // 지도 중심을 변경합니다.
                    map.setCenter(new daum.maps.LatLng(latitude, longitude));
                    // 마커를 결과로 받은 위치로 이동시킵니다.
                    marker.setPosition(new daum.maps.LatLng(latitude, longitude));
                }
            });
        }
    }).open();
}


async function submitProfile() {
    console.log("Submitting profile...");
    try {
        const formData = new FormData();
        formData.append('age', document.getElementById('age').value);
        formData.append('gender', document.getElementById('gender').value);
        formData.append('category', document.getElementById('category').value);
        formData.append('position', document.getElementById('position').value);
        console.log(`위도, 경도 ${latitude}, ${longitude}`)
        formData.append('latitude', parseFloat(latitude).toFixed(6));
        formData.append('longitude', parseFloat(longitude).toFixed(6));

        console.log("Form Data: ", formData);

        const password = document.getElementById('currentPassword').value;
        const profileImg = profileImgInput.files[0];

        if (password) {
            formData.append('currentPassword', password);  // 'password'를 'currentPassword'로 수정
        }
        if (profileImg) {
            formData.append('profile_img', profileImg);
        }

        const response = await axios.put('http://54.248.217.183/player/update/', formData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });



        console.log("Server response: ", response);

        if (response.status === 200) {
            alert('회원정보가 성공적으로 수정되었습니다.');
            document.getElementById('profileImagePreview').src = response.data.profile_img + "?" + new Date().getTime();
            
            window.location.href = '../index.html';
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
            const response = await axios.delete('http://54.248.217.183/player/unregister/', {
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

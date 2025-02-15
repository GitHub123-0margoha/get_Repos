let theInput = document.querySelector(".get-repos input");
let theButton = document.querySelector(".get-repos .get-button");
let showData = document.querySelector(".show-data");
let userInfo = document.createElement("div"); // لإنشاء معلومات المستخدم
userInfo.className = "user-info";

// عند الضغط على الزر
theButton.onclick = function () {
    getRepos();
};

// دالة جلب المستودعات
function getRepos() {
    showData.innerHTML = ""; // مسح البيانات السابقة
    userInfo.innerHTML = ""; // مسح بيانات المستخدم السابقة

    if (theInput.value === "") {
        showData.innerHTML = `<span style="color: red;">Please Enter GitHub Username!</span>`;
        return;
    }

    fetch(`https://api.github.com/users/${theInput.value}`)
        .then((response) => response.json())
        .then((userData) => {
            if (userData.message === "Not Found") {
                showData.innerHTML = `<span style="color: red;">User Not Found!</span>`;
                return;
            }

            // عرض صورة المستخدم والاسم
            let userImage = document.createElement("img");
            userImage.src = userData.avatar_url;

            let userName = document.createElement("h2");
            userName.textContent = userData.login;

            userInfo.appendChild(userImage);
            userInfo.appendChild(userName);

            // إدراج معلومات المستخدم أعلى الصفحة
            document.querySelector(".repos-container").prepend(userInfo);

            // جلب المستودعات
            return fetch(`https://api.github.com/users/${theInput.value}/repos`);
        })
        .then((response) => response.json())
        .then((repositories) => {
            repositories.forEach((repo) => {
                let mainDiv = document.createElement("div");
                mainDiv.className = "repo-box";

                let repoName = document.createElement("h3");
                repoName.textContent = repo.name;
                mainDiv.appendChild(repoName);

                let theUrl = document.createElement("a");
                theUrl.textContent = "Visit";
                theUrl.href = `https://github.com/${theInput.value}/${repo.name}`;
                theUrl.target = "_blank";
                mainDiv.appendChild(theUrl);

                let starsCount = document.createElement("span");
                starsCount.textContent = `⭐ ${repo.stargazers_count}`;
                mainDiv.appendChild(starsCount);

                showData.appendChild(mainDiv);
            });
        })
        .catch((error) => console.log("Error fetching data:", error));
}

const API_KEY = "a13b75354b73410e83de429439c33c72";
let newsList = []; // 뉴스정보를 리스트에 담는다.
// 버튼을 가져와서 클릭이벤트주기
const menus = document.querySelectorAll(".menus button");
menus.forEach((menu) =>
  menu.addEventListener("click", (event) => getNewsByCategory(event))
);

const getLatestNews = async () => {
  const url = new URL(
    `https://swlee-times.netlify.app/top-headlines?country=kr&apiKey=${API_KEY}`
  );
  const response = await fetch(url); // await를 하면 비동기로 되기 때문에 함수에 async를 해야함.
  const data = await response.json(); // body에서 json(파일형식)으로 뽑기
  newsList = data.articles;
  render();
  console.log("dddd", newsList); // fetch는 기다려야하기 때문에 pending 오류 발생.--->함수 앞에 await 쓰기.
};

// 카테고리별로 뉴스정보를 가져와서 보여주는 함수.
const getNewsByCategory = async (event) => {
  const category = event.target.textContent.toLowerCase();
  console.log(category);
  const url = new URL(
    `https://swlee-times.netlify.app/top-headlines?country=kr&category=${category}&apiKey=${API_KEY}`
  );
  const response = await fetch(url);
  const data = await response.json();
  console.log(data);
  newsList = data.articles;
  render();
};

// 키워드를 입력하면 키워드별로 뉴스정보를 가져와서 보여주는 함수.
const getNewsByKeyboard = async () => {
  const keyword = document.getElementById("search-input").value;
  console.log("keyword", keyword);
  const url = new URL(
    `https://swlee-times.netlify.app/top-headlines?country=kr&q=${keyword}&apiKey=${API_KEY}`
  );
  const response = await fetch(url);
  const data = await response.json();
  newsList = data.articles;
  render();
};
// 그리기 함수
const render = () => {
  // 붙일 내용
  const newsHTML = newsList
    .map(
      (news) => `<div class ="row news"> 
    <div class="col-lg-4">
        <img class="news-img-size"
            src="${
              news.urlToImage ||
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU"
            }" />
    </div>
    <div class="col-lg-8">
        <h2>${news.title}</h2>
        <p>${
          news.description == null || news.description == ""
            ? "내용없음"
            : news.description.length > 200
            ? news.description.substring(0, 200) + "..."
            : news.description
        }</p>
        <div>${news.source.name || "no source"}  ${moment(
        news.published_date
      ).fromNow()}</div>
    </div>
</div>`
    )
    .join(""); // join으로 ,를 없애기 위해 배열을 스트링으로 바꾸기
  console.log(newsHTML);
  // 어떤 Id에 붙일지 입력. innerHTML : 문자열을 HTML형식으로 붙여넣는다는 의미.
  document.getElementById("news-board").innerHTML = newsHTML;
};
getLatestNews();

//1. 버튼들에 클릭이벤트주기
//2. 카테고리별 뉴스 가져오기
//3. 그 뉴스를 보여주기 render
function toggleSearch() {
  let searchInput = document.getElementById("search-input");
  let searchButton = document.getElementById("search-button");
  console.log("뭔데", searchInput.style.display, searchButton.style.display);
  if (
    searchInput.style.display === "none" &&
    searchButton.style.display === "none"
  ) {
    console.log("나타남");
    searchInput.style.display = "block";
    searchButton.style.display = "block";
  } else {
    console.log("숨겨짐");
    searchInput.style.display = "none";
    searchButton.style.display = "none";
  }
}

function toggleMenu() {
  var sideMenu = document.getElementById("side-menu");
  sideMenu.style.display =
    sideMenu.style.display === "none" || sideMenu.style.display === ""
      ? "block"
      : "none";
}

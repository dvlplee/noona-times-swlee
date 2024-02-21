const API_KEY = "a13b75354b73410e83de429439c33c72";
let newsList = []; // 뉴스정보를 리스트에 담는다.

const getLatestNews = async () => {
  const url = new URL(
    `https://swlee-times.netlify.app/top-headlines?country=us&apiKey=${API_KEY}`
  );

  const response = await fetch(url); // await를 하면 비동기로 되기 때문에 함수에 async를 해야함.
  const data = await response.json(); // body에서 json(파일형식)으로 뽑기
  newsList = data.articles;
  render();
  console.log("dddd", newsList); // fetch는 기다려야하기 때문에 pending 오류 발생.--->함수 앞에 await 쓰기.
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

function toggleMenu() {
    let menuList = document.getElementById("menu-list");
    menuList.style.display = (menuList.style.display === "flex") ? "none" : "flex";
}
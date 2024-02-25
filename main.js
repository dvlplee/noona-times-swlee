const API_KEY = "a13b75354b73410e83de429439c33c72";
let newsList = []; // 뉴스정보를 리스트에 담는다.
// 버튼을 가져와서 클릭이벤트주기
const menus = document.querySelectorAll(".menus button");
menus.forEach((menu) =>
  menu.addEventListener("click", (event) => getNewsByCategory(event))
);

let url = new URL(
  `https://swlee-times.netlify.app/top-headlines?country=kr&apiKey=${API_KEY}`
);

let totalResults = 0;
let page = 1;
// 고정값
const pageSize = 10;
const groupSize = 5;

// 겹치는 부분 리펙토링해주기.
const getNews = async () => {
  try {
    url.searchParams.set("page", page); // => &page=page
    url.searchParams.set("pageSize", pageSize);

    const response = await fetch(url); // await를 하면 비동기로 되기 때문에 함수에 async를 해야함. fetch는 기다려야하기 때문에 pending 오류 발생.--->함수 앞에 await 쓰기.
    const data = await response.json(); // body에서 json(파일형식)으로 뽑기
    console.log("ddd", data);
    if (response.status === 200) {
      if (data.articles.length === 0) {
        throw new Error("No result for this search");
      }
      newsList = data.articles;
      totalResults = data.totalResults;
      render();
      paginationRender();
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    errorRender(error.message);
  }
};

const getLatestNews = async () => {
  url = new URL(
    `https://swlee-times.netlify.app/top-headlines?country=kr&apiKey=${API_KEY}`
  );
  getNews();
};

// 카테고리별로 뉴스정보를 가져와서 보여주는 함수.
const getNewsByCategory = async (event) => {
  const category = event.target.textContent.toLowerCase();
  url = new URL(
    `https://swlee-times.netlify.app/top-headlines?country=kr&category=${category}&apiKey=${API_KEY}`
  );
  getNews();
};

// 키워드를 입력하면 키워드별로 뉴스정보를 가져와서 보여주는 함수.
const getNewsByKeyboard = async () => {
  const keyword = document.getElementById("search-input").value;
  url = new URL(
    `https://swlee-times.netlify.app/top-headlines?country=kr&q=${keyword}&apiKey=${API_KEY}`
  );
  getNews();
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
  // 어떤 Id에 붙일지 입력. innerHTML : 문자열을 HTML형식으로 붙여넣는다는 의미.
  document.getElementById("news-board").innerHTML = newsHTML;
};

const errorRender = (errorMessage) => {
  const errorHTML = `<div class="alert alert-danger" role="alert">
  ${errorMessage}
</div>`;
  document.getElementById("news-board").innerHTML = errorHTML;
};

const paginationRender = () => {
  //totalResult,
  //page
  //pagesize
  //groupsize
  //totalpages
  const totalPages = Math.ceil(totalResults / pageSize);
  //pageGroup
  const pageGroup = Math.ceil(page / groupSize);
  //lastpage
  //   let lastPage = pageGroup * groupSize;
  //마지막 페이지그룹이 그룹사이즈보다 작다? lastpage = totalpage
  let lastPage = pageGroup * 5;
  if (lastPage > totalPages) {
    lastPage = totalPages;
  }
  //firstpage
  //   const firstPage =
  //     lastPage - (groupSize - 1) <= 0 ? 1 : lastPage - (groupSize - 1);
  let firstPage = lastPage - 4 <= 0 ? 1 : lastPage - 4; // 첫그룹이 5이하이면
  let paginationHTML = ``;
  if (firstPage >= 6) {
    paginationHTML = `<li class="page-item" onclick="moveToPage(1)">
    <a class="page-link" href='#js-bottom'>&lt;&lt;</a>
  </li>
  <li class="page-item" onclick="moveToPage(${page - 1})">
    <a class="page-link" href='#js-bottom'>&lt;</a>
  </li>`;
  }

  for (let i = firstPage; i <= lastPage; i++) {
    paginationHTML += `<li class="page-item ${i == page ? "active" : ""}" >
    <a class="page-link" href='#js-bottom' id='page-${i}' onclick="moveToPage(${i})" >${i}</a>
   </li>`;
  }

  if (lastPage < totalPages) {
    paginationHTML += `<li class="page-item" onclick="moveToPage(${page + 1})">
    <a  class="page-link" href='#js-program-detail-bottom'>&gt;</a>
   </li>
   <li class="page-item" onclick="moveToPage(${totalPages})">
    <a class="page-link" href='#js-bottom'>&gt;&gt;</a>
   </li>`;
  }
  document.querySelector(".pagination").innerHTML = paginationHTML;
};
const moveToPage = (pageNum) => {
  console.log("무ㅜ브도투페이지", pageNum);
  page = pageNum;
  getNews();
};
getLatestNews();

//1. 버튼들에 클릭이벤트주기
//2. 카테고리별 뉴스 가져오기
//3. 그 뉴스를 보여주기 render

// 버튼을 누르면 input창, 버튼 나오기/숨기기
function toggleSearch() {
  let searchInput = document.getElementById("search-input");
  let searchButton = document.getElementById("search-button");
  if (
    searchInput.style.display === "none" ||
    searchInput.style.display === ""
  ) {
    searchInput.style.display = "block";
    searchButton.style.display = "block";
  } else {
    searchInput.style.display = "none";
    searchButton.style.display = "none";
  }
}

// 햄버거 버튼 클릭시 side메뉴 나오게 하기
function toggleMenu() {
  let sideMenu = document.getElementById("side-menu");
  sideMenu.style.display =
    sideMenu.style.display === "none" || sideMenu.style.display === ""
      ? "block"
      : "none";
}

// let newsBoard = document.getElementById('news-board') // 나와야하는 태그 가져오기
// let searchButton = document.getElementById("search-button") // 버튼

// function alert(message, type) {
//   var wrapper = document.createElement('div')
//   wrapper.innerHTML = '<div class="alert alert-' + type + ' alert-dismissible" role="alert">' + message + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'
//   newsBoard.append(wrapper)
// }
//  // 버튼 클릭시 띄울 이벤트
// if (searchButton) {
//     console.log("버튼클릭")
//     searchButton.addEventListener('click', function () {
//     alert('No matches for your search', 'success')
//   })
// }

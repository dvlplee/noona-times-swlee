const API_KEY = "a13b75354b73410e83de429439c33c72";
let news = []

const getLatestNews = async () => {
  const url = new URL(
    `http://times-node-env.eba-appvq3ef.ap-northeast-2.elasticbeanstalk.com/top-headlines?q=아이유&country=us&apiKey=${API_KEY}`
  );

  const response = await fetch(url); // await를 하면 비동기로 되기 때문에 함수에 async를 해야함.
  const data = await response.json(); // body에서 json(파일형식)으로 뽑기
  news = data.articles
  console.log("dddd", news); // fetch는 기다려야하기 때문에 pending 오류 발생.--->함수 앞에 await 쓰기.
};

getLatestNews();

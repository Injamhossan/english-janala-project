const loadLesson = () => {
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((res) => res.json())
    .then((json) => {
      console.log(json);
      if (json.status) {
        displayLesson(json.data);
      } else {
        console.error("API থেকে সঠিক ডেটা পাওয়া যায়নি");
      }
    })
    .catch((err) => console.error("API তে সমস্যা:", err));
};


const removeActive = () => {
    const lessonButtons = document.querySelectorAll(".lesson-btn");
    // console.log(lessonButtons);
    lessonButtons.forEach((btn) => btn.classList.remove("active"));
}
const loadLevelWord = (id) => {
  console.log("Selected Level ID:", id);
  const url = `https://openapi.programming-hero.com/api/level/${id}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
        removeActive(); //Remove all active class
        const clickBtn = document.getElementById(`lesson-btn-${id}`);
        clickBtn.classList.add("active");
      console.log(data); // API response check
      if (data.status) {
        displayLevelWord(data.data);
      } else {
        console.error("API থেকে ডেটা পাওয়া যায়নি");
      }
    })
    .catch((err) => console.error("API Error:", err));
};

const displayLevelWord = (words) => {
  const wordContainer = document.getElementById("word-container");
  wordContainer.innerHTML = "";

  if (words.length == 0) {
    wordContainer.innerHTML = `
    <div class="text-center col-span-full py-10 space-y-6">
            <i class="text-[100px] text-gray-600 fa-solid fa-triangle-exclamation"></i>
    <p class="hind-siliguri-regular text-[16px]">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
            <h2 class="hind-siliguri-regular text-[35px]">নেক্সট Lesson এ যান</h2>
        </div>
    `;
  }

  words.forEach((word) => {
    const card = document.createElement("div");
    card.innerHTML = `
        <div class="bg-white rounded-xl text-center shadow-sm py-5 px-5 space-y-4">
            <h2 class="text-[32px] font-bold">${word.word}</h2>
            <p class="text-[20px]">Meaning/Pronunciation</p>
            <div class="hind-siliguri-regular text-[#18181B] text-[32px] font-semibold"> "${word.meaning} / ${word.pronunciation}"</div>
            <div class="flex justify-between items-center">
                <button class="bg-[#1a91ff1a] px-5 py-4 rounded-lg"><i class="fa-solid fa-circle-info"></i></button>
                <button class="bg-[#1a91ff1a] px-5 py-4 rounded-lg"><i class="fa-solid fa-volume-high"></i></button>
            </div>
        </div>`;
    wordContainer.append(card);
  });
};
const displayLesson = (lessons) => {
  const levelContainer = document.getElementById("level-container");
  levelContainer.innerHTML = "";
  for (let lesson of lessons) {
    const btnDiv = document.createElement("div");
    btnDiv.innerHTML = `<button id="lesson-btn-${lesson.level_no}" onclick="loadLevelWord(${lesson.level_no})" class="btn btn-neutral btn-outline border-[#422AD5] text-[#422AD5] hover:text-white hover:bg-[#422AD5] lesson-btn">
                <i class="fa-solid fa-book-open-reader"></i> Lesson - ${lesson.level_no}</button>`;
    levelContainer.append(btnDiv);
  }
};

loadLesson();

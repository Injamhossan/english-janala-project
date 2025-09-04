const loadLesson = () => {
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((res) => res.json())
    .then((json) => {
      console.log(json);
      if (json.status && json.data) {
        displayLesson(json.data);
      } else {
        console.error("API not available");
      }
    })
    .catch((err) => console.error("API Problem:", err));
};

const removeActive = () => {
  const lessonButtons = document.querySelectorAll(".lesson-btn");
  lessonButtons.forEach((btn) => btn.classList.remove("active"));
};

const loadLevelWord = (id) => {
  console.log("Selected Level ID:", id);
  const url = `https://openapi.programming-hero.com/api/level/${id}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      removeActive();
      const clickBtn = document.getElementById(`lesson-btn-${id}`);
      if (clickBtn) clickBtn.classList.add("active");

      console.log(data);

      if (data.status && data.data) {
        displayLevelWord(data.data);
      } else {
        console.error("API Not available");
      }
    })
    .catch((err) => console.error("API Error:", err));
};

const loadWordDetail = async (id) => {
  try {
    const url = `https://openapi.programming-hero.com/api/word/${id}`;
    const res = await fetch(url);
    const details = await res.json();

    if (details.data) {
      displayWordDetails(details.data);
    } else {
      console.error("Word details পাওয়া যায়নি");
    }
  } catch (error) {
    console.error("API Error:", error);
  }
};

const createElements = (value) => {
  if (!value) return "কোনো synonym পাওয়া যায়নি";

  const list = Array.isArray(value)
    ? value
    : String(value)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

  if (!list.length) return "কোনো synonym পাওয়া যায়নি";

  return list
    .map(
      (s) =>
        `<span class="inline-block bg-[#1a91ff1a] px-3 py-1 rounded-lg text-sm mr-2 mb-2">${s}</span>`
    )
    .join("");
};

// Nav button Function 


document.querySelector("#faq-btn").addEventListener("click", (e) => {
  e.preventDefault();
  document.querySelector("#faq").scrollIntoView({ behavior: "smooth" });
});


document.querySelector("#learn-btn").addEventListener("click", (e) => {
  e.preventDefault();
  document.querySelector("#learn").scrollIntoView({ behavior: "smooth" });
});


const displayWordDetails = (word) => {
  console.log(word);
  const detailsBox = document.getElementById("details-container");

  detailsBox.innerHTML = `
    <div class="">
      <h2 class="text-2xl font-bold mb-[32px]">
        ${word.word ? word.word : "শব্দ পাওয়া যায়নি"} 
        (<i class="fa-solid fa-microphone-lines"></i> : ${
          word.pronunciation ? word.pronunciation : "N/A"
        })
      </h2>
    </div>
    <div class="mb-[32px]">
      <h2 class="font-bold">Meaning</h2>
      <p class="hind-siliguri-regular">${
        word.meaning ? word.meaning : "অর্থ পাওয়া যায়নি"
      }</p>
    </div>
    <div class="mb-[32px]">
      <h2 class="font-bold">Example</h2>
      <p class="hind-siliguri-regular">${
        word.sentence ? word.sentence : "উদাহরণ পাওয়া যায়নি"
      }</p>
    </div>
    <div class="">
      <h2 class="font-bold">Synonym</h2>
      <div class="hind-siliguri-regular">${
        word.synonyms
          ? createElements(word.synonyms)
          : "কোনো synonym পাওয়া যায়নি"
      }</div>
    </div>
  `;

  const modal = document.getElementById("word_modal");
  if (modal && typeof modal.showModal === "function") modal.showModal();
};

const displayLevelWord = (words) => {
  const wordContainer = document.getElementById("word-container");
  wordContainer.innerHTML = "";

  if (!words || words.length === 0) {
    wordContainer.innerHTML = `
      <div class="text-center col-span-full py-10 space-y-6">
        <i class="text-[100px] text-gray-600 fa-solid fa-triangle-exclamation"></i>
        <p class="hind-siliguri-regular text-[16px]">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
        <h2 class="hind-siliguri-regular text-[35px]">নেক্সট Lesson এ যান</h2>
      </div>
    `;
    return;
  }

  // প্রথমে container কে flex + wrap দিতে হবে
  wordContainer.className = "flex flex-wrap mx-5 sm:mx-20 lg:mx-14 bg-[#F8F8F8] p-2 lg:p-4 rounded-[10px]"; // negative margin for spacing

  words.forEach((word) => {
    const card = document.createElement("div");

    card.className = "w-full sm:w-1/2 lg:w-1/3 p-3";

    card.innerHTML = `
  <div class="bg-white rounded-xl text-center shadow-sm py-5 px-5 space-y-4"> <h2 class="text-[32px] font-bold">${
    word.word ? word.word : "শব্দ পাওয়া যায়নি"
  }</h2> <p class="text-[20px]">Meaning / Pronunciation</p> <div class="hind-siliguri-regular text-[#18181B] text-[32px] font-semibold"> "${
      word.meaning ? word.meaning : "অর্থ পাওয়া যায়নি"
    } / ${
      word.pronunciation ? word.pronunciation : "Pronunciation পাওয়া যায়নি"
    }" </div> <div class="flex justify-between items-center"> <button onclick="loadWordDetail(${
      word.id
    })" class="bg-[#1a91ff1a] px-5 py-4 rounded-lg"> <i class="fa-solid fa-circle-info"></i> </button> <button onclick="speakWord('${
      word.word
    }')" class="bg-[#1a91ff1a] px-5 py-4 rounded-lg"> <i class="fa-solid fa-volume-high"></i> </button> </div> </div>`;

    wordContainer.append(card);
  });
};

// Specking Function
function speakWord(text) {
  if (!text) {
    console.error("কোনো শব্দ পাওয়া যায়নি");
    return;
  }
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  speechSynthesis.speak(utterance);
}

const displayLesson = (lessons) => {
  const levelContainer = document.getElementById("level-container");
  levelContainer.innerHTML = "";

  lessons.forEach((lesson) => {
    const btnDiv = document.createElement("div");
    btnDiv.innerHTML = `
      <button 
        id="lesson-btn-${lesson.level_no}" 
        onclick="loadLevelWord(${lesson.level_no})" 
        class="btn btn-neutral btn-outline border-[#422AD5] text-[#422AD5] hover:text-white hover:bg-[#422AD5] lesson-btn">
        <i class="fa-solid fa-book-open-reader"></i> Lesson - ${lesson.level_no}
      </button>`;
    levelContainer.append(btnDiv);
  });
};

loadLesson();

// FAQ Toggle
document.querySelectorAll(".faq-header").forEach((header) => {
  header.addEventListener("click", () => {
    const content = header.nextElementSibling;
    const icon = header.querySelector("i");

    content.classList.toggle("hidden");

    if (content.classList.contains("hidden")) {
      icon.classList.remove("fa-minus");
      icon.classList.add("fa-plus");
    } else {
      icon.classList.remove("fa-plus");
      icon.classList.add("fa-minus");
    }
  });
});

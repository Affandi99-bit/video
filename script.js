document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("videoModal");
  const videoPlayer = document.getElementById("videoPlayer");
  const closeBtn = document.querySelector(".close");
  const videoContainer = document.querySelector(".grid");
  const prevBtn = document.querySelector("slide-left");
  const nextBtn = document.querySelector("slide-right");
  const videoCount = 4;
  const groupSize = 9;
  const boxes = [];

  for (let i = 1; i <= videoCount; i++) {
    const box = document.createElement("div");
    box.className =
      "aspect-video bg-white rounded-lg flex items-center justify-center overflow-hidden transition-transform hover:scale-105 cursor-pointer";
    box.dataset.video = `video${i}.mp4`;
    box.innerHTML = `
  <video
    src="/video/video${i}.mp4"
    poster="/thumbnail/video${i}.png"
    preload="metadata"
    muted
    playsinline
    class="w-full h-full object-cover"
    onmouseover="this.play()"
    onmouseout="this.pause(); this.currentTime=0;"
    onerror="this.closest('div').style.display='none';"
  ></video>`;
    boxes.push(box);
  }

  let currentSlide = 0;

  function renderSlide(slideIdx) {
    videoContainer.innerHTML = "";
    const start = slideIdx * groupSize;
    const end = start + groupSize;
    boxes.slice(start, end).forEach((box) => videoContainer.appendChild(box));
    videoContainer.appendChild(prevBtn);
    videoContainer.appendChild(nextBtn);
    prevBtn.disabled = slideIdx === 0;
    nextBtn.disabled = end >= boxes.length;
  }
  renderSlide(currentSlide);

  prevBtn.addEventListener("click", () => {
    if (currentSlide > 0) {
      currentSlide--;
      renderSlide(currentSlide);
    }
  });

  nextBtn.addEventListener("click", () => {
    if ((currentSlide + 1) * groupSize < boxes.length) {
      currentSlide++;
      renderSlide(currentSlide);
    }
  });

  videoContainer.addEventListener("click", (e) => {
    const box = e.target.closest(".box");
    if (!box) return;
    const videoSrc = "/video/" + box.dataset.video;
    videoPlayer.src = videoSrc;
    modal.classList.remove("hidden");
    videoPlayer.play();
  });

  closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
    videoPlayer.pause();
    videoPlayer.currentTime = 0;
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
      modal.classList.add("hidden");
      videoPlayer.pause();
      videoPlayer.currentTime = 0;
    }
  });
});

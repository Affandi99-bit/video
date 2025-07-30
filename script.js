document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("videoModal");
  const videoPlayer = document.getElementById("videoPlayer");
  const closeBtn = modal.querySelector(".close");
  const videoContainer = document.getElementById("videoGrid");
  const prevBtn = document.querySelector(".slide-left");
  const nextBtn = document.querySelector(".slide-right");

  const videoCount = 20; // or however many videos you have
  const groupSize = 10;
  let currentSlide = 0;
  const slides = [];

  for (let i = 0; i < Math.ceil(videoCount / groupSize); i++) {
    const slide = document.createElement("div");
    slide.className = "slide";

    for (let j = 0; j < groupSize; j++) {
      const videoIndex = i * groupSize + j + 1;
      if (videoIndex > videoCount) break;

      const box = document.createElement("div");
      box.className = "box";
      box.dataset.video = `video${videoIndex}.mp4`;
      box.innerHTML = `
        <video
          src="/video/video${videoIndex}.mp4"
          poster="/thumbnail/video${videoIndex}.png"
          preload="metadata"
          muted
          playsinline
          class="w-full h-full object-cover"
          onmouseover="this.play()"
          onmouseout="this.pause(); this.currentTime=0;"
          onerror="this.closest('.box').style.display='none';"
        ></video>
      `;
      slide.appendChild(box);
    }

    slides.push(slide);
  }

  // Render all slides side by side
  videoContainer.innerHTML = "";
  slides.forEach((s) => videoContainer.appendChild(s));

  function updateSlideTransform() {
    const offset = -currentSlide * 100;
    videoContainer.style.transform = `translateX(${offset}%)`;

    prevBtn.disabled = currentSlide === 0;
    nextBtn.disabled = currentSlide >= slides.length - 1;
  }

  updateSlideTransform();

  prevBtn.addEventListener("click", () => {
    if (currentSlide > 0) {
      currentSlide--;
      updateSlideTransform();
    }
  });

  nextBtn.addEventListener("click", () => {
    if (currentSlide < slides.length - 1) {
      currentSlide++;
      updateSlideTransform();
    }
  });

  // Swipe Support
  let touchStartX = 0;
  let touchEndX = 0;
  let isSwiping = false;

  videoContainer.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
    isSwiping = false;
  });

  videoContainer.addEventListener("touchmove", (e) => {
    const deltaX = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(deltaX) > 10) isSwiping = true;
  });

  videoContainer.addEventListener("touchend", (e) => {
    if (!isSwiping) return;

    touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    const threshold = 50;

    if (diff < -threshold && currentSlide < slides.length - 1) {
      currentSlide++;
      updateSlideTransform();
    } else if (diff > threshold && currentSlide > 0) {
      currentSlide--;
      updateSlideTransform();
    }
  });

  // Modal logic
  videoContainer.addEventListener("click", (e) => {
    const box = e.target.closest(".box");
    if (!box) return;

    const videoSrc = "/video/" + box.dataset.video;
    videoPlayer.src = videoSrc;
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    videoPlayer.play();
  });

  closeBtn.addEventListener("click", closeModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) closeModal();
  });

  function closeModal() {
    modal.classList.remove("flex");
    modal.classList.add("hidden");
    videoPlayer.pause();
    videoPlayer.currentTime = 0;
    videoPlayer.removeAttribute("src");
  }
});

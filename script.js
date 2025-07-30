document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("videoModal");
  const videoPlayer = document.getElementById("videoPlayer");
  const closeBtn = modal.querySelector(".close");
  const videoContainer = document.getElementById("videoGrid");

  const videoCount = 20;
  const groupSize = 10;
  let currentSlide = 0;

  function renderSlide(index) {
    videoContainer.innerHTML = "";
    const start = index * groupSize;
    const end = start + groupSize;

    for (let i = start + 1; i <= Math.min(end, videoCount); i++) {
      const box = document.createElement("div");
      box.className = "box";
      box.dataset.video = `video${i}.mp4`;
      box.innerHTML = `
              <video
                src="/video/video${i}.mp4"
                poster="/thumbnail/video${i}.webp"
                preload="none"
                muted
                playsinline
                loading="lazy"
                class="w-full h-full object-cover"
                onerror="this.closest('.box').style.display='none';"
              ></video>
            `;
      videoContainer.appendChild(box);
    }
  }
  renderSlide(currentSlide);

  let touchStartX = 0;
  let touchMoveX = 0;
  let isSwiping = false;

  videoContainer.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
    isSwiping = false;
  });

  videoContainer.addEventListener("touchmove", (e) => {
    touchMoveX = e.touches[0].clientX;
    isSwiping = true;
  });

  videoContainer.addEventListener("touchend", () => {
    if (!isSwiping) return;

    const diff = touchMoveX - touchStartX;
    const threshold = 50;

    if (diff < -threshold && (currentSlide + 1) * groupSize < videoCount) {
      currentSlide++;
      renderSlide(currentSlide);
    } else if (diff > threshold && currentSlide > 0) {
      currentSlide--;
      renderSlide(currentSlide);
    }

    // reset
    touchStartX = 0;
    touchMoveX = 0;
    isSwiping = false;
  });

  // Open modal on click
  videoContainer.addEventListener("click", (e) => {
    const box = e.target.closest(".box");
    if (!box) return;
    videoPlayer.src = "/video/" + box.dataset.video;
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

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("videoModal");
  const videoPlayer = document.getElementById("videoPlayer");
  const closeBtn = modal.querySelector(".close");
  const videoContainer = document.getElementById("videoGrid");
  const prevBtn = document.querySelector(".slide-left");
  const nextBtn = document.querySelector(".slide-right");

  const videoCount = 20; // Change as needed
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
                poster="/thumbnail/video${i}.png"
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

    prevBtn.disabled = currentSlide === 0;
    nextBtn.disabled = (currentSlide + 1) * groupSize >= videoCount;
  }

  renderSlide(currentSlide);

  prevBtn.addEventListener("click", () => {
    if (currentSlide > 0) {
      currentSlide--;
      renderSlide(currentSlide);
    }
  });

  nextBtn.addEventListener("click", () => {
    if ((currentSlide + 1) * groupSize < videoCount) {
      currentSlide++;
      renderSlide(currentSlide);
    }
  });

  // Touch/swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  videoContainer.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  videoContainer.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    const threshold = 50;

    if (diff < -threshold && (currentSlide + 1) * groupSize < videoCount) {
      currentSlide++;
      renderSlide(currentSlide);
    } else if (diff > threshold && currentSlide > 0) {
      currentSlide--;
      renderSlide(currentSlide);
    }
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

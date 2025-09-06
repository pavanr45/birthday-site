

let isBirthdayPlaying = false;
let currentMemoryAudio = null;
let slideshowInterval = null;
let currentSlide = 0;
let isSlideshowPlaying = false;
let isSlideshowMusicPlaying = false;
let allAudios = [];
let allVideos = [];
+
// Initialize all media references
document.addEventListener('DOMContentLoaded', () => {
  allAudios = [
    document.getElementById('birthdayAudio'),
    document.getElementById('memoryAudio1'),
    document.getElementById('memoryAudio2'),
    document.getElementById('memoryAudio3'),
    document.getElementById('slideshowAudio')
  ];
  
  allVideos = document.querySelectorAll('video');
  
  // Set default theme
  document.body.setAttribute('data-theme', 'pink');
  
  // Auto-change theme every 10 seconds (optional)
  // setInterval(autoChangeTheme, 10000);
});

// Welcome confetti on load
window.addEventListener('load', () => {
  setTimeout(() => {
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#ff6b9d', '#c44569', '#f8b500', '#f0932b']
    });
  }, 1000);
  
  setTimeout(() => {
    createFloatingHearts(10);
  }, 2000);
});
// Theme Functions
function changeTheme(theme) {
  document.body.setAttribute('data-theme', theme);

  // Theme change effects
  confetti({
    particleCount: theme === 'rainbow' ? 200 : 120,
    spread: theme === 'rainbow' ? 120 : 80,
    origin: { y: 0.6 },
    colors: getThemeColors(theme)
  });

  // Floating hearts only in romantic themes
  if (theme === 'pink' || theme === 'purple') {
    createFloatingHearts(7);
  }

  // Add glow pulse effect
  document.body.classList.add('theme-glow');
  setTimeout(() => {
    document.body.classList.remove('theme-glow');
  }, 1000);
}

// Updated Color Palettes
function getThemeColors(theme) {
  const colors = {
    pink: ['#ff6b9d', '#c44569', '#f8b500', '#f0932b'],
    blue: ['#4ecdc4', '#45b7d1', '#96ceb4', '#74b9ff'],
    purple: ['#a29bfe', '#6c5ce7', '#fd79a8', '#fdcb6e'],
    green: ['#00b894', '#00a085', '#55a3ff', '#26de81'],
    rainbow: [
      '#ff4f91', // pink
      '#4ecdc4', // aqua
      '#a29bfe', // lavender
      '#00b894', // green
      '#fdcb6e', // gold pastel
      '#ff6b9d', // bright pink
      '#74b9ff'  // bright blue
    ]
  };
  return colors[theme] || colors.pink;
}


// Auto theme cycle
function autoChangeTheme() {
  const themes = ['pink', 'blue', 'purple', 'green', 'rainbow'];
  const currentTheme = document.body.getAttribute('data-theme');
  const currentIndex = themes.indexOf(currentTheme);
  const nextIndex = (currentIndex + 1) % themes.length;
  changeTheme(themes[nextIndex]);
}


// Media Control Functions
function stopAllMedia() {
  // Stop all audio
  allAudios.forEach(audio => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  });
  
  // Stop all videos
  allVideos.forEach(video => {
    video.pause();
    video.currentTime = 0;
  });
  
  // Reset states
  isBirthdayPlaying = false;
  currentMemoryAudio = null;
  isSlideshowMusicPlaying = false;
  
  // Hide music player
  document.getElementById('musicPlayer').classList.remove('show');
  
  // Stop slideshow
  if (slideshowInterval) {
    clearInterval(slideshowInterval);
    slideshowInterval = null;
    isSlideshowPlaying = false;
  }
}

function pauseOtherMedia(currentVideo) {
  // Stop all other videos
  allVideos.forEach(video => {
    if (video !== currentVideo) {
      video.pause();
    }
  });
  
  // Stop all audio
  allAudios.forEach(audio => {
    if (audio) {
      audio.pause();
    }
  });
  
  // Hide music player
  document.getElementById('musicPlayer').classList.remove('show');
  
  // Reset audio states
  isBirthdayPlaying = false;
  currentMemoryAudio = null;
  isSlideshowMusicPlaying = false;
}

// Candle Functions
function blowCandle() {
  const flame = document.getElementById('candle-flame');
  if (flame && flame.style.opacity !== '0') {
    // Blow-out effect
    flame.style.opacity = '0';
    flame.style.transform = 'translateX(-50%) scale(0) rotate(20deg)';
    flame.style.filter = 'blur(6px) brightness(0.6)';
    flame.style.transition = 'all 0.7s ease-out';

    // Play blowing sound
    const blowAudio = document.getElementById('blowAudio');
    if (blowAudio) {
      blowAudio.play().catch(e => console.log('Audio play failed:', e));
    }

    // Confetti celebration
    confetti({
      particleCount: 300,
      spread: 140,
      origin: { y: 0.5 },
      colors: getThemeColors(document.body.getAttribute('data-theme'))
    });

    // Floating hearts
    createFloatingHearts(15);

    // Relight after 5s
    setTimeout(() => {
      flame.style.opacity = '1';
      flame.style.transform = 'translateX(-50%) scale(1) rotate(0deg)';
      flame.style.filter = 'blur(0px) brightness(1)';
      flame.style.transition = 'all 0.6s ease-in';
    }, 5000);
  }
}


// Audio Functions
function toggleBirthdaySong() {
  const audio = document.getElementById("birthdayAudio");
  const player = document.getElementById("musicPlayer");
  
  // Stop other media first
  stopAllOtherMedia(audio);
  
  if (audio.paused) {
    audio.play().then(() => {
      isBirthdayPlaying = true;
      player.classList.add('show');
      document.getElementById('nowPlaying').textContent = '🎵 Happy Birthday Song';
      
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: getThemeColors(document.body.getAttribute('data-theme'))
      });
    }).catch(e => console.log('Audio play failed:', e));
  } else {
    audio.pause();
    audio.currentTime = 0;
    isBirthdayPlaying = false;
    player.classList.remove('show');
  }
}

function playMemorySong(num) {
  const audioId = `memoryAudio${num}`;
  const audio = document.getElementById(audioId);
  const player = document.getElementById("musicPlayer");

  // Stop other media first
  stopAllOtherMedia(audio);

  if (audio.paused) {
    audio.play().then(() => {
      currentMemoryAudio = audio;
      player.classList.add('show');
      document.getElementById('nowPlaying').textContent = `🎶 Memory Song ${num}`;
      
      confetti({
        particleCount: 100,
        spread: 60,
        origin: { y: 0.7 },
        colors: getThemeColors(document.body.getAttribute('data-theme'))
      });
      
      createFloatingHearts(5);
    }).catch(e => console.log('Audio play failed:', e));
  } else {
    audio.pause();
    audio.currentTime = 0;
    currentMemoryAudio = null;
    player.classList.remove('show');
  }
}

function stopAllOtherMedia(currentAudio) {
  // Stop all other audio
  allAudios.forEach(audio => {
    if (audio && audio !== currentAudio) {
      audio.pause();
      audio.currentTime = 0;
    }
  });
  
  // Stop all videos
  allVideos.forEach(video => {
    video.pause();
  });
  
  // Reset states for other audio
  if (currentAudio !== document.getElementById('birthdayAudio')) {
    isBirthdayPlaying = false;
  }
  if (currentAudio !== document.getElementById('slideshowAudio')) {
    isSlideshowMusicPlaying = false;
  }
}

// Slideshow Functions
function changeSlide(direction) {
  const slides = document.querySelectorAll('.slide');
  slides[currentSlide].classList.remove('active');
  
  currentSlide += direction;
  if (currentSlide >= slides.length) currentSlide = 0;
  if (currentSlide < 0) currentSlide = slides.length - 1;
  
  slides[currentSlide].classList.add('active');
}

function toggleSlideshow() {
  const btn = event.target;
  
  if (isSlideshowPlaying) {
    clearInterval(slideshowInterval);
    slideshowInterval = null;
    isSlideshowPlaying = false;
    btn.textContent = '▶️ Start Slideshow';
  } else {
    slideshowInterval = setInterval(() => {
      changeSlide(1);
    }, 3000);
    isSlideshowPlaying = true;
    btn.textContent = '⏸️ Pause Slideshow';
    
    // Confetti on slideshow start
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: getThemeColors(document.body.getAttribute('data-theme'))
    });
  }
}

function toggleSlideshowMusic() {
  const audio = document.getElementById('slideshowAudio');
  const player = document.getElementById('musicPlayer');
  
  // Stop other media first
  stopAllOtherMedia(audio);
  
  if (audio.paused) {
    audio.play().then(() => {
      isSlideshowMusicPlaying = true;
      player.classList.add('show');
      document.getElementById('nowPlaying').textContent = '🎵 Slideshow Music';
      
      createFloatingHearts(8);
    }).catch(e => console.log('Audio play failed:', e));
  } else {
    audio.pause();
    audio.currentTime = 0;
    isSlideshowMusicPlaying = false;
    player.classList.remove('show');
  }
}

// Hidden Message Functions
function showHiddenMessage() {
  const modal = document.getElementById('hiddenMessageModal');
  modal.classList.add('show');
  
  // Load random API image (placeholder)
  loadAPIImage();
  
  // Special confetti for hidden message
  confetti({
    particleCount: 200,
    spread: 100,
    origin: { y: 0.5 },
    colors: getThemeColors(document.body.getAttribute('data-theme')),
    shapes: ['heart']
  });
  
  createFloatingHearts(20);
}

function closeHiddenMessage() {
  const modal = document.getElementById('hiddenMessageModal');
  modal.classList.remove('show');
}
function loadAPIImage() {
  const images = [
    {
      src: 'assets/special-msg.jpg',
      caption: 'Special Memory 💖'
    },
    {
      src: 'assets/special-msg.jpg',
      caption: 'Beautiful Moments ✨'
    },
    {
      src: 'assets/special-msg.jpg',
      caption: 'Friendship Forever 🎈'
    },
    {
      src: 'assets/special-msg.jpg',
      caption: 'Happy Birthday 🎂'
    }
  ];

  const randomImage = images[Math.floor(Math.random() * images.length)];
  const imageElement = document.getElementById('apiImage');
  const captionElement = document.getElementById('apiCaption');

  imageElement.classList.remove('loaded');
  imageElement.src = randomImage.src;

  // Set caption (if you want to display it somewhere)
  if (captionElement) {
    captionElement.textContent = randomImage.caption;
  }

  imageElement.onload = () => {
    imageElement.classList.add('loaded');
  };
}

function createRain() {
  const rainLayer = document.getElementById('rainLayer');
  rainLayer.innerHTML = '';
  for (let i = 0; i < 40; i++) {
    const drop = document.createElement('span');
    drop.style.left = `${Math.random() * 100}%`;
    drop.style.animationDuration = `${Math.random() * 1 + 0.5}s`;
    drop.style.animationDelay = `${Math.random()}s`;
    rainLayer.appendChild(drop);
  }
}

function showHiddenMessage() {
  document.getElementById('hiddenMessageModal').classList.add('show');
  createRain();
}
function closeHiddenMessage() {
  document.getElementById('hiddenMessageModal').classList.remove('show');
}

// Other Functions
function createConfettiShow() {
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { 
          x: Math.random(),
          y: Math.random() * 0.5 + 0.3
        },
        colors: getThemeColors(document.body.getAttribute('data-theme'))
      });
    }, i * 200);
  }
  
  createFloatingHearts(20);
}

function createFloatingHearts(count) {
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const heart = document.createElement('div');
      heart.className = 'floating-hearts';
      heart.innerHTML = ['💖', '💕', '💗', '💝', '🎈', '✨'][Math.floor(Math.random() * 6)];
      heart.style.left = Math.random() * 100 + 'vw';
      heart.style.bottom = '0px';
      document.body.appendChild(heart);
      
      setTimeout(() => heart.remove(), 3000);
    }, i * 100);
  }
}

function openPhotoModal(img) {
  const modal = document.getElementById('photoModal');
  const modalImg = document.getElementById('modalImage');
  modal.style.display = 'flex';
  modalImg.src = img.src;
  modalImg.alt = img.alt;
}

function closePhotoModal() {
  document.getElementById('photoModal').style.display = 'none';
}

// Click anywhere for sparkle effect
document.addEventListener('click', function(e) {
  const sparkle = document.createElement('div');
  sparkle.innerHTML = '✨';
  sparkle.style.position = 'fixed';
  sparkle.style.left = e.clientX + 'px';
  sparkle.style.top = e.clientY + 'px';
  sparkle.style.fontSize = '1.5rem';
  sparkle.style.pointerEvents = 'none';
  sparkle.style.animation = 'floatUp 1s ease-out forwards';
  sparkle.style.zIndex = '1000';
  document.body.appendChild(sparkle);
  
  setTimeout(() => sparkle.remove(), 1000);
});

// Random confetti every 30 seconds
setInterval(() => {
  if (Math.random() > 0.8) {
    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.8 },
      colors: getThemeColors(document.body.getAttribute('data-theme'))
    });
  }
}, 30000);

// Auto slideshow on load (after 5 seconds)
setTimeout(() => {
  if (!isSlideshowPlaying) {
    const slideshowBtn = document.querySelector('.slide-controls .btn-secondary');
    if (slideshowBtn) {
      slideshowBtn.click();
    }
  }
}, 5000);

function createBalloons(count) {
  const balloons = ['💖', '💕', '💝', '🎈', '✨', '🎉', '💗'];
  
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const balloon = document.createElement('div');
      balloon.className = 'balloon';
      balloon.textContent = balloons[Math.floor(Math.random() * balloons.length)];
      balloon.style.left = Math.random() * 100 + 'vw';
      balloon.style.animationDuration = (Math.random() * 5 + 5) + 's';
      document.body.appendChild(balloon);

      setTimeout(() => balloon.remove(), 10000);
    }, i * 300);
  }
}

// Trigger balloons every 10 seconds
setInterval(() => createBalloons(8), 10000);

// Music Play/Pause
 const song = document.getElementById("specialSong");
  const musicBtn = document.getElementById("musicBtn");

  let isPlaying = false;

  // Play / Pause toggle
  musicBtn.addEventListener("click", () => {
    if (isPlaying) {
      song.pause();
      musicBtn.textContent = "🎵 Play";
    } else {
      song.play();
      musicBtn.textContent = "⏸ Pause";
    }
    isPlaying = !isPlaying;
  });

  // Function when modal closes
  function closeHiddenMessage() {
    document.getElementById("hiddenMessageModal").style.display = "none";
    song.pause();
    song.currentTime = 0; // reset music
    musicBtn.textContent = "🎵 Play";
    isPlaying = false;
  }

  // Stop music if user navigates away (back/refresh)
  window.addEventListener("beforeunload", () => {
    song.pause();
    song.currentTime = 0;
  });

  function showSpecialSurprise() {
  document.getElementById("specialSurpriseModal").style.display = "block";
}
function closeSpecialSurprise() {
  document.getElementById("specialSurpriseModal").style.display = "none";
}



// Show Hidden Message
function showHiddenMessage() {
  const modal = document.getElementById("hiddenMessageModal");
  modal.classList.add("show");
  createRain();
}

// Close Hidden Message
function closeHiddenMessage() {
  const modal = document.getElementById("hiddenMessageModal");
  modal.classList.remove("show");
  song.pause();
  song.currentTime = 0;
  musicBtn.textContent = "🎵 Play";
  isPlaying = false;
}

// Show Special Surprise
function showSpecialSurprise() {
  const modal = document.getElementById("specialSurpriseModal");
  modal.classList.add("show");
}

// Close Special Surprise
function closeSpecialSurprise() {
  const modal = document.getElementById("specialSurpriseModal");
  modal.classList.remove("show");
}
const hamburger = document.querySelector(".hamburger");
const themeMenu = document.querySelector(".theme-selector");

hamburger.addEventListener("click", () => {
  themeMenu.classList.toggle("show");
});

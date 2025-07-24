// Confetti on load
window.addEventListener('load', () => {
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 },
  });
});

// Candle blow effect
document.addEventListener('DOMContentLoaded', () => {
  const flame = document.createElement('div');
  flame.id = 'candle-flame';
  flame.style.width = '20px';
  flame.style.height = '40px';
  flame.style.background = 'orange';
  flame.style.borderRadius = '50%';
  flame.style.boxShadow = '0 0 15px orange';
  flame.style.position = 'absolute';
  flame.style.top = '-50px';
  flame.style.left = '50%';
  flame.style.transform = 'translateX(-50%)';
  document.querySelector('.candle').appendChild(flame);

  flame.addEventListener('click', () => {
    flame.style.background = 'transparent';
    flame.style.boxShadow = 'none';
    flame.style.transition = '0.5s ease-out';
    const blowAudio = new Audio('assets/blow.mp3');
    blowAudio.play();

    confetti({
      particleCount: 100,
      spread: 60,
      origin: { y: 0.5 }
    });
  });
});

// Birthday song toggle
let isBirthdayPlaying = false;
const birthdayAudio = document.getElementById('birthdayAudio');
function toggleBirthdaySong() {
  const audio = document.getElementById("birthdayAudio");
  if (audio.paused) {
    audio.play();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  } else {
    audio.pause();
    audio.currentTime = 0;
  }
}

function playMemorySong(num) {
  const audioId = `memoryAudio${num}`;
  const audio = document.getElementById(audioId);

  if (audio.paused) {
    audio.play();
    confetti({
      particleCount: 80,
      spread: 100,
      origin: { y: 0.7 }
    });
  } else {
    audio.pause();
    audio.currentTime = 0;
  }
}


function stopAllMemorySongs() {
  for (let i = 1; i <= 3; i++) {
    const audio = document.getElementById(`memoryAudio${i}`);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }

  birthdayAudio.pause();
  birthdayAudio.currentTime = 0;
  isBirthdayPlaying = false;
}

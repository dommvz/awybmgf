// Yes page - import styles and confetti
import './styles.css';
import confetti from 'canvas-confetti';

// Celebrate with confetti when page loads!
console.log('🎉 Success!');

// Initial confetti burst
setTimeout(() => {
  // Center burst
  confetti({
    particleCount: 150,
    spread: 100,
    origin: { y: 0.6 },
    colors: ['#FF63B9', '#FCD6F3', '#F4E7FF', '#FFB6D9', '#FF1493']
  });
}, 100);

// Side confetti bursts
setTimeout(() => {
  confetti({
    particleCount: 100,
    angle: 60,
    spread: 70,
    origin: { x: 0, y: 0.6 },
    colors: ['#FF63B9', '#FCD6F3', '#F4E7FF', '#FFB6D9', '#FF1493']
  });
  
  confetti({
    particleCount: 100,
    angle: 120,
    spread: 70,
    origin: { x: 1, y: 0.6 },
    colors: ['#FF63B9', '#FCD6F3', '#F4E7FF', '#FFB6D9', '#FF1493']
  });
}, 300);

// Continuous celebration
let duration = 3 * 1000;
let animationEnd = Date.now() + duration;

(function frame() {
  confetti({
    particleCount: 3,
    angle: 60,
    spread: 55,
    origin: { x: 0, y: 0.8 },
    colors: ['#FF63B9', '#FCD6F3', '#F4E7FF', '#FFB6D9', '#FF1493']
  });
  
  confetti({
    particleCount: 3,
    angle: 120,
    spread: 55,
    origin: { x: 1, y: 0.8 },
    colors: ['#FF63B9', '#FCD6F3', '#F4E7FF', '#FFB6D9', '#FF1493']
  });

  if (Date.now() < animationEnd) {
    requestAnimationFrame(frame);
  }
}());

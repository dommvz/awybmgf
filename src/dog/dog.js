// Dog eye tracking functionality

let isTracking = false;

export function initDogEyes() {
  const card = document.querySelector('.card');
  
  if (!card) return;

  // Handle pointer events (works for both mouse and touch)
  card.addEventListener('pointermove', handlePointerMove);
  card.addEventListener('pointerdown', () => {
    isTracking = true;
  });
  card.addEventListener('pointerup', () => {
    isTracking = false;
  });
  card.addEventListener('pointerleave', () => {
    isTracking = false;
  });
}

function handlePointerMove(e) {
  // On desktop, always track. On mobile, only track while touching
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  
  if (isMobile && !isTracking) {
    return;
  }

  const mouseX = e.clientX;
  const mouseY = e.clientY;
  
  moveEyes(mouseX, mouseY);
}

function moveEyes(mouseX, mouseY) {
  const eyes = document.querySelectorAll(".eye");

  for (let i = 0; i < eyes.length; i++) {
    const rect = eyes[i].getBoundingClientRect();
    const centerX = rect.left + (rect.width / 2);
    const centerY = rect.top + (rect.height / 2);
    
    const radius = Math.atan2(mouseX - centerX, mouseY - centerY);
    const degree = (radius * (180 / Math.PI) * -1);
    
    eyes[i].style.transform = `rotate(${degree}deg)`;
  }
}

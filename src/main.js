/**
 * Girlfriend Website - Main Page Logic
 * 
 * HOW TO RUN:
 * 1. npm install
 * 2. npm run dev
 * 3. Open browser to localhost:5173
 * 
 * HOW TO REPLACE THE GIF:
 * - Edit yes.html and change the src attribute in the <img> tag
 * - You can use a local file in /public/ or an external URL
 * 
 * HOW TO TWEAK NO BUTTON DIFFICULTY:
 * - PROXIMITY_THRESHOLD: Distance in pixels when button moves (default: 120 desktop, 80 mobile)
 * - SAFE_PADDING: Padding from card edges (default: 80 desktop, 40 mobile)
 * - Increase threshold = harder to click (moves away sooner)
 * - Decrease padding = button can move closer to edges
 */

import './styles.css';
import './dog/dog.css';
import { initDogEyes } from './dog/dog.js';
import confetti from 'canvas-confetti';

// Configuration
const PROXIMITY_THRESHOLD_DESKTOP = 150;
const PROXIMITY_THRESHOLD_MOBILE = 80;
const SAFE_PADDING_DESKTOP = 60;
const SAFE_PADDING_MOBILE = 40;
const MOVE_DISTANCE = 200; // How far the button moves away
const MOVEMENT_COOLDOWN = 300; // Milliseconds before button can move again

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initDogEyes();
  initNoButton();
  initYesButton();
});

function initNoButton() {
  const noButton = document.querySelector('.btn-no');
  const card = document.querySelector('.card');
  
  if (!noButton || !card) return;

  const isMobile = () => window.matchMedia('(max-width: 768px)').matches;
  let isMoving = false; // Cooldown flag

  // Ensure button is visible and positioned
  noButton.style.display = 'inline-flex';
  noButton.style.position = 'absolute';
  noButton.style.transition = 'left 0.3s ease-out, top 0.3s ease-out';
  
  // Position NO button initially (with slight delay to ensure layout is ready)
  setTimeout(() => {
    positionNoButton();
  }, 10);

  // Desktop: track mouse movement
  card.addEventListener('mousemove', (e) => {
    if (isMobile() || isMoving) return;
    
    const distance = getDistance(e.clientX, e.clientY, noButton);
    const threshold = PROXIMITY_THRESHOLD_DESKTOP;
    
    if (distance < threshold) {
      isMoving = true;
      moveNoButtonAwayFromCursor(e.clientX, e.clientY);
      
      // Reset cooldown after movement completes
      setTimeout(() => {
        isMoving = false;
      }, MOVEMENT_COOLDOWN);
    }
  });

  // Mobile: move on touch
  noButton.addEventListener('touchstart', (e) => {
    e.preventDefault();
    moveNoButtonRandom();
  }, { passive: false });

  // Prevent click on NO button (extra safety)
  noButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isMobile()) {
      moveNoButtonRandom();
    }
  });

  // Reposition on window resize
  window.addEventListener('resize', () => {
    positionNoButton();
  });

  function getDistance(x, y, element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    return Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
  }

  function positionNoButton() {
    const mobile = isMobile();
    const yesButton = document.querySelector('.btn-yes');
    
    if (!yesButton) return;
    
    const cardRect = card.getBoundingClientRect();
    const yesRect = yesButton.getBoundingClientRect();
    
    // Calculate YES button position relative to card
    const yesLeftInCard = yesRect.left - cardRect.left;
    const yesRightInCard = yesRect.right - cardRect.left;
    const yesTopInCard = yesRect.top - cardRect.top;
    const yesBottomInCard = yesRect.bottom - cardRect.top;
    const yesCenterYInCard = yesTopInCard + (yesRect.height / 2);
    
    // Position NO button relative to card
    noButton.style.position = 'absolute';
    
    if (mobile) {
      // Mobile: position below YES button, centered
      noButton.style.left = '50%';
      noButton.style.transform = 'translateX(-50%)';
      noButton.style.top = `${yesBottomInCard + 20}px`;
    } else {
      // Desktop: position to the right of YES button
      noButton.style.left = `${yesRightInCard + 30}px`;
      noButton.style.top = `${yesCenterYInCard}px`;
      noButton.style.transform = 'translateY(-50%)';
    }
  }

  function moveNoButtonAwayFromCursor(cursorX, cursorY) {
    const cardRect = card.getBoundingClientRect();
    const buttonRect = noButton.getBoundingClientRect();
    
    // Get button center in screen coordinates
    const buttonCenterX = buttonRect.left + buttonRect.width / 2;
    const buttonCenterY = buttonRect.top + buttonRect.height / 2;
    
    // Calculate direction vector from cursor to button
    let deltaX = buttonCenterX - cursorX;
    let deltaY = buttonCenterY - cursorY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Normalize the direction vector
    let dirX = deltaX / distance;
    let dirY = deltaY / distance;
    
    // Add randomness to direction (±30 degrees)
    const randomAngle = (Math.random() - 0.5) * Math.PI / 3; // ±30 degrees in radians
    const cosAngle = Math.cos(randomAngle);
    const sinAngle = Math.sin(randomAngle);
    
    // Rotate the direction vector
    const rotatedDirX = dirX * cosAngle - dirY * sinAngle;
    const rotatedDirY = dirX * sinAngle + dirY * cosAngle;
    
    dirX = rotatedDirX;
    dirY = rotatedDirY;
    
    // Calculate current position relative to card
    const currentX = buttonRect.left - cardRect.left;
    const currentY = buttonRect.top - cardRect.top;
    
    const padding = SAFE_PADDING_DESKTOP;
    const minX = padding;
    const maxX = cardRect.width - buttonRect.width - padding;
    const minY = padding;
    const maxY = cardRect.height - buttonRect.height - padding;
    
    // Check if button is near edges (within 100px)
    const nearLeftEdge = currentX < 100;
    const nearRightEdge = currentX > cardRect.width - buttonRect.width - 100;
    const nearTopEdge = currentY < 100;
    const nearBottomEdge = currentY > cardRect.height - buttonRect.height - 100;
    
    // If cornered, add perpendicular movement to escape
    if ((nearLeftEdge || nearRightEdge) && (nearTopEdge || nearBottomEdge)) {
      // In a corner - add strong perpendicular movement
      const perpX = -dirY * 0.6; // Perpendicular vector
      const perpY = dirX * 0.6;
      dirX += perpX;
      dirY += perpY;
      
      // Normalize again
      const newLength = Math.sqrt(dirX * dirX + dirY * dirY);
      dirX /= newLength;
      dirY /= newLength;
    } else if (nearLeftEdge && dirX < 0) {
      // Near left edge and trying to go more left - redirect right
      dirX = Math.abs(dirX) + 0.5;
    } else if (nearRightEdge && dirX > 0) {
      // Near right edge and trying to go more right - redirect left
      dirX = -Math.abs(dirX) - 0.5;
    } else if (nearTopEdge && dirY < 0) {
      // Near top edge and trying to go more up - redirect down
      dirY = Math.abs(dirY) + 0.5;
    } else if (nearBottomEdge && dirY > 0) {
      // Near bottom edge and trying to go more down - redirect up
      dirY = -Math.abs(dirY) - 0.5;
    }
    
    // Calculate new position by moving away from cursor
    let newScreenX = buttonCenterX + dirX * MOVE_DISTANCE;
    let newScreenY = buttonCenterY + dirY * MOVE_DISTANCE;
    
    // Convert to card-relative coordinates
    let newX = newScreenX - cardRect.left - buttonRect.width / 2;
    let newY = newScreenY - cardRect.top - buttonRect.height / 2;
    
    // Clamp to bounds
    newX = Math.max(minX, Math.min(newX, maxX));
    newY = Math.max(minY, Math.min(newY, maxY));
    
    // Check if new position overlaps with YES button
    const yesButton = document.querySelector('.btn-yes');
    if (yesButton) {
      const yesRect = yesButton.getBoundingClientRect();
      const yesLeftInCard = yesRect.left - cardRect.left;
      const yesRightInCard = yesRect.right - cardRect.left;
      const yesTopInCard = yesRect.top - cardRect.top;
      const yesBottomInCard = yesRect.bottom - cardRect.top;
      
      const noLeft = newX;
      const noRight = newX + buttonRect.width;
      const noTop = newY;
      const noBottom = newY + buttonRect.height;
      
      const buffer = 30;
      const overlapsX = noRight > (yesLeftInCard - buffer) && noLeft < (yesRightInCard + buffer);
      const overlapsY = noBottom > (yesTopInCard - buffer) && noTop < (yesBottomInCard + buffer);
      
      // If overlaps, try to move to opposite side
      if (overlapsX && overlapsY) {
        // Try moving to a different area
        if (newX < cardRect.width / 2) {
          // Move to right side
          newX = Math.max(yesRightInCard + buffer, newX);
        } else {
          // Move to left side
          newX = Math.min(yesLeftInCard - buttonRect.width - buffer, newX);
        }
        
        // Add some vertical randomness too
        const verticalRandomness = (Math.random() - 0.5) * 100;
        newY += verticalRandomness;
        
        // Clamp again after adjustment
        newX = Math.max(minX, Math.min(newX, maxX));
        newY = Math.max(minY, Math.min(newY, maxY));
      }
    }
    
    // Apply new position with smooth transition
    noButton.style.left = `${newX}px`;
    noButton.style.top = `${newY}px`;
    noButton.style.transform = 'none';
  }
  
  function moveNoButtonRandom() {
    // For mobile: random movement
    const cardRect = card.getBoundingClientRect();
    const buttonRect = noButton.getBoundingClientRect();
    const padding = SAFE_PADDING_MOBILE;
    
    const yesButton = document.querySelector('.btn-yes');
    const yesRect = yesButton.getBoundingClientRect();
    const yesLeftInCard = yesRect.left - cardRect.left;
    const yesRightInCard = yesRect.right - cardRect.left;
    const yesTopInCard = yesRect.top - cardRect.top;
    const yesBottomInCard = yesRect.bottom - cardRect.top;
    
    let newX, newY;
    let attempts = 0;
    const maxAttempts = 50;
    
    do {
      newX = padding + Math.random() * (cardRect.width - buttonRect.width - padding * 2);
      newY = padding + Math.random() * (cardRect.height - buttonRect.height - padding * 2);
      
      const noLeft = newX;
      const noRight = newX + buttonRect.width;
      const noTop = newY;
      const noBottom = newY + buttonRect.height;
      
      const buffer = 30;
      const overlapsX = noRight > (yesLeftInCard - buffer) && noLeft < (yesRightInCard + buffer);
      const overlapsY = noBottom > (yesTopInCard - buffer) && noTop < (yesBottomInCard + buffer);
      
      if (!overlapsX || !overlapsY) break;
      attempts++;
    } while (attempts < maxAttempts);
    
    noButton.style.left = `${newX}px`;
    noButton.style.top = `${newY}px`;
    noButton.style.transform = 'none';
  }
}

function initYesButton() {
  const yesButton = document.querySelector('.btn-yes');
  
  if (!yesButton) return;
  
  // Trigger confetti on click
  yesButton.addEventListener('click', (e) => {
    // Fire confetti from button position
    const rect = yesButton.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    
    // Multiple confetti bursts for extra celebration
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x, y },
      colors: ['#FF63B9', '#FCD6F3', '#F4E7FF', '#FFB6D9', '#FF1493']
    });
    
    // Second burst with different timing
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x, y },
        colors: ['#FF63B9', '#FCD6F3', '#F4E7FF', '#FFB6D9', '#FF1493']
      });
    }, 100);
    
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x, y },
        colors: ['#FF63B9', '#FCD6F3', '#F4E7FF', '#FFB6D9', '#FF1493']
      });
    }, 200);
  });
}

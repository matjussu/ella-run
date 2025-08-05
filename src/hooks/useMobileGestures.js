/**
 * Mobile Gestures Hook
 * 
 * Custom hook for handling mobile-specific gestures and interactions
 */

import { useEffect, useCallback, useRef } from 'react';

/**
 * Hook for mobile gesture handling
 * @param {Object} options - Configuration options
 * @returns {Object} - Gesture handlers and utilities
 */
export const useMobileGestures = (options = {}) => {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onPullToRefresh,
    swipeThreshold = 50,
    pullThreshold = 100
  } = options;

  // Touch state using refs
  const touchStart = useRef({ x: 0, y: 0 });
  const touchEnd = useRef({ x: 0, y: 0 });
  const isPulling = useRef(false);

  // Handle touch start
  const handleTouchStart = useCallback((e) => {
    touchStart.current.x = e.touches[0].clientX;
    touchStart.current.y = e.touches[0].clientY;
  }, []);

  // Handle touch move
  const handleTouchMove = useCallback((e) => {
    touchEnd.current.x = e.touches[0].clientX;
    touchEnd.current.y = e.touches[0].clientY;

    // Pull to refresh detection
    if (onPullToRefresh && window.scrollY === 0) {
      const pullDistance = touchEnd.current.y - touchStart.current.y;
      if (pullDistance > pullThreshold && !isPulling.current) {
        isPulling.current = true;
        // Add visual feedback for pull to refresh
        document.body.style.transform = `translateY(${Math.min(pullDistance - pullThreshold, 50)}px)`;
      }
    }
  }, [onPullToRefresh, pullThreshold]);

  // Handle touch end
  const handleTouchEnd = useCallback(() => {
    const deltaX = touchEnd.current.x - touchStart.current.x;
    const deltaY = touchEnd.current.y - touchStart.current.y;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Reset pull to refresh
    if (isPulling.current) {
      document.body.style.transform = '';
      if (onPullToRefresh) {
        onPullToRefresh();
      }
      isPulling.current = false;
    }

    // Determine swipe direction
    if (Math.max(absDeltaX, absDeltaY) > swipeThreshold) {
      if (absDeltaX > absDeltaY) {
        // Horizontal swipe
        if (deltaX > 0 && onSwipeRight) {
          onSwipeRight();
        } else if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft();
        }
      } else {
        // Vertical swipe
        if (deltaY > 0 && onSwipeDown) {
          onSwipeDown();
        } else if (deltaY < 0 && onSwipeUp) {
          onSwipeUp();
        }
      }
    }

    // Reset values
    touchStart.current = { x: 0, y: 0 };
    touchEnd.current = { x: 0, y: 0 };
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, onPullToRefresh, swipeThreshold]);

  // Prevent scroll bounce on iOS
  const preventBounce = useCallback((e) => {
    if (e.target === document.body) {
      e.preventDefault();
    }
  }, []);

  // Setup event listeners
  useEffect(() => {
    // Only add touch listeners on mobile devices
    if ('ontouchstart' in window) {
      document.addEventListener('touchstart', handleTouchStart, { passive: false });
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd, { passive: false });
      
      // Prevent iOS bounce
      document.addEventListener('touchmove', preventBounce, { passive: false });
    }

    return () => {
      if ('ontouchstart' in window) {
        document.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
        document.removeEventListener('touchmove', preventBounce);
      }
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, preventBounce]);

  // Utility functions
  const addHapticFeedback = useCallback((pattern = [100]) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }, []);

  const isTouch = useCallback(() => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }, []);

  const isMobile = useCallback(() => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }, []);

  return {
    addHapticFeedback,
    isTouch,
    isMobile,
    // Touch event handlers for custom components
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd
    }
  };
};

export default useMobileGestures;
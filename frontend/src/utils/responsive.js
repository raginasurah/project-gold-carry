// Responsive utility functions and breakpoint helpers
import { useState, useEffect } from 'react';

export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
};

// Hook to detect mobile/tablet
export const useResponsive = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    width: windowSize.width,
    height: windowSize.height,
    isMobile: windowSize.width < 768,
    isTablet: windowSize.width >= 768 && windowSize.width < 1024,
    isDesktop: windowSize.width >= 1024,
    isMobileOrTablet: windowSize.width < 1024
  };
};

// Responsive class helpers
export const responsiveClasses = {
  // Grid layouts
  grid: {
    mobile: 'grid-cols-1',
    tablet: 'md:grid-cols-2',
    desktop: 'lg:grid-cols-3 xl:grid-cols-4',
    responsive: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  },
  
  // Spacing
  padding: {
    mobile: 'p-4',
    tablet: 'md:p-6',
    desktop: 'lg:p-8',
    responsive: 'p-4 md:p-6 lg:p-8'
  },
  
  // Typography
  text: {
    title: 'text-xl md:text-2xl lg:text-3xl',
    subtitle: 'text-base md:text-lg',
    body: 'text-sm md:text-base',
    small: 'text-xs md:text-sm'
  },
  
  // Flex layouts
  flex: {
    mobileStack: 'flex flex-col md:flex-row',
    mobileReverse: 'flex flex-col-reverse md:flex-row',
    centerMobile: 'flex flex-col items-center md:flex-row md:justify-between'
  },
  
  // Common responsive patterns
  card: 'p-4 md:p-6 rounded-lg shadow-sm border',
  button: 'px-4 py-2 md:px-6 md:py-3 rounded-lg font-medium transition-colors',
  input: 'px-3 py-2 md:px-4 md:py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent'
};

// Mobile-specific utilities
export const mobileOptimizations = {
  // Touch-friendly tap targets (minimum 44px)
  touchTarget: 'min-h-[44px] min-w-[44px]',
  
  // Safe area handling for iOS
  safeArea: 'pb-safe-area-inset-bottom',
  
  // Prevent zoom on iOS
  preventZoom: 'touch-manipulation',
  
  // Sticky headers with proper z-index
  stickyHeader: 'sticky top-0 z-40 bg-white shadow-sm',
  
  // Bottom navigation bar
  bottomNav: 'fixed bottom-0 left-0 right-0 z-50 bg-white border-t',
  
  // Modal overlays
  modalOverlay: 'fixed inset-0 z-50 bg-black bg-opacity-50',
  mobileModal: 'fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-lg md:relative md:inset-auto md:rounded-lg md:max-w-md md:mx-auto'
};

// Responsive chart configurations
export const chartResponsive = {
  mobile: {
    width: '100%',
    height: 200,
    margin: { top: 5, right: 5, left: 5, bottom: 5 }
  },
  tablet: {
    width: '100%',
    height: 250,
    margin: { top: 10, right: 10, left: 10, bottom: 10 }
  },
  desktop: {
    width: '100%',
    height: 300,
    margin: { top: 20, right: 30, left: 20, bottom: 5 }
  }
};

// Table responsive patterns
export const tableResponsive = {
  // Stack table on mobile
  mobileStack: {
    container: 'block md:table w-full',
    row: 'block md:table-row border-b border-gray-200 md:border-none',
    cell: 'block md:table-cell py-2 md:py-4 px-0 md:px-4',
    label: 'inline-block w-1/3 font-medium text-gray-500 md:hidden'
  },
  
  // Horizontal scroll on mobile
  mobileScroll: {
    container: 'overflow-x-auto',
    table: 'min-w-full divide-y divide-gray-200',
    cell: 'whitespace-nowrap px-4 py-2'
  }
};

export default {
  BREAKPOINTS,
  useResponsive,
  responsiveClasses,
  mobileOptimizations,
  chartResponsive,
  tableResponsive
};
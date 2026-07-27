import React from 'react';

export default function MainSkeleton() {
  return (
    <div
      className={`
        w-[90%] h-[70vh] mx-auto my-4 rounded-2xl 
        bg-gradient-to-r from-gray-500 via-gray-200 to-gray-700 /* Base gradient */
        animate-pulse /* Tailwind's built-in pulse animation */
        /* Custom wave animation properties */
        relative overflow-hidden /* Essential for clipping the gradient */
        before:content-[''] /* Pseudo-element for the wave */
        before:absolute before:inset-0
        before:bg-gradient-to-r before:from-transparent before:via-white before:to-transparent /* Wave overlay */
        before:animate-wave-motion /* Custom animation for the wave */
      `}
    >
    </div>
  );
}

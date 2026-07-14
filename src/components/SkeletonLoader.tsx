/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';

export function MenuItemSkeleton() {
  return (
    <div className="flex flex-col md:flex-row gap-6 p-5 rounded-2xl bg-surface-container-lowest-cafe border border-outline-cafe/10 shadow-sm relative overflow-hidden">
      {/* Shining effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
      />
      {/* Image skeleton */}
      <div className="w-full md:w-32 h-32 rounded-xl bg-surface-container-high-cafe shrink-0 animate-pulse" />
      
      {/* Content skeleton */}
      <div className="flex-grow flex flex-col justify-between py-1 text-left space-y-3">
        <div>
          <div className="flex justify-between items-baseline gap-4">
            <div className="h-5 bg-surface-container-high-cafe rounded w-1/3 animate-pulse" />
            <div className="h-5 bg-surface-container-high-cafe rounded w-16 animate-pulse" />
          </div>
          <div className="mt-2 space-y-2">
            <div className="h-3 bg-surface-container-high-cafe rounded w-full animate-pulse" />
            <div className="h-3 bg-surface-container-high-cafe rounded w-5/6 animate-pulse" />
          </div>
        </div>
        <div className="flex justify-between items-center pt-2">
          <div className="h-4 bg-surface-container-high-cafe rounded w-20 animate-pulse" />
          <div className="h-9 bg-surface-container-high-cafe rounded-lg w-28 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function EventCardSkeleton() {
  return (
    <div className="group rounded-2xl border border-outline-cafe/10 bg-surface-container-lowest-cafe overflow-hidden shadow-sm relative text-left">
      {/* Shining effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent z-10"
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
      />
      {/* Image Skeleton */}
      <div className="w-full aspect-[16/9] bg-surface-container-high-cafe animate-pulse" />
      
      {/* Description Skeleton */}
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-4 bg-surface-container-high-cafe rounded-full w-24 animate-pulse" />
          <div className="h-4 bg-surface-container-high-cafe rounded-full w-16 animate-pulse" />
        </div>
        <div className="h-6 bg-surface-container-high-cafe rounded w-2/3 animate-pulse" />
        <div className="space-y-2">
          <div className="h-3 bg-surface-container-high-cafe rounded w-full animate-pulse" />
          <div className="h-3 bg-surface-container-high-cafe rounded w-5/6 animate-pulse" />
        </div>
        <div className="flex justify-between items-center pt-2">
          <div className="h-4 bg-surface-container-high-cafe rounded w-32 animate-pulse" />
          <div className="h-9 bg-surface-container-high-cafe rounded-lg w-24 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

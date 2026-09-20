import React from 'react';
import { X, CheckCircle2, AlertCircle, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-neutral-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h2 className="text-xl font-bold tracking-tight text-black">How to Play</h2>
              <button
                type="button"
                id="btn-close-how-to-play"
                onClick={onClose}
                aria-label="Close rules"
                className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Rules List */}
            <div className="space-y-4 py-4 text-sm text-neutral-600">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-neutral-100 text-neutral-900 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  1
                </div>
                <p>
                  Each <strong className="text-black">winding snake arrow</strong> ends in an arrowhead pointing up, down, left, or right.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-neutral-100 text-neutral-900 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  2
                </div>
                <p>
                  Tap an arrow to launch it. If its forward path from its head to the maze edge is completely unblocked, it escapes off screen!
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-neutral-100 text-neutral-900 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  3
                </div>
                <p>
                  When an arrow escapes, it clears space for other blocked arrows behind it.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                </div>
                <p>
                  Tapping a blocked arrow will bump and cost 1 heart. You have 3 hearts to solve each puzzle!
                </p>
              </div>
            </div>

            <div className="bg-neutral-50 rounded-2xl p-3 border border-neutral-200/80 mb-4 flex items-center gap-2 text-xs text-neutral-700">
              <CheckCircle2 className="w-4 h-4 text-black shrink-0" />
              <span>Every single level is mathematically verified 100% solvable.</span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 bg-black text-white font-semibold text-sm rounded-2xl hover:bg-neutral-800 transition-all cursor-pointer"
            >
              Got it, Let&apos;s Play!
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

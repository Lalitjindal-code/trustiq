'use client';

import React from 'react';
import { LazyMotion, domAnimation } from 'framer-motion';

export const MotionProvider = ({ children }: { children: React.ReactNode }) => {
    return <LazyMotion features={domAnimation} strict>{children}</LazyMotion>;
};

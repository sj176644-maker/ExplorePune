'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Box, Gamepad2 } from 'lucide-react';
import { Sinhagad2DGame } from './Sinhagad2DGame';

export function SinhagadExperienceContainer() {
  const [activeMode, setActiveMode] = useState<'3d' | '2d'>('3d');

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        backgroundColor: '#020617',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Top Experience Navigation Bar: 54px high */}
      <header
        style={{
          height: '54px',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          backgroundColor: 'rgba(2, 6, 23, 0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(245, 158, 11, 0.25)',
          zIndex: 10000,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link
            href="/experience"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 600,
              color: '#cbd5e1',
              backgroundColor: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(51, 65, 85, 0.6)',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
          >
            <ArrowLeft style={{ width: '14px', height: '14px' }} />
            <span>Back</span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                color: '#f59e0b',
                fontWeight: 700,
                fontSize: '14px',
                letterSpacing: '0.5px',
                fontFamily: 'serif',
              }}
            >
              SINHAGAD FORT
            </span>
            <span style={{ color: '#64748b', fontSize: '12px' }}>|</span>
            <span
              style={{
                color: '#94a3b8',
                fontSize: '12px',
                fontFamily: 'monospace',
              }}
            >
              18.3664° N, 73.7558° E • 1,312m MSL
            </span>
          </div>
        </div>

        {/* 3D vs 2D Mode Switcher */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '3px',
            borderRadius: '12px',
            backgroundColor: '#0f172a',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
          }}
        >
          <button
            onClick={() => setActiveMode('3d')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              backgroundColor: activeMode === '3d' ? '#f59e0b' : 'transparent',
              color: activeMode === '3d' ? '#0f172a' : '#cbd5e1',
              transition: 'all 0.2s',
            }}
          >
            <Box style={{ width: '14px', height: '14px' }} />
            <span>3D Real Fort Simulation</span>
          </button>

          <button
            onClick={() => setActiveMode('2d')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              backgroundColor: activeMode === '2d' ? '#f59e0b' : 'transparent',
              color: activeMode === '2d' ? '#0f172a' : '#cbd5e1',
              transition: 'all 0.2s',
            }}
          >
            <Gamepad2 style={{ width: '14px', height: '14px' }} />
            <span>2D Pixel Exploration</span>
          </button>
        </div>
      </header>

      {/* Main Viewport Container */}
      <main
        style={{
          flex: 1,
          width: '100vw',
          height: 'calc(100vh - 54px)',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#090d16',
        }}
      >
        {activeMode === '3d' ? (
          <iframe
            src="/experience/sinhagad-3d.html"
            title="Sinhagad Fort 3D Walkable Architectural Simulation"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 'none',
              display: 'block',
            }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              overflow: 'hidden',
            }}
          >
            <Sinhagad2DGame />
          </div>
        )}
      </main>
    </div>
  );
}

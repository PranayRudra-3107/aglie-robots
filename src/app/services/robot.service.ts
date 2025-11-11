import { Injectable, signal , PLATFORM_ID , inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface Joints { j1: number; j2: number; j3: number; j4: number; j5: number; j6: number; }
export interface Robot {
  id: string;
  name: string;
  status: 'idle' | 'running' | 'error' | 'estopped';
  joints: Joints;
  heartbeat: number;
}

@Injectable({ providedIn: 'root' })
export class RobotService {
  private platformId = inject(PLATFORM_ID);
  robots = signal<Robot[]>([
    { id: 'D7-001', name: 'Diana 7', status: 'running', joints: this.rand(), heartbeat: Date.now() },
    { id: 'D7-002', name: 'Thor', status: 'idle',    joints: this.rand(), heartbeat: Date.now() },
    { id: 'D7-003', name: 'Yu 5', status: 'running', joints: this.rand(), heartbeat: Date.now() },
    { id: 'D7-004', name: 'Agile Hand', status: 'running', joints: this.rand(), heartbeat: Date.now() },
    { id: 'D7-005', name: 'AMR', status: 'error',   joints: this.rand(), heartbeat: Date.now() },
    { id: 'D7-006', name: 'Agile Core', status: 'idle',    joints: this.rand(), heartbeat: Date.now() },
  ]);

  private estop = false;
  private intervalId: any;

  startSimulation() {
    if (!isPlatformBrowser(this.platformId)) return;
    setInterval(() => {
      if (this.estop) return;
      console.log('Updating', this.robots.length);
      this.robots.update(robots => robots.map(r => ({
        ...r,
        joints: this.rand(),
        heartbeat: Date.now(),
        status: r.status === 'estopped' ? 'estopped' : Math.random() > 0.97 ? 'error' : r.status
      })));
    }, 400);
  }

  emergencyStop() {
    this.estop = true;
if (isPlatformBrowser(this.platformId)) {
      const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-tone-1077.mp3');
      audio.play();
      document.body.classList.add('estop-flash');
    }
    this.robots.update(robots => robots.map(r => ({ ...r, status: 'estopped' })));
    setTimeout(() => {
      document.body.classList.remove('estop-flash');
      this.estop = false;
    }, 6000);
  }

  private rand(): Joints {
    return {
      j1: Math.random() * 360 - 180,
      j2: Math.random() * 180 - 90,
      j3: Math.random() * 180 - 90,
      j4: Math.random() * 360 - 180,
      j5: Math.random() * 240 - 120,
      j6: Math.random() * 360 - 180,
    };
  }

  stopSimulation() {
    if (this.intervalId) clearInterval(this.intervalId);
  }
}

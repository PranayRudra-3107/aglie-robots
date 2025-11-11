import { AfterViewInit, Component, ElementRef, Input, ViewChild, effect, inject, Injector } from '@angular/core';
import { runInInjectionContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { Robot, RobotService } from '../services/robot.service';

@Component({
  selector: 'app-robot-card',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <div class="card" [class.estopped]="robot.status === 'estopped'" [class.error]="robot.status === 'error'">
      <div class="header">
        <h3>{{ robot.name }}</h3>
        <span class="status" [class]="robot.status">
          {{ 'STATUS.' + robot.status | translate }}
        </span>
      </div>

      <div class="joints">
        <div *ngFor="let joint of jointArray; let i = index" class="joint">
          <small>J{{i+1}}</small>
          <strong>{{ robot.joints[joint] | number:'1.0-0' }}°</strong>
        </div>
      </div>

      <canvas #canvas width="300" height="200"></canvas>

      <small class="heartbeat">
        {{ 'HEARTBEAT' | translate }}: {{ robot.heartbeat | date:'HH:mm:ss' }}
      </small>
    </div>
  `,
  styles: [`
        .card {
  background: #1e293b;
  border-radius: 16px;
  padding: 1.75rem;
  box-shadow: 0 12px 30px rgba(0,0,0,0.35);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  max-width: 400px;
  margin: 0 auto;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0,0,0,0.4);
}

.estopped {
  border: 3px solid #dc2626;
  animation: pulse 1s infinite;
}

.error {
  border: 2px solid #f59e0b;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

h3 {
  font-size: 1.4rem;
  margin: 0;
  color: #e2e8f0;
}

.status {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 0.9rem;
}

.status.idle { background: #475569; color: #e2e8f0; }
.status.running { background: #22c55e; color: #052e16; }
.status.error { background: #f59e0b; color: #431407; }
.status.estopped { background: #dc2626; color: #450a0a; }

.joints {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin: 1.25rem 0;
}

.joint {
  text-align: center;
  background: #334155;
  padding: 0.75rem;
  border-radius: 10px;
  font-size: 0.95rem;
  transition: background 0.3s ease;
}

.joint:hover {
  background: #475569;
}

small { display: block; color: #94a3b8; font-size: 0.8rem; }
strong { color: #e2e8f0; }

canvas {
  width: 100%;
  height: 200px;
  background: #0f172a;
  border-radius: 12px;
  margin: 1.25rem 0;
  border: 1px solid #334155;
}

.heartbeat {
  display: block;
  text-align: center;
  color: #94a3b8;
  font-size: 0.85rem;
  margin-top: 0.75rem;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}


@media (max-width: 768px) {
  .card {
    padding: 1.25rem;
    max-width: 100%;
  }

  .joints {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }

  canvas {
    height: 160px;
  }

  h3 { font-size: 1.2rem; }
  .joint { padding: 0.6rem; font-size: 0.9rem; }
}

@media (max-width: 480px) {
  .joints {
    grid-template-columns: 1fr;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
  `]
})
export class RobotCardComponent implements AfterViewInit {
  @Input() robot!: Robot;
  jointArray = ['j1', 'j2', 'j3', 'j4', 'j5', 'j6'] as const;

  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;

  private robotService = inject(RobotService);
  private injector = inject(Injector);
  ngAfterViewInit(): void {
    const canvasEl = this.canvas.nativeElement;
    canvasEl.width = 300;
    canvasEl.height = 200;
    this.ctx = canvasEl.getContext('2d')!;
    this.drawArm();

    runInInjectionContext(this.injector, () => {
      effect(() => {
        this.robotService.robots();
        this.drawArm();
      });
    });
  }

  private drawArm() {
    const ctx = this.ctx;
    const { j1, j2, j3, j4, j5, j6 } = this.robot.joints;
    ctx.clearRect(0, 0, 300, 200);

    const centerX = 150, centerY = 160;
    let x = centerX, y = centerY;
    const lengths = [40, 35, 30, 25, 20, 15];

    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);

    const angles = [j1, j2, j3, j4, j5, j6];
    angles.forEach((angle, i) => {
      const rad = (angle * Math.PI) / 180;
      x += lengths[i] * Math.sin(rad);
      y -= lengths[i] * Math.cos(rad);
      ctx.lineTo(x, y);
    });
    ctx.stroke();
  }
}









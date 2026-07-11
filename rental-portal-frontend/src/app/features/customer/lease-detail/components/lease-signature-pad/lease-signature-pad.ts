import { Component, EventEmitter, Output, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lease-signature-pad',
  imports: [CommonModule],
  templateUrl: './lease-signature-pad.html',
  styleUrl: './lease-signature-pad.css'
})
export class LeaseSignaturePadComponent implements AfterViewInit {
  
  @Output() sign = new EventEmitter<string>();

  @ViewChild('sigCanvas') sigCanvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D | null;
  private isDrawing = false;

  ngAfterViewInit(): void {
    this.initCanvas();
  }


  initCanvas(): void {
    if (this.sigCanvasRef) {
      const canvas = this.sigCanvasRef.nativeElement;
      canvas.width = canvas.offsetWidth || 500;
      canvas.height = canvas.offsetHeight || 220;
      this.ctx = canvas.getContext('2d');
      if (this.ctx) {
        const textCol = getComputedStyle(document.documentElement).getPropertyValue('--text').trim() || '#0f172a';
        this.ctx.strokeStyle = textCol;
        this.ctx.lineWidth = 3;
        this.ctx.lineCap = 'round';
      }
    }
  }

  startDrawing(event: MouseEvent | TouchEvent): void {
    this.isDrawing = true;
    const coords = this.getEventCoords(event);
    if (this.ctx && coords) {
      const textCol = getComputedStyle(document.documentElement).getPropertyValue('--text').trim() || '#0f172a';
      this.ctx.strokeStyle = textCol;
      this.ctx.beginPath();
      this.ctx.moveTo(coords.x, coords.y);
    }
  }


  draw(event: MouseEvent | TouchEvent): void {
    if (!this.isDrawing || !this.ctx) return;
    const coords = this.getEventCoords(event);
    if (coords) {
      this.ctx.lineTo(coords.x, coords.y);
      this.ctx.stroke();
    }
    event.preventDefault();
  }


  stopDrawing(): void {
    this.isDrawing = false;
  }

  clearCanvas(): void {
    if (this.sigCanvasRef && this.ctx) {
      const canvas = this.sigCanvasRef.nativeElement;
      this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }


  submitSignature(): void {
    if (this.sigCanvasRef) {
      const canvas = this.sigCanvasRef.nativeElement;

      // Basic check if canvas is blank
      const blank = document.createElement('canvas');
      blank.width = canvas.width;
      blank.height = canvas.height;
      if (canvas.toDataURL() === blank.toDataURL()) {
        // Emit empty to let parent display a toast
        this.sign.emit(''); 
        return;
      }

      const signatureBase64 = canvas.toDataURL('image/png');
      this.sign.emit(signatureBase64);
    }
  }


  private getEventCoords(event: MouseEvent | TouchEvent): { x: number; y: number } | null {
    if (!this.sigCanvasRef) return null;
    const canvas = this.sigCanvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();

    if ('touches' in event) {
      if (event.touches.length === 0) return null;
      return {
        x: event.touches[0].clientX - rect.left,
        y: event.touches[0].clientY - rect.top
      };
    } 
    else {
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      };
    }
  }
}

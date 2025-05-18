import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appTooltip]',
  standalone: true
})
export class TooltipDirective {
  @Input('appTooltip') tooltipText: string = '';
  @Input() tooltipPosition: 'top' | 'bottom' | 'left' | 'right' = 'top';
  @Input() tooltipColor: string = '#333';
  @Input() tooltipBackground: string = '#fff';
  
  private tooltipElement: HTMLElement | null = null;
  
  constructor(private el: ElementRef, private renderer: Renderer2) {}
  
  @HostListener('mouseenter')
  onMouseEnter() {
    if (!this.tooltipText) return;
    
    // Create tooltip element
    this.tooltipElement = this.renderer.createElement('div');
    this.renderer.addClass(this.tooltipElement, 'app-tooltip');
    
    // Set tooltip content
    const textNode = this.renderer.createText(this.tooltipText);
    this.renderer.appendChild(this.tooltipElement, textNode);
    
    // Apply styles
    this.renderer.setStyle(this.tooltipElement, 'position', 'absolute');
    this.renderer.setStyle(this.tooltipElement, 'background-color', this.tooltipBackground);
    this.renderer.setStyle(this.tooltipElement, 'color', this.tooltipColor);
    this.renderer.setStyle(this.tooltipElement, 'padding', '5px 10px');
    this.renderer.setStyle(this.tooltipElement, 'border-radius', '4px');
    this.renderer.setStyle(this.tooltipElement, 'font-size', '12px');
    this.renderer.setStyle(this.tooltipElement, 'z-index', '1000');
    this.renderer.setStyle(this.tooltipElement, 'box-shadow', '0 2px 5px rgba(0,0,0,0.2)');
    this.renderer.setStyle(this.tooltipElement, 'pointer-events', 'none');
    this.renderer.setStyle(this.tooltipElement, 'opacity', '0');
    this.renderer.setStyle(this.tooltipElement, 'transition', 'opacity 0.3s');
    
    // Add to DOM
    this.renderer.appendChild(document.body, this.tooltipElement);
    
    // Position the tooltip
    this.setPosition();
    
    // Show with animation
    setTimeout(() => {
      if (this.tooltipElement) {
        this.renderer.setStyle(this.tooltipElement, 'opacity', '1');
      }
    }, 10);
  }
  
  @HostListener('mouseleave')
  onMouseLeave() {
    if (this.tooltipElement) {
      this.renderer.setStyle(this.tooltipElement, 'opacity', '0');
      
      // Remove after transition
      setTimeout(() => {
        if (this.tooltipElement) {
          this.renderer.removeChild(document.body, this.tooltipElement);
          this.tooltipElement = null;
        }
      }, 300);
    }
  }
  
  @HostListener('window:resize')
  onWindowResize() {
    if (this.tooltipElement) {
      this.setPosition();
    }
  }
  
  private setPosition() {
    if (!this.tooltipElement) return;
    
    const hostRect = this.el.nativeElement.getBoundingClientRect();
    const tooltipRect = this.tooltipElement.getBoundingClientRect();
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
    
    let top, left;
    
    switch (this.tooltipPosition) {
      case 'top':
        top = hostRect.top + scrollTop - tooltipRect.height - 10;
        left = hostRect.left + scrollLeft + (hostRect.width / 2) - (tooltipRect.width / 2);
        break;
      case 'bottom':
        top = hostRect.bottom + scrollTop + 10;
        left = hostRect.left + scrollLeft + (hostRect.width / 2) - (tooltipRect.width / 2);
        break;
      case 'left':
        top = hostRect.top + scrollTop + (hostRect.height / 2) - (tooltipRect.height / 2);
        left = hostRect.left + scrollLeft - tooltipRect.width - 10;
        break;
      case 'right':
        top = hostRect.top + scrollTop + (hostRect.height / 2) - (tooltipRect.height / 2);
        left = hostRect.right + scrollLeft + 10;
        break;
      default:
        top = hostRect.top + scrollTop - tooltipRect.height - 10;
        left = hostRect.left + scrollLeft + (hostRect.width / 2) - (tooltipRect.width / 2);
    }
    
    // Ensure the tooltip is within the viewport
    if (left < 0) left = 0;
    if (top < 0) top = 0;
    if (left + tooltipRect.width > window.innerWidth) {
      left = window.innerWidth - tooltipRect.width;
    }
    
    this.renderer.setStyle(this.tooltipElement, 'top', `${top}px`);
    this.renderer.setStyle(this.tooltipElement, 'left', `${left}px`);
  }
} 
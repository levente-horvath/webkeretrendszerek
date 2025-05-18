import { Directive, ElementRef, HostListener, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appInputValidator]',
  standalone: true
})
export class InputValidatorDirective implements OnInit {
  @Input('appInputValidator') validationType: 'email' | 'phone' | 'number' | 'text' = 'text';
  @Input() errorMessage: string = 'Invalid input';
  
  private errorElement: HTMLElement | null = null;
  private isValid: boolean = true;
  
  constructor(private el: ElementRef<HTMLInputElement>, private renderer: Renderer2) {}
  
  ngOnInit() {
    // Initial validation
    this.validate(this.el.nativeElement.value);
    
    // Set attributes based on validation type
    if (this.validationType === 'email') {
      this.renderer.setAttribute(this.el.nativeElement, 'type', 'email');
    } else if (this.validationType === 'number') {
      this.renderer.setAttribute(this.el.nativeElement, 'type', 'number');
    } else if (this.validationType === 'phone') {
      this.renderer.setAttribute(this.el.nativeElement, 'type', 'tel');
    }
  }
  
  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    this.validate(value);
  }
  
  @HostListener('blur', ['$event.target.value'])
  onBlur(value: string) {
    this.validate(value);
    // Only show error message on blur
    this.showValidationStatus();
  }
  
  private validate(value: string): boolean {
    if (!value) {
      this.isValid = true; // Empty is valid (for optional fields)
      return true;
    }
    
    switch (this.validationType) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        this.isValid = emailRegex.test(value);
        break;
        
      case 'phone':
        const phoneRegex = /^(\+\d{1,3})?[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
        this.isValid = phoneRegex.test(value);
        break;
        
      case 'number':
        this.isValid = !isNaN(Number(value)) && value.trim() !== '';
        break;
        
      case 'text':
      default:
        this.isValid = true;
        break;
    }
    
    return this.isValid;
  }
  
  private showValidationStatus() {
    // Remove existing error element if any
    if (this.errorElement) {
      this.renderer.removeChild(this.el.nativeElement.parentNode, this.errorElement);
      this.errorElement = null;
    }
    
    if (!this.isValid) {
      // Create error message element
      this.errorElement = this.renderer.createElement('div');
      this.renderer.addClass(this.errorElement, 'validation-error');
      this.renderer.setStyle(this.errorElement, 'color', 'red');
      this.renderer.setStyle(this.errorElement, 'font-size', '12px');
      this.renderer.setStyle(this.errorElement, 'margin-top', '4px');
      
      const textNode = this.renderer.createText(this.errorMessage);
      this.renderer.appendChild(this.errorElement, textNode);
      
      // Add error element after the input
      this.renderer.insertBefore(
        this.el.nativeElement.parentNode,
        this.errorElement,
        this.renderer.nextSibling(this.el.nativeElement)
      );
      
      // Add invalid class to input
      this.renderer.addClass(this.el.nativeElement, 'invalid');
      this.renderer.setStyle(this.el.nativeElement, 'border-color', 'red');
    } else {
      // Remove invalid class
      this.renderer.removeClass(this.el.nativeElement, 'invalid');
      this.renderer.removeStyle(this.el.nativeElement, 'border-color');
    }
  }
} 
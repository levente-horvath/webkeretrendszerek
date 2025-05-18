import { Directive, ElementRef, Input, Renderer2, AfterViewInit } from '@angular/core';

@Directive({
  selector: 'img[appLazyImage]',
  standalone: true
})
export class LazyImageDirective implements AfterViewInit {
  @Input('appLazyImage') src!: string;
  @Input() defaultImage: string = 'assets/placeholder-image.jpg';

  constructor(private el: ElementRef<HTMLImageElement>, private renderer: Renderer2) {}

  ngAfterViewInit() {
    // Create the IntersectionObserver
    const options = {
      root: null, // Use viewport as root
      rootMargin: '0px',
      threshold: 0.1 // Trigger when 10% of the image is visible
    };

    // Set default image first
    this.renderer.setAttribute(this.el.nativeElement, 'src', this.defaultImage);
    
    // Create and use the intersection observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Load the actual image
          this.loadImage();
          // Unobserve after loading
          observer.unobserve(this.el.nativeElement);
        }
      });
    }, options);

    // Start observing the image element
    observer.observe(this.el.nativeElement);
  }

  private loadImage() {
    // Create a new image to preload
    const img = new Image();
    img.onload = () => {
      // Once loaded, update the src attribute
      this.renderer.setAttribute(this.el.nativeElement, 'src', this.src);
      this.renderer.addClass(this.el.nativeElement, 'loaded');
    };
    img.src = this.src;
  }
} 
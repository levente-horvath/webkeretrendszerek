import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-category-sidebar',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule],
  template: `
    <mat-nav-list>
      <h3 matSubheader>Kategóriák</h3>
      <a mat-list-item *ngFor="let category of categories" (click)="navigateToCategory(category.id)">
        <mat-icon matListItemIcon>{{ category.icon }}</mat-icon>
        <span matListItemTitle>{{ category.name }}</span>
      </a>
    </mat-nav-list>
  `,
  styles: [`
    mat-nav-list {
      padding-top: 0;
    }
    a {
      cursor: pointer;
    }
  `]
})
export class CategorySidebarComponent {
  categories = [
    { id: 'all', name: 'Összes termék', icon: 'apps' },
    { id: 'wall-decor', name: 'Fali dekoráció', icon: 'wallpaper' },
    { id: 'soft-furnishings', name: 'Lakástextil', icon: 'weekend' },
    { id: 'home-accents', name: 'Otthoni kiegészítők', icon: 'home' },
    { id: 'storage', name: 'Tárolás', icon: 'shelves' },
    { id: 'living-room', name: 'Nappali', icon: 'weekend' },
    { id: 'bedroom', name: 'Hálószoba', icon: 'bed' },
    { id: 'kitchen', name: 'Konyha', icon: 'kitchen' },
    { id: 'bathroom', name: 'Fürdőszoba', icon: 'bathtub' },
    { id: 'office', name: 'Iroda', icon: 'computer' },
    { id: 'outdoor', name: 'Kültéri', icon: 'deck' },
  ];

  constructor(private router: Router) {}

  navigateToCategory(categoryId: string) {
    this.router.navigate(['/category', categoryId]);
  }
}

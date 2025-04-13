import { Component } from '@angular/core';
import { RouterLink, RouterOutlet, RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderComponent } from './components/header/header.component';
import { CategorySidebarComponent } from './components/category-sidebar/category-sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterLink,
    RouterOutlet,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    HeaderComponent,
    CategorySidebarComponent
  ],
  template: `
    <mat-sidenav-container>
      <mat-sidenav mode="side" opened>
        <app-category-sidebar></app-category-sidebar>
      </mat-sidenav>
      <mat-sidenav-content>
        <app-header></app-header>
        <main>
          <router-outlet></router-outlet>
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    mat-sidenav-container {
      height: 100vh;
    }
    mat-sidenav {
      width: 250px;
      padding: 16px;
    }
    main {
      padding: 20px;
    }
  `]
})
export class AppComponent {
  title = 'lakas-dekoracio';
}

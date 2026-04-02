import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { TopbarComponent } from './shared/components/topbar/topbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent],
  template: `
    <div class="app-shell">
      <app-sidebar></app-sidebar>
      <div class="main-col">
        <app-topbar></app-topbar>
        <main class="page-content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>`,
  styles: [`
    .app-shell { display:flex; height:100vh; overflow:hidden; }
    .main-col  { flex:1; display:flex; flex-direction:column; overflow:hidden; min-width:0; }
    .page-content { flex:1; overflow-y:auto; padding:24px; }
  `]
})
export class AppComponent {}

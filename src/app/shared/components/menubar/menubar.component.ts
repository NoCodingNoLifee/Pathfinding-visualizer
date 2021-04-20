import { Component, OnInit } from '@angular/core';
import { ElectronService } from 'ngx-electron';

@Component({
  selector: 'menu-bar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.scss'],
})
export class MenubarComponent implements OnInit {
  isElectronApp: boolean = false;

  constructor(private _electronService: ElectronService) {
    this.isElectronApp = _electronService.isElectronApp;
  }

  ngOnInit(): void {
    if (this.isElectronApp) {
      let browserWindow = this._electronService.remote.getCurrentWindow();

      window.addEventListener('DOMContentLoaded', () => {
        //let menuButton = <HTMLElement>document.getElementById('menu-btn');
        let minimizeButton = <HTMLElement>(
          document.getElementById('minimize-btn')
        );
        let maxUnmaxButton = <HTMLElement>(
          document.getElementById('max-unmax-btn')
        );
        let closeButton = <HTMLElement>document.getElementById('close-btn');

        // menuButton.addEventListener('click', (e) => {
        //   this._electronService.ipcRenderer.send('display-app-menu', e.x, e.y);
        // });

        maxUnmaxButton.addEventListener('click', (e) => {
          if (browserWindow.isMaximized()) {
            browserWindow.unmaximize();
          } else {
            browserWindow.maximize();
          }
        });

        minimizeButton.addEventListener('click', (e) => {
          if (browserWindow.minimizable) {
            browserWindow.minimize();
          }
        });

        closeButton.addEventListener('click', (e) => {
          browserWindow.close();
        });
      });
    }
  }
}

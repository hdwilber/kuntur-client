import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { Explorer } from '../types';
import { ExplorerService } from '../explorer.service';


@Component( {
  selector: 'explorer-start',
  templateUrl: './explorer-start.component.html',
  styleUrls: ['explorer-start.component.less']

})
export class ExplorerStartComponent {
  explorer = null;
  constructor(private eService: ExplorerService, private router: Router) {
    this.explorer = new Explorer();
  }

  login(): void {
    if (this.explorer.email != "" && this.explorer.password != "") {
      this.eService.login(this.explorer.email, this.explorer.password)
      .then(res => {
        this.explorer.email = "";
        this.explorer.password ="";
        if (res != null) {
          this.router.navigate(['/home']);
        }
      });
    }
  }

  register(): void {
    if (this.explorer.email != "" && this.explorer.password != "") {
      this.eService.register(this.explorer.email, this.explorer.password)
      .then(exp => {
        if (exp != null) {
          this.router.navigate(['/']);
        }
      });
    }
  }
}

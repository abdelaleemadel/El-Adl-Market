import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'el-adl-markets';
  ngOnInit(): void {
    window.addEventListener('scroll', this.scrollArrow)
  }


  scrollTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  scrollArrow(): void {
    let up: JQuery<HTMLElement> = $('.fa-circle-up');
    let offset = window.scrollY;
    if (offset > 500) {
      up.fadeIn();
    } else {
      up.fadeOut(100);
    }
  }
}


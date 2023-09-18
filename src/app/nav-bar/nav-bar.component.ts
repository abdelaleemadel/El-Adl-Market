import { Component, OnInit } from '@angular/core';

declare var $:any;
@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  accountMenu:any;
constructor(){
}
ngOnInit(): void {
  this.accountMenu = $('.sign');
}
/* Close the navBar in the small screens */
closeNav():void{
if($('.nav-search').css('display')
=='none')
{  $('.above-all').hide();
}
$('.toggled-nav').animate({left:'-300px'},600)
}
/* Open the nav bar in small screen */
openNav():void{
const navBarLayer = $('.above-all');
const navBarMenu = $('.toggled-nav');
navBarLayer.show();
navBarMenu.animate({left:'0%'},500,'linear');
}
openNavSearch():void{
  const navBarMenu = $('.toggled-nav');
if(navBarMenu.css('left')=='0px'){
this.closeNav()}
  $('.above-all').show();

  $('.nav-search').fadeIn();
}
closeNavSearch():void{
  $('.above-all').hide();

  $('.nav-search').fadeOut();
}
toggleAccountMenu():void{
 this.accountMenu.fadeToggle()
}
}

 $('body, html').click(function(event:any){
if(event.target != $('.fa-user')[0] && event.target != $('.fa-user')[1]){
  $('.sign').css("display", "none")
  console.log('closed');
}
})

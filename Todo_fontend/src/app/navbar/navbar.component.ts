import { Component } from '@angular/core';
import { AuthenticationService } from '../service/authentication.service';
import { Router } from '@angular/router';
import { JwtService } from '../service/jwt.service';
import { ChangeUsernameComponent } from '../change-username/change-username.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-navbar',
  templateUrl:'./navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  
  avatarUrl: string ;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private jwtService: JwtService,
    private dialog: MatDialog
  ) { this.avatarUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpoOBUkFb9DM0msWlue_0dAt-MywxhzUg8MPj1a3Ma8A&s'}
  logout() {
    this.authService.logOut();
    this.router.navigate(['/login']); // Điều hướng đến trang đăng nhập
    location.reload();
  }

  username: string | null = null;
  ngOnInit() {
    const token = sessionStorage.getItem('token');
    if (token) {
      this.username = this.jwtService.getUsernameFromToken(token);
    }
  }
  openChangeUsernameDialog() {
    const dialogRef = this.dialog.open(ChangeUsernameComponent, {
      width: '300px',
      data: { currentUsername: this.username }
    });

    dialogRef.afterClosed().subscribe(newUsername => {
      if (newUsername) {
        // Thực hiện các thao tác cần thiết khi tên người dùng được thay đổi
        console.log('New username:', newUsername);
      }
    });
  }
}

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-change-username',
  templateUrl: './change-username.component.html',
  styleUrls: ['./change-username.component.scss']
})
export class ChangeUsernameComponent {
  newUsername: string = '';

  constructor(
    public dialogRef: MatDialogRef<ChangeUsernameComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  save() {
    // Thực hiện lưu tên người dùng mới vào data và đóng pop-up
    this.dialogRef.close(this.newUsername);
  }

  cancel() {
    // Đóng pop-up mà không lưu thay đổi
    this.dialogRef.close();
  }
}

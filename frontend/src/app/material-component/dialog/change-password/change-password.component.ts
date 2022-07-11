import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: any = FormGroup;
  responseMessage: any;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    public dialogRef: MatDialogRef<ChangePasswordComponent>,
    private ngxService: NgxUiLoaderService,
    private snackBar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.changePasswordForm = this.fb.group({
      oldPassword: [null, [Validators.required]],
      newPassword: [null, [Validators.required]],
      confirmPassword: [null, [Validators.required]],
    });
  }

  validateSubmit() {
    if (
      this.changePasswordForm.controls.newPassword.value !==
      this.changePasswordForm.controls.confirmPassword.value
    ) {
      console.log( this.changePasswordForm.controls.newPassword.value,
        this.changePasswordForm.controls.confirmPassword.value);
      
      return true;
    } else {
      console.log( this.changePasswordForm.controls.newPassword.value,
        this.changePasswordForm.controls.confirmPassword.value);
      return false;
    }
  }

  handleSubmit() {
    this.ngxService.start();
    let formData = this.changePasswordForm.value;
    let data = {
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword,
      confirmPassword: formData.confirmPassword,
    };

    this.userService.changePassword(data).subscribe(
      (resp: any) => {
        this.ngxService.stop();
        this.responseMessage = resp?.message;
        this.dialogRef.close();
        this.snackBar.openSnackBar(this.responseMessage, 'success');
      },
      (error) => {
        this.ngxService.stop();
        console.log(error);
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackBar.openSnackBar(this.responseMessage, GlobalConstants.error);
      }
    );
  }
}

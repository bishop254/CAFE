import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  onAddCategory = new EventEmitter();
  onEditCategory = new EventEmitter();
  productForm: any = FormGroup;
  dialogAction: any = 'Add';
  action: any = 'Add';
  responseMessage: any;
  categories: any = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    public dialogRef: MatDialogRef<ProductComponent>,
    private snackBar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: [
        null,
        [Validators.required, Validators.pattern(GlobalConstants.nameRegex)],
      ],
      categoryId: [null, [Validators.required]],
      price: [null, [Validators.required]],
      description: [null, [Validators.required]],
    });

    if (this.dialogData.action === 'Edit') {
      this.dialogAction = 'Edit';
      this.action = 'Update';
      this.productForm.patchValue(this.dialogData.data);
    }

    this.getCategories();
  }

  getCategories() {
    this.categoryService.getCategories().subscribe(
      (resp: any) => {
        this.categories = resp.data;
      },
      (error) => {
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackBar.openSnackBar(this.responseMessage, GlobalConstants.error);
      }
    );
  }

  handleSubmit() {
    if (this.dialogAction === 'Edit') {
      this.edit();
    } else if (this.dialogAction === 'Add') {
      this.add();
    }
  }

  add() {
    let formData = this.productForm.value;
    let data = {
      name: formData.name,
      categoryID: formData.categoryId,
      price: formData.price,
      description: formData.description,
    };

    this.productService.add(data).subscribe(
      (resp: any) => {
        this.dialogRef.close();
        this.onAddCategory.emit();
        this.responseMessage = resp.message;
        this.snackBar.openSnackBar(this.responseMessage, 'success');
      },
      (error) => {
        this.dialogRef.close();
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackBar.openSnackBar(this.responseMessage, GlobalConstants.error);
      }
    );
  }

  edit() {
    let formData = this.productForm.value;
    let data = {
      id: this.dialogData.data.id,
      name: formData.name,
      categoryID: formData.categoryId,
      price: formData.price,
      description: formData.description,
    };

    this.productService.update(data).subscribe(
      (resp: any) => {
        this.dialogRef.close();
        this.onEditCategory.emit();
        this.responseMessage = resp.message;
        this.snackBar.openSnackBar(this.responseMessage, 'success');
      },
      (error) => {
        this.dialogRef.close();
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackBar.openSnackBar(this.responseMessage, GlobalConstants.error);
      }
    );
  }

  delete() {}
}

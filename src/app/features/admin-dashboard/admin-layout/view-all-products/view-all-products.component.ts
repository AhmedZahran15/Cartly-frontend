import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, FormGroup, Validators,  ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-all-products',
  imports: [CommonModule, ToastModule, ConfirmDialogModule, DialogModule, ReactiveFormsModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './view-all-products.component.html',
  styleUrl: './view-all-products.component.css',
})
export class ViewAllProductsComponent implements OnInit {
  products: any[] = [];
  updateDialogVisible = false;
  updateForm!: FormGroup;
  selectedProductId: string | null = null;
  viewDialogVisible: boolean = false;
  selectedProduct: any = null;
  brands: any[] = [];
  productTypes: any[] = [];

  constructor(
    private adminService: AdminService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private fb: FormBuilder,
  ) {}

  ngOnInit() {
    this.updateForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    gender: ['', Validators.required],
    ageGroup: ['', Validators.required],
    stock: [0, [Validators.required, Validators.min(0)]],
    price: [0, [Validators.required, Validators.min(0)]],
    discountPrice: [0],
    // brand: ['', Validators.required],
    // type: ['', Validators.required]
  });
    this.getAllProducts();
  }

  // get all products
  getAllProducts() {
    this.adminService.getAllProducts().subscribe({
      next: (response: any) => {
        this.products = response.products;
        console.log('Products fetched successfully:', this.products);
      },
      error: (error) => {
        console.error('Error fetching products:', error);
      },
      complete: () => {
        console.log('Product fetching completed');
      },
    });
  }

  // confirmation delete
  confirmDelete(productId: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this product?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteProduct(productId);
      },
    });
  }

  // delete products
  deleteProduct(productId: any) {
    this.adminService.removeProduct(productId).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Product deleted successfully`,
        });
        this.getAllProducts();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Could not delete product',
        });
        console.error('Error deleting product:', error);
      },
      complete: () => {
        console.log('Product deletion completed');
      },
    });
  }

  // view product
  viewProduct(product: any): void {
    this.selectedProduct = product;
    this.viewDialogVisible = true;
  }

  // open update dialog
  openUpdateDialog(product: any) {
  this.updateDialogVisible = true;
  this.selectedProductId = product._id;
  this.updateForm.patchValue({
    name: product.name,
    description: product.description,
    gender: product.gender,
    ageGroup: product.ageGroup,
    stock: product.stock,
    price: product.price,
    discountPrice: product.discountPrice,
    // brand: product.brand._id,
    // type: product.type._id
  });
}

onUpdateProduct() {
  if (this.updateForm.invalid || !this.selectedProductId) return;

  const updatedData = this.updateForm.value;

  this.adminService.updateProduct(this.selectedProductId, updatedData).subscribe(() => {
    this.updateDialogVisible = false;
    this.selectedProductId = null;
    // Refresh list or show success toast
     this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Product Updated successfully`,
        });
        this.getAllProducts();
  });
}
  addProduct(product: any) {
    this.adminService.createProduct(product).subscribe({
      next: (response) => {
        console.log('Product added successfully:', response);
        this.getAllProducts();
      },
      error: (error) => {
        console.error('Error adding product:', error);
      },
      complete: () => {
        console.log('Product addition completed');
      },
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-view-all-products',
  imports: [CommonModule, ToastModule, ConfirmDialogModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './view-all-products.component.html',
  styleUrl: './view-all-products.component.css'
})
export class ViewAllProductsComponent implements OnInit {
  products: any[] = [];
  editProductId: string | null = null;
  editedProduct: any = {};

  constructor(
    private adminService: AdminService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.getAllProducts();
  }

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
      }
    });
  }

  confirmDelete(productId: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this product?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteProduct(productId);
      }
    });
  }

  deleteProduct(productId: any) {
    this.adminService.removeProduct(productId).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Product deleted successfully`
        });
        this.getAllProducts();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Could not delete product'
        });
        console.error('Error deleting product:', error);
      },
      complete: () => {
        console.log('Product deletion completed');
      }
    });
  }

  editProduct(productId: string, product: any) {
    this.editProductId = productId;
    this.editedProduct = { ...product };
  }

  saveUpdatedProduct() {
    if (!this.editedProduct._id) return;

    this.adminService.updateProduct(this.editedProduct._id, this.editedProduct).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Product updated successfully'
        });
        this.editProductId = null;
        this.getAllProducts();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Could not update product'
        });
        console.error('Error updating product:', error);
      },
      complete: () => {
        console.log('Product update completed');
      }
    });
  }

  cancelEdit() {
    this.editProductId = null;
    this.editedProduct = {};
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
      }
    });
  }
}

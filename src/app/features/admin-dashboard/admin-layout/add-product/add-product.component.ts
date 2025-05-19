import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { response } from 'express';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [
    CommonModule,
    ToastModule,
    ReactiveFormsModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent implements OnInit {
  addProductForm!: FormGroup;
  loading = false;
  brands: any[] = []
  productTypes: any[] = []

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.addProductForm = this.fb.group({
      name: ['', Validators.required],
      brand: ['', Validators.required], // This is brand ID
      type: ['',Validators.required],
      gender: ['', Validators.required],
      ageGroup: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      discountPrice: [null],
      stock: [0, [Validators.required, Validators.min(0)]],
      images: ['', Validators.required], // comma-separated URLs
      description: ['', Validators.required],
      isFeatured: [false],
      movementType: ['', Validators.required],
      caseMaterial: ['', Validators.required],
      bandMaterial: ['', Validators.required],
      waterResistance: ['', Validators.required],
      displayType: ['', Validators.required],
      specifications: this.fb.group({
        powerReserve: ['', Validators.required],
        caseSize: ['', Validators.required],
        crystal: ['', Validators.required],
        bezel: ['', Validators.required],
      }),
      keywords: ['', Validators.required], // comma-separated
      isActive: [true],
    });
    this.getAllBrands();
    this.getAllproductTypes();
  }
  
// get all brands
  getAllBrands(){
    this.adminService.getAllBrand().subscribe({
      next: (response: any) =>{
        this.brands = response.brands;
        console.log(this.brands)
      },error: (err) => {
        console.log(err)
      }, complete: ()=> {
          console.log("completed")
      },
    })
  }

// get all product types
getAllproductTypes(){
    this.adminService.getAllProductTypes().subscribe({
      next: (response: any) =>{
        this.productTypes = response.productTypes;
        console.log(this.productTypes)
      },error: (err) => {
        console.log(err)
      }, complete: ()=> {
          console.log("completed")
      },
    })
  }

  onSubmit(): void {
    console.log("Iam submitted")
    const formValue = this.addProductForm.value;

    const productData = {
      ...formValue,
      images: formValue.images.split(',').map((url: string) => url.trim()),
      keywords: formValue.keywords.split(',').map((k: string) => k.trim())
    };

    this.loading = true;
    this.adminService.createProduct(productData).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Product added successfully!',
        });
        this.router.navigate(['/admin/view-products']);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to add product',
        });
        console.error(error);
        this.loading = false;
      },
    });
  }

  onFileSelected(){

  }
}

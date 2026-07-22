import { IconComponent } from '../../../shared/components/icon/icon';
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { selectAllProperties, selectPropertiesLoading } from '../../../store/properties/properties.selectors';
import { selectCurrentUser } from '../../../store/auth/auth.selectors';
import { loadProperties, createProperty, updateProperty, deleteProperty } from '../../../store/properties/properties.actions';
import { UploadService } from '../../../core/services/upload-service';
import { ToastService } from '../../../core/services/toast-service';
import { Property } from '../../../core/models/property-model';
import { PropertyTableListComponent } from './components/property-table-list/property-table-list';
import { PropertyFormPanelComponent } from './components/property-form-panel/property-form-panel';
import { ModalComponent } from '../../../shared/components/modal/modal';


@Component({
  selector: 'app-property-management',
  imports: [CommonModule, PropertyTableListComponent, PropertyFormPanelComponent, ModalComponent ],
  templateUrl: './property-management.html',
  styleUrl: './property-management.css'
})
export class PropertyManagementComponent implements OnInit, OnDestroy {

  private fb = inject(FormBuilder);
  private store = inject(Store);
  private uploadService = inject(UploadService);
  private toast = inject(ToastService);
  private destroy$ = new Subject<void>();

  properties$ = this.store.select(selectAllProperties);
  loading$ = this.store.select(selectPropertiesLoading);
  currentUser$ = this.store.select(selectCurrentUser);


  isDeleteModalOpen = false;
  propertyIdToDelete: string | null = null;

  properties: Property[] = [];
  userId = '';

  isFormOpen = false;
  isEditMode = false;
  editingPropertyId: string | null = null;
  uploadedImages: string[] = [];
  uploadingFile = false;


  propertyForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    city: ['Bangalore', Validators.required],
    locality: ['', Validators.required],
    type: ['Apartment', Validators.required],
    bedrooms: [2, [Validators.required, Validators.min(1)]],
    bathrooms: [2, [Validators.required, Validators.min(1)]],
    rent: [null, [Validators.required, Validators.min(1)]],
    deposit: [null, [Validators.required, Validators.min(1)]],
    furnishing: ['Semi-Furnished', Validators.required],
    available: [true, Validators.required],
    area: [null, [Validators.required, Validators.min(10)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    amenities: ['']
  });


  ngOnInit(): void {
    this.currentUser$.pipe(takeUntil(this.destroy$)).subscribe(user => {
      if (user) {
        this.userId = user.id;
        this.store.dispatch(loadProperties({ filters: { ownerId: user.id } }));
      }
    });

    this.properties$.pipe(takeUntil(this.destroy$)).subscribe(list => {
      this.properties = list;
    });
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  openCreateForm(): void {
    this.isEditMode = false;
    this.editingPropertyId = null;
    this.uploadedImages = [];
    this.propertyForm.reset({
      city: 'Bangalore',
      type: 'Apartment',
      bedrooms: 2,
      bathrooms: 2,
      furnishing: 'Semi-Furnished',
      available: true
    });
    this.isFormOpen = true;
  }


  openEditForm(property: Property): void {
    this.isEditMode = true;
    this.editingPropertyId = property.id;
    this.uploadedImages = [...(property.images || [])];
    const amenitiesStr = property.amenities ? property.amenities.join(', ') : '';
    this.propertyForm.reset({
      title: property.title,
      city: property.city,
      locality: property.locality,
      type: property.type,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      rent: property.rent,
      deposit: property.deposit,
      furnishing: property.furnishing,
      available: property.available,
      area: property.area,
      description: property.description,
      amenities: amenitiesStr
    });
    this.isFormOpen = true;
  }


  closeForm(): void {
    this.isFormOpen = false;
    this.isEditMode = false;
    this.editingPropertyId = null;
    this.uploadedImages = [];
  }


  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    this.uploadingFile = true;
    this.uploadService.uploadImage(file).subscribe({
      next: (res) => {
        this.uploadedImages.push(res.url);
        this.toast.success('Property photo attached!');
        this.uploadingFile = false;
      },
      error: () => {
        this.toast.error('Failed to attach photo.');
        this.uploadingFile = false;
      }
    });
  }


  removeImage(index: number): void {
    this.uploadedImages.splice(index, 1);
  }

  onDelete(id: string): void {
    this.propertyIdToDelete = id;
    this.isDeleteModalOpen = true;
  }

  closeDeleteConfirm(): void {
    this.propertyIdToDelete = null;
    this.isDeleteModalOpen = false;
  }

  confirmDelete(): void {
    if (this.propertyIdToDelete) {
      this.store.dispatch(deleteProperty({ id: this.propertyIdToDelete }));
      this.closeDeleteConfirm();
    }
  }


  onSubmit(): void {
    if (this.propertyForm.invalid) {
      this.propertyForm.markAllAsTouched();
      return;
    }

    const formValues = this.propertyForm.value;
    const amenities = formValues.amenities
      ? formValues.amenities.split(',').map((a: string) => a.trim()).filter((a: string) => a)
      : [];

    const propertyPayload = {
      ...formValues,
      amenities,
      images: this.uploadedImages,
      ownerId: this.userId,
      postedAt: new Date().toISOString().split('T')[0]
    };

    if (this.isEditMode && this.editingPropertyId) {
      this.store.dispatch(updateProperty({ id: this.editingPropertyId, data: propertyPayload }));
    } 
    else {
      this.store.dispatch(createProperty({ property: propertyPayload }));
    }

    this.closeForm();
  }
}
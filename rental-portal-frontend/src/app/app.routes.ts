import { Routes } from '@angular/router';
import { redirectIfLoggedInGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';
import { customerGuard } from './core/guards/customer-guard';
import { confirmLeaveGuard } from './core/guards/unsaved-changes-guard';

export const routes: Routes = [
    {
        path: '',
        canActivate: [redirectIfLoggedInGuard],
        loadComponent: () => import('./features/landing-page/landing-page').then(m => m.LandingPageComponent),
        pathMatch: 'full'
    },
    {
        path: 'auth',
        canActivate: [redirectIfLoggedInGuard],
        loadComponent: () => import('./features/auth/auth-layout/auth-layout').then(m => m.AuthLayoutComponent),
        children: [
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full'
            },
            {
                path: 'login',
                loadComponent: () => import('./features/auth/login/login').then(l => l.LoginComponent)
            },
            {
                path: 'register',
                loadComponent: () => import('./features/auth/register/register').then(r => r.RegisterComponent)
            }
        ]
    },
    {
        path: 'customer',
        canActivate: [customerGuard],
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                loadComponent: () => import('./features/customer/dashboard/dashboard').then(d => d.Dashboard)
            },
            {
                path: 'profile',
                loadComponent: () => import('./features/customer/profile/profile').then(p => p.Profile),
                canDeactivate: [confirmLeaveGuard]
            },
            {
                path: 'properties',
                loadComponent: () => import('./features/customer/property-catalog/property-catalog').then(p => p.PropertyCatalogComponent)
            },
            {
                path: 'properties/:id',
                loadComponent: () => import('./features/customer/property-detail/property-detail').then(p => p.PropertyDetailComponent)
            },
            {
                path: 'applications',
                loadComponent: () => import('./features/customer/rental-application/application-list/application-list').then(a => a.ApplicationListComponent)
            },
            {
                path: 'apply/:propertyId',
                loadComponent: () => import('./features/customer/rental-application/application-apply/application-apply').then(r => r.ApplyComponent),
                canDeactivate: [confirmLeaveGuard]
            },
            {
                path: 'lease',
                loadComponent: () => import('./features/customer/lease-detail/lease-detail').then(m => m.LeaseDetailComponent)
            },
            {
                path: 'lease/:leaseId',
                loadComponent: () => import('./features/customer/lease-detail/lease-detail').then(m => m.LeaseDetailComponent)
            },
            {
                path: 'maintenance',
                loadComponent: () => import('./features/customer/maintenance/maintenance').then(m => m.MaintenanceComponent)
            },
            {
                path: 'maintenance/:propertyId',
                loadComponent: () => import('./features/customer/maintenance/maintenance').then(m => m.MaintenanceComponent)
            },
            {
                path: 'rent',
                loadComponent: () => import('./features/customer/rent-tracking/rent-tracking').then(r => r.RentTracking)
            },
            {
                path: 'rent/:leaseId',
                loadComponent: () => import('./features/customer/rent-tracking/rent-tracking').then(r => r.RentTracking)
            },
            {
                path: 'notifications',
                loadComponent: () => import('./features/customer/notifications/notifications').then(n => n.NotificationsComponent)
            },
            {
                path: '**',
                redirectTo: 'dashboard'
            }
        ]
    },
    {
        path: 'admin',
        canActivate: [adminGuard],
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                loadComponent: () => import('./features/admin/dashboard/admin-dashboard').then(d => d.AdminDashboard)
            },
            {
                path: 'properties',
                loadComponent: () => import('./features/admin/property-management/property-management').then(p => p.PropertyManagementComponent),
                canDeactivate: [confirmLeaveGuard]
            },
            {
                path: 'applications',
                loadComponent: () => import('./features/admin/application-review/application-review').then(a => a.ApplicationReviewComponent)
            },
            {
                path: 'tenants',
                loadComponent: () => import('./features/admin/tenant-management/tenant-management').then(t => t.TenantManagementComponent)
            },
            {
                path: 'rent',
                loadComponent: () => import('./features/admin/rent-management/rent-management').then(r => r.RentManagementComponent)
            },
            {
                path: 'maintenance',
                loadComponent: () => import('./features/admin/maintenance-management/maintenance-management').then(m => m.MaintenanceManagementComponent),
                canDeactivate: [confirmLeaveGuard]
            },
            {
                path: 'notifications',
                loadComponent: () => import('./features/admin/notifications/admin-notifications').then(n => n.AdminNotificationsComponent)
            },
            {
                path: '**',
                redirectTo: 'dashboard'
            }
        ]
    },
    {
        path: '**',
        redirectTo: '/auth/login'
    }
];

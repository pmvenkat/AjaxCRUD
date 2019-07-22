from django.contrib import admin
from . import models


class CustomerInfoHeaderAdmin(admin.ModelAdmin):

    list_display = ('customer_id', 'customer_name', 'gst_no', 'tinpan_number',
                    'created_date', 'update_date', 'created_user', 'active')
    ordering = ('-created_date',)


class CustomerInfoDetailsAdmin(admin.ModelAdmin):

    list_display = ('customer_id', 'customer_remarks', 'address_type', 'street', 'city',
                    'zipcode', 'state', 'country', 'mobile_number', 'landline_number',
                    'email', 'contact_person', 'website', 'shipping', 'created_user',
                    'created_date', 'update_date', 'active')
    ordering = ('-created_date',)
    list_per_page = 12




class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'role', 'url', 'address', 'display_name', 'comments', 'extension', 'mobile_no',
                    'accesscard_no', 'active')
    list_per_page = 20


class RolesAdmin(admin.ModelAdmin):
    list_display = ('role', 'pk')
    list_per_page = 20


class RolesDetailsAdmin(admin.ModelAdmin):
    list_display = ('role', 'permissions')
    list_per_page = 20


class PermissionAdmin(admin.ModelAdmin):
    list_display = ('user', 'roles')
    list_per_page = 20



admin.site.register(models.CustomerInfoHeader, CustomerInfoHeaderAdmin)
admin.site.register(models.CustomerInfoDetails, CustomerInfoDetailsAdmin)
admin.site.register(models.UserProfile, UserProfileAdmin)
admin.site.register(models.Roles, RolesAdmin)
admin.site.register(models.RolesDetails, RolesDetailsAdmin)
admin.site.register(models.Permissions, PermissionAdmin)

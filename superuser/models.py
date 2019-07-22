from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError

from phonenumber_field.modelfields import PhoneNumberField

import re
import datetime


class Common(models.Model):
    active = models.BooleanField('active', default=True)
    created_date = models.DateTimeField('created_date', auto_now_add=True)
    update_date = models.DateTimeField('update_date', auto_now=True)

    class Meta:
        abstract = True


class ManagementHeader(Common):

    objects = None
    gst_no = models.CharField('gst_no', max_length=25, blank=False, null=False)
    tinpan_number = models.CharField('tinpan_number', max_length=25, blank=False, null=False)

    class Meta:
        abstract = True


class ManagementDetails(Common):

    objects = None
    city = models.CharField('city', max_length=50, blank=True)
    contact_person = models.CharField('contact_person', max_length=50, blank=False, null=False)
    country = models.CharField('country', max_length=50, blank=True)
    email = models.EmailField('email', max_length=70, blank=False, null=False)
    landline_number = models.BigIntegerField('landline_number')
    mobile_number = PhoneNumberField('mobile_no', blank=False, null=False)
    state = models.CharField('state', max_length=50, blank=True)
    street = models.CharField('street', max_length=255, blank=True)
    website = models.URLField('website', max_length=100, blank=True)
    zipcode = models.IntegerField()


    class Meta:
        abstract = True


class CustomerInfoHeader(ManagementHeader):

    objects = None
    created_user = models.ForeignKey(User, on_delete=models.PROTECT, related_name="custh_created_user")
    customer_id = models.AutoField('customer_id', primary_key=True)
    customer_name = models.CharField('customer_name', max_length=150, blank=False, null=False)

    class Meta:
        verbose_name_plural = "CustomerInfoHeaders"
        indexes = [
            models.Index(fields=['customer_id', 'active', ]),
            models.Index(fields=['customer_id', 'customer_name', 'active', ]),
        ]

    def __str__(self):
        return "{}".format(self.customer_id)


class CustomerInfoDetails(ManagementDetails):

    objects = None
    address_type = models.CharField('address_type', max_length=20)
    created_user = models.ForeignKey(User, on_delete=models.PROTECT, related_name="custd_created_user")
    customer_id = models.ForeignKey(CustomerInfoHeader, on_delete=models.PROTECT, related_name="cust_id")
    customer_remarks = models.CharField('customer_remarks', max_length=255, blank=True)
    shipping = models.CharField('shipping', max_length=255, blank=False)

    class Meta:
        verbose_name_plural = "CustomerInfoDetails"
        indexes = [
            models.Index(fields=['customer_id', ]),
            models.Index(fields=['customer_id', 'mobile_number', 'active', ]),
        ]

    def __str__(self):
        return "{}".format(self.customer_id)




class UserProfile(Common):
    objects = None
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="user_of_userprofile")
    role = models.CharField('role', max_length=100)
    url = models.CharField('url', max_length=255, blank=False)
    address = models.CharField('address', max_length=255)
    display_name = models.CharField('display_name', max_length=20)
    comments = models.CharField('comments', max_length=255)
    extension = models.CharField('extension', max_length=255)
    mobile_no = PhoneNumberField('mobileno', max_length=255)
    employee_id = models.CharField('employee_id', max_length=255)
    accesscard_no = models.CharField('accesscard_no', max_length=255)
    created_user = models.ForeignKey(User, on_delete=models.PROTECT, related_name="userpro_created_user")

    class Meta:
        verbose_name_plural = "UserProfile"
        indexes = [
            models.Index(fields=['user', 'active']),
            models.Index(fields=['user', 'mobile_no', 'active']),
        ]

    def __str__(self):
        return "{}".format(self.user)


class Roles(Common):
    ROLE_TYPE = (
        ('ADMIN', 'ADMIN'), ('MANAGEMENT', 'MANAGEMENT'), ('MASTER', 'MASTER'), ('MOVEMENT', 'MOVEMENT'),
        ('PURCHASE', 'PURCHASE'), ('SALES', 'SALES'), ('ACCOUNTS', 'ACCOUNTS'), ('STORES', 'STORED'),
        ('SETTINGS', 'SETTINGS')
    )
    role = models.CharField('role', max_length=30, primary_key=True, choices=ROLE_TYPE)
    created_user = models.ForeignKey(User, on_delete=models.PROTECT, related_name="roles_created_user")

    class Meta:
        verbose_name_plural = "Roles"

    def __str__(self):
        return "{}".format(self.role)


class RolesDetails(Common):
    objects = None
    role = models.ForeignKey(Roles, on_delete=models.CASCADE, related_name="role_of_role_details")
    permissions = models.CharField('permissions', max_length=255, blank=False)
    created_user = models.ForeignKey(User, on_delete=models.PROTECT, related_name="roledetail_created_user")

    class Meta:
        verbose_name_plural = "RolesDetails"
        unique_together = (("role", "permissions"),)

    def __str__(self):
        return "{}--{}".format(self.role, self.permissions,)


class Permissions(Common):
    objects = None
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_role_and_permissions")
    roles = models.ForeignKey(Roles, on_delete=models.CASCADE, related_name="role_of_users")
    created_user = models.ForeignKey(User, on_delete=models.PROTECT, related_name="permissions_created_user")

    class Meta:
        verbose_name_plural = "Permissions"
        unique_together = (("user", "roles"),)
        indexes = [
            models.Index(fields=['user', 'roles']),
        ]

    def __str__(self):
        return "{}--{}".format(self.user, self.roles)


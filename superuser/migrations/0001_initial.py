# Generated by Django 2.2.1 on 2019-07-03 12:44

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import phonenumber_field.modelfields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Roles',
            fields=[
                ('active', models.BooleanField(default=True, verbose_name='active')),
                ('created_date', models.DateTimeField(auto_now_add=True, verbose_name='created_date')),
                ('update_date', models.DateTimeField(auto_now=True, verbose_name='update_date')),
                ('role', models.CharField(choices=[('ADMIN', 'ADMIN'), ('MANAGEMENT', 'MANAGEMENT'), ('MASTER', 'MASTER'), ('MOVEMENT', 'MOVEMENT'), ('PURCHASE', 'PURCHASE'), ('SALES', 'SALES'), ('ACCOUNTS', 'ACCOUNTS'), ('STORES', 'STORED'), ('SETTINGS', 'SETTINGS')], max_length=30, primary_key=True, serialize=False, verbose_name='role')),
                ('created_user', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='roles_created_user', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name_plural': 'Roles',
            },
        ),
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('active', models.BooleanField(default=True, verbose_name='active')),
                ('created_date', models.DateTimeField(auto_now_add=True, verbose_name='created_date')),
                ('update_date', models.DateTimeField(auto_now=True, verbose_name='update_date')),
                ('role', models.CharField(max_length=100, verbose_name='role')),
                ('url', models.CharField(max_length=255, verbose_name='url')),
                ('address', models.CharField(max_length=255, verbose_name='address')),
                ('display_name', models.CharField(max_length=20, verbose_name='display_name')),
                ('comments', models.CharField(max_length=255, verbose_name='comments')),
                ('extension', models.CharField(max_length=255, verbose_name='extension')),
                ('mobile_no', phonenumber_field.modelfields.PhoneNumberField(max_length=255, region=None, verbose_name='mobileno')),
                ('employee_id', models.CharField(max_length=255, verbose_name='employee_id')),
                ('accesscard_no', models.CharField(max_length=255, verbose_name='accesscard_no')),
                ('created_user', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='userpro_created_user', to=settings.AUTH_USER_MODEL)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='user_of_userprofile', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name_plural': 'UserProfile',
            },
        ),
        migrations.CreateModel(
            name='RolesDetails',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('active', models.BooleanField(default=True, verbose_name='active')),
                ('created_date', models.DateTimeField(auto_now_add=True, verbose_name='created_date')),
                ('update_date', models.DateTimeField(auto_now=True, verbose_name='update_date')),
                ('permissions', models.CharField(max_length=255, verbose_name='permissions')),
                ('created_user', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='roledetail_created_user', to=settings.AUTH_USER_MODEL)),
                ('role', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='role_of_role_details', to='superuser.Roles')),
            ],
            options={
                'verbose_name_plural': 'RolesDetails',
            },
        ),
        migrations.CreateModel(
            name='Permissions',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('active', models.BooleanField(default=True, verbose_name='active')),
                ('created_date', models.DateTimeField(auto_now_add=True, verbose_name='created_date')),
                ('update_date', models.DateTimeField(auto_now=True, verbose_name='update_date')),
                ('created_user', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='permissions_created_user', to=settings.AUTH_USER_MODEL)),
                ('roles', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='role_of_users', to='superuser.Roles')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_role_and_permissions', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name_plural': 'Permissions',
            },
        ),
        migrations.CreateModel(
            name='CustomerInfoHeader',
            fields=[
                ('active', models.BooleanField(default=True, verbose_name='active')),
                ('created_date', models.DateTimeField(auto_now_add=True, verbose_name='created_date')),
                ('update_date', models.DateTimeField(auto_now=True, verbose_name='update_date')),
                ('gst_no', models.CharField(max_length=25, verbose_name='gst_no')),
                ('tinpan_number', models.CharField(max_length=25, verbose_name='tinpan_number')),
                ('customer_id', models.AutoField(primary_key=True, serialize=False, verbose_name='customer_id')),
                ('customer_name', models.CharField(max_length=150, verbose_name='customer_name')),
                ('created_user', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='custh_created_user', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name_plural': 'CustomerInfoHeaders',
            },
        ),
        migrations.CreateModel(
            name='CustomerInfoDetails',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('active', models.BooleanField(default=True, verbose_name='active')),
                ('created_date', models.DateTimeField(auto_now_add=True, verbose_name='created_date')),
                ('update_date', models.DateTimeField(auto_now=True, verbose_name='update_date')),
                ('city', models.CharField(blank=True, max_length=50, verbose_name='city')),
                ('contact_person', models.CharField(max_length=50, verbose_name='contact_person')),
                ('country', models.CharField(blank=True, max_length=50, verbose_name='country')),
                ('email', models.EmailField(max_length=70, verbose_name='email')),
                ('landline_number', models.BigIntegerField(verbose_name='landline_number')),
                ('mobile_number', phonenumber_field.modelfields.PhoneNumberField(max_length=128, region=None, verbose_name='mobile_no')),
                ('state', models.CharField(blank=True, max_length=50, verbose_name='state')),
                ('street', models.CharField(blank=True, max_length=255, verbose_name='street')),
                ('website', models.URLField(blank=True, max_length=100, verbose_name='website')),
                ('zipcode', models.IntegerField()),
                ('address_type', models.CharField(max_length=20, verbose_name='address_type')),
                ('customer_remarks', models.CharField(blank=True, max_length=255, verbose_name='customer_remarks')),
                ('shipping', models.CharField(max_length=255, verbose_name='shipping')),
                ('created_user', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='custd_created_user', to=settings.AUTH_USER_MODEL)),
                ('customer_id', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='cust_id', to='superuser.CustomerInfoHeader')),
            ],
            options={
                'verbose_name_plural': 'CustomerInfoDetails',
            },
        ),
        migrations.AddIndex(
            model_name='userprofile',
            index=models.Index(fields=['user', 'active'], name='superuser_u_user_id_35f298_idx'),
        ),
        migrations.AddIndex(
            model_name='userprofile',
            index=models.Index(fields=['user', 'mobile_no', 'active'], name='superuser_u_user_id_1c5db0_idx'),
        ),
        migrations.AlterUniqueTogether(
            name='rolesdetails',
            unique_together={('role', 'permissions')},
        ),
        migrations.AddIndex(
            model_name='permissions',
            index=models.Index(fields=['user', 'roles'], name='superuser_p_user_id_193365_idx'),
        ),
        migrations.AlterUniqueTogether(
            name='permissions',
            unique_together={('user', 'roles')},
        ),
        migrations.AddIndex(
            model_name='customerinfoheader',
            index=models.Index(fields=['customer_id', 'active'], name='superuser_c_custome_098919_idx'),
        ),
        migrations.AddIndex(
            model_name='customerinfoheader',
            index=models.Index(fields=['customer_id', 'customer_name', 'active'], name='superuser_c_custome_18f9bd_idx'),
        ),
        migrations.AddIndex(
            model_name='customerinfodetails',
            index=models.Index(fields=['customer_id'], name='superuser_c_custome_a7659f_idx'),
        ),
        migrations.AddIndex(
            model_name='customerinfodetails',
            index=models.Index(fields=['customer_id', 'mobile_number', 'active'], name='superuser_c_custome_b3d22f_idx'),
        ),
    ]
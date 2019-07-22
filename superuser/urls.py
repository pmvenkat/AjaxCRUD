"""malar URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import TemplateView
from django.contrib.auth.decorators import login_required
from . import views

urlpatterns = [
    path('index/', TemplateView.as_view(template_name='index.html'), name='index'),
    path('customermanagement/', login_required(TemplateView.as_view(template_name='customer_management/customer_management.html')), name='customer_management'),
    
    path('login/', csrf_exempt(views.Login.as_view()), name="login"),
    path('logout/', csrf_exempt(views.Logout.as_view()), name="logout"),


    #Customer Management Path  
    path('customer-details-show/', login_required(csrf_exempt(views.Customers.as_view())), name="customer-details-show"),
    path('customer-details-get-for-edit/', login_required(csrf_exempt(views.Customers.as_view())), name="customer-details-get-for-edit"),
    path('customer-details-insert/', login_required(csrf_exempt(views.CustomersCrudOperation.as_view())), name="customer-details-insert"),
    path('customer-details-get/', login_required(csrf_exempt(views.CustomersCrudOperation.as_view())), name="customer-details-get"),
    path('customers-details-update/', login_required(csrf_exempt(views.CustomersCrudOperation.as_view())), name="customers-details-update"),
    path('customer-details-delete/', login_required(csrf_exempt(views.CustomersCrudOperation.as_view())), name="customer-details-delete"),
    path('customer-details-search/', login_required(csrf_exempt(views.CustomersSearch.as_view())), name="customer-details-search"),

]

###############################################################################
# Code              :   CustomerDetails
# Author            :   Niranjan K
# Description       :   Customer Add,Edit,Delete,Get
# Create Date       :   09-02-2019
# Version           :   1.0
###############################################################################
# Change log
###############################################################################
# Date       Version   Details                                      Edited by
# 2019-02-09 1.0       Inital Version                               Arun Kumar R
###############################################################################

from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse
from django.views import View
from django.db import transaction

from superuser.models import CustomerInfoHeader
from superuser.models import CustomerInfoDetails
from superuser import utils
from superuser.pagination import Pagination

import json
import logging
logger = logging.getLogger('django')


class CustomersCrudOperation(View):

    @staticmethod
    def post(request):
        customer_detail = json.loads(request.body)
        try:
            user = utils.string_to_user(request.session["User"])
            with transaction.atomic():
                customer_header = CustomerInfoHeader.objects.create(customer_name=customer_detail["customer_name"],
                                                                    gst_no=customer_detail["gst_no"],
                                                                    tinpan_number=customer_detail["tinpan_number"],
                                                                    created_user=user)
                CustomerInfoDetails.objects.create(customer_id=customer_header,
                                                   customer_remarks=customer_detail["customer_remarks"],
                                                   country=customer_detail["country"],
                                                   state=customer_detail["state"],
                                                   city=customer_detail["city"],
                                                   zipcode=customer_detail["zipcode"],
                                                   address_type=customer_detail["address_type"],
                                                   street=customer_detail["street"],
                                                   mobile_number=customer_detail["mobile_number"],
                                                   landline_number=customer_detail["land_line_number"],
                                                   email=customer_detail["email"],
                                                   website=customer_detail["website"],
                                                   shipping=customer_detail["shipping"],
                                                   contact_person=customer_detail["contact_person"],
                                                   created_user=user)
            return HttpResponse(json.dumps({"result": "success"}), content_type="application/json")
        except Exception as e:
            logger.error("%s : %s", request.session["User"], str(e))
            return HttpResponse(json.dumps({"error": str(e)}), content_type="application/json")

    @staticmethod
    def get(request):
        try:
            customer_head = list(CustomerInfoHeader.objects.filter(active="True").values('pk', 'customer_name')
                                                                                 .order_by("customer_id"))
            cust_detail = list(CustomerInfoDetails.objects.filter(active="True").values("customer_id",
                                                                                        "contact_person",
                                                                                        "mobile_number",
                                                                                        "email",
                                                                                        "customer_remarks",
                                                                                        "city",
                                                                                        "street",
                                                                                        "zipcode")
                                                                                .order_by("customer_id"))
            return HttpResponse(json.dumps({"result": [customer_head, cust_detail]}), content_type="application/json")
        except Exception as e:
            logger.error("%s : %s", request.session["User"], str(e))
            return HttpResponse(json.dumps({"error": str(e)}), content_type="application/json")

    @staticmethod
    def put(request):
        customer_detail = json.loads(request.body)
        try:
            customer_head = utils.id_to_customer_info_header(customer_detail["customer_id"])
            customer = CustomerInfoDetails.objects.get(customer_id=customer_head, active="True")
        except ObjectDoesNotExist:
            logger.error("%s : %s", request.session["User"], "Customer Details Not In")
            return HttpResponse(json.dumps({"error": "Customer Details Not In"}), content_type="application/json")
        except Exception as e:
            logger.error("%s : %s", request.session["User"], str(e))
            return HttpResponse(json.dumps({"error": str(e)}), content_type="application/json")
        try:
            user = utils.string_to_user(request.session["User"])
            with transaction.atomic():
                customer.active = False
                customer.save()
                CustomerInfoDetails.objects.create(customer_id=customer_head,
                                                   customer_remarks=customer_detail["customer_remarks"],
                                                   country=customer_detail["country"],
                                                   state=customer_detail["state"],
                                                   city=customer_detail["city"],
                                                   zipcode=customer_detail["zipcode"],
                                                   address_type=customer_detail["address_type"],
                                                   street=customer_detail["street"],
                                                   mobile_number=customer_detail["mobile_number"],
                                                   landline_number=customer_detail["land_line_number"],
                                                   email=customer_detail["email"],
                                                   website=customer_detail["website"],
                                                   shipping=customer_detail["shipping"],
                                                   contact_person=customer_detail["contact_person"],
                                                   created_user=user)
                return HttpResponse(json.dumps({"result": "success"}), content_type="application/json")
        except Exception as e:
            logger.error("%s : %s", request.session["User"], str(e))
            return HttpResponse(json.dumps({"error": str(e)}), content_type="application/json")

    @staticmethod
    def delete(request):
        customer_id = json.loads(request.body)
        try:
            with transaction.atomic():
                customer = utils.id_to_customer_info_header(customer_id["customer_id"])
                detail = CustomerInfoDetails.objects.get(customer_id=customer, active="True")
                customer.active = False
                customer.save()
                detail.active = False
                detail.save()
            return HttpResponse(json.dumps({"result": "success"}), content_type="application/json")
        except ObjectDoesNotExist:
            logger.error("%s : %s", request.session["User"], "Customer Has Been Already Deleted")
            return HttpResponse(json.dumps({"error":
                                            "Customer Has Been Already Deleted"}), content_type="application/json")
        except Exception as e:
            logger.error("%s : %s", request.session["User"], str(e))
            return HttpResponse(json.dumps({"error": str(e)}), content_type="application/json")


class Customers(View):

    @staticmethod
    def get(request):
        try:
            page = request.GET.get('page')
            no_of_data = 10
            queryset1 = """list(models.CustomerInfoHeader.objects\
                                                    .filter(active=True).values('customer_id', 'customer_name')\
                                                    .order_by('customer_id'))"""
            queryset2 = """list(models.CustomerInfoDetails.objects\
                                                     .filter(active=True)\
                                                     .values("contact_person",
                                                             "mobile_number",
                                                             "email",
                                                             "city",
                                                             "zipcode",
                                                             "customer_remarks")\
                                                     .order_by('customer_id'))"""
            obj = Pagination()
            customer_header = obj.pagination(page, no_of_data, queryset1)
            customer_detail = obj.pagination(page, no_of_data, queryset2)
            return HttpResponse(json.dumps({"result":
                                            [customer_header, customer_detail]}), content_type="application/json")
        except Exception as e:
            logger.error("%s : %s", request.session["User"], str(e))
            return HttpResponse(json.dumps({"error": str(e)}), content_type="application/json")

    @staticmethod
    def post(request):
        customer_detail = json.loads(request.body)
        try:
            customer = list(CustomerInfoHeader.objects.filter(customer_id=customer_detail["customer_id"], active="True")
                                                      .values('customer_id', 'customer_name', 'gst_no', 'tinpan_number'))
            details = list(CustomerInfoDetails.objects
                                              .filter(customer_id=customer_detail["customer_id"], active="True")
                                              .values('address_type', 'street', 'city', 'state', 'zipcode', 'country',
                                                      'contact_person', 'mobile_number', 'landline_number', 'email',
                                                      'website', 'shipping', 'customer_remarks', 'created_user'))
            customer.append(details)
            return HttpResponse(json.dumps({"result": customer}), content_type="application/json")
        except Exception as e:
            logger.error("%s : %s", request.session["User"], str(e))
            return HttpResponse(json.dumps({"error": str(e)}), content_type="application/json")


class CustomersSearch(View):

    @staticmethod
    def post(request):
        search_word = json.loads(request.body)
        try:
            page = request.GET.get('page')
            no_of_data = 10
            searching_key = search_word["searching_word"]
            queryset1 = """list(models.CustomerInfoHeader.objects.filter(Q(customer_name__istartswith=kwargs["searching_key"],\
                                                                      active=True,cust_id__active=True)|
                                                                    Q(active=True,cust_id__mobile_number__istartswith=kwargs["searching_key"],\
                                                                      cust_id__active=True))\
                                                            .values('customer_id',
                                                                    'customer_name',
                                                                    'cust_id__contact_person',
                                                                    'cust_id__mobile_number',
                                                                    'cust_id__email',
                                                                    'cust_id__city',
                                                                    'cust_id__zipcode',
                                                                    'cust_id__customer_remarks'))"""
            obj = Pagination()
            customer_header = obj.pagination(page, no_of_data, queryset1, searching_key=searching_key)
            return HttpResponse(json.dumps({"result": customer_header}), content_type="application/json")
        except Exception as e:
            logger.error("%s : %s", request.session["User"], str(e))
            return HttpResponse(json.dumps({"error": str(e)}), content_type="application/json")

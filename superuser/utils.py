from django.contrib.auth.models import User

from django.core.exceptions import ObjectDoesNotExist

from superuser import models


def string_to_user(user_name):

    try:
        return User.objects.get(username=user_name)
    except ObjectDoesNotExist:
        raise ValueError("Invalid User...!")


def id_to_customer_info_header(customer_id):

    try:
        return models.CustomerInfoHeader.objects.get(customer_id=customer_id, active=True)
    except ObjectDoesNotExist:
        raise ValueError("invalid Customer...!")


def id_to_customer_info_details(customer_id):

    try:
        return models.CustomerInfoDetails.objects.get(customer_id=customer_id, active=True)
    except ObjectDoesNotExist:
        raise ValueError("invalid Customer Details...!")


def id_to_vendor_info_header(vendor_id):

    try:
        return models.VendorInfoHeader.objects.get(vendor_id=vendor_id, active=True)
    except ObjectDoesNotExist:
        raise ValueError("Invalid Vendor Id...!")


def id_to_vendor_info_details(vendor_id):

    try:
        return models.VendorInfoDetails.objects.get(vendor_id=vendor_id, active=True)
    except ObjectDoesNotExist:
        raise ValueError("Invalid Vendor Details...!")


def id_to_sub_vendor_info_header(sub_vendor_id):

    try:
        return models.SubVendorInfoHeader.objects.get(sub_vendor_id=sub_vendor_id, active=True)
    except ObjectDoesNotExist:
        raise ValueError("Invalid SubVendor Id...!")


def id_to_sub_vendor_info_details(sub_vendor_id):

    try:
        return models.SubVendorInfoDetails.objects.get(sub_vendor_id=sub_vendor_id, active=True)
    except ObjectDoesNotExist:
        raise ValueError("Invalid SubVendor Details...!")


def id_to_purchase_order_enquiry_customer(enquiry_no):

    try:
        return models.PurchaseOrderEnquiryCustomer.objects.get(enquiry_no=enquiry_no, active=True)
    except ObjectDoesNotExist:
        raise ValueError("Invalid Enquiry Id!")


def string_to_role(role):
    try:
        return models.Roles.objects.get(pk=role, active=True)
    except ObjectDoesNotExist:
        raise ValueError('Invalid Role')


def id_to_item_group(item_group):

    try:
        return models.ItemGroup.objects.get(pk=item_group, active=True)
    except ObjectDoesNotExist:
        raise ValueError("Invalid Group Id!")


def grouping_to_item_group(grouping):

    try:
        return models.ItemGroup.objects.get(grouping=grouping, active=True)
    except ObjectDoesNotExist:
        raise ValueError("Invalid Group Name!")


def id_to_item_category(item_category):

    try:
        return models.ItemCategory.objects.get(pk=item_category, active=True)
    except ObjectDoesNotExist:
        raise ValueError("Invalid Category Id!")


def category_to_item_category(category):

    try:
        return models.ItemCategory.objects.get(category=category, active=True)
    except ObjectDoesNotExist:
        raise ValueError("Invalid Category Name!")


def id_to_invoice_create(invoice_number):

    try:
        return models.InvoiceCreate.objects.get(invoice_number=invoice_number, active=True)
    except ObjectDoesNotExist:
        raise ValueError("Invalid Invoice !")


def id_to_item_master(item_code):

    try:
        return models.ItemMaster.objects.get(itemcode=item_code, active=True)
    except ObjectDoesNotExist:
        raise ValueError("Invalid item Id!")


def id_to_bom(bom_number):

    try:
        return models.BillOfMaterials.objects.get(bom_number=bom_number, active=True)
    except ObjectDoesNotExist:
        raise ValueError("Invalid BOM Id!")


def id_to_service_header(service_id):

    try:
        return models.ServiceHeaders.objects.get(service_number=service_id)
    except ObjectDoesNotExist:
        raise ValueError("Invalid Service Id!")


def int_to_DefectiveHeader(defective_id):

    try:
        return models.DefectiveHeaders.objects.get(defective_number=defective_id)
    except ObjectDoesNotExist:
        raise ValueError("Invalid Defective Id!")


def id_to_purchase_header(pout_no):

    try:
        return models.PurchaseHeader.objects.get(pout_no=pout_no, active=True)
    except ObjectDoesNotExist:
        raise ValueError("Invalid PurdchaseOrderOut Id!")


def int_to_PurchaseTemp(pk):

    try:
        return models.PurchaseTemp.objects.get(pk=pk)
    except ObjectDoesNotExist:
        raise ValueError("Invalid PurdchaseTemp Id!")


def id_to_purchase_order_out_customer(po_out_no):

    try:
        return models.PurchaseOrderOutCustomer.objects.get(po_out_no=po_out_no, active=True)
    except ObjectDoesNotExist:
        raise ValueError("Invalid Sales Id!")


def id_to_job_card_creation(jc_no):

    try:
        return models.JobCardCreation.objects.get(job_number=jc_no, active=True)
    except ObjectDoesNotExist:
        raise ValueError("Invalid Job Card Id!")


def id_to_material_in_header(materia_in_no):

    try:
        return models.MaterialInHeader.objects.get(materia_in_no=materia_in_no)
    except ObjectDoesNotExist:
        raise ValueError("Invalid MaterialIn Id!")


def int_to_SalesOutHeader(sales_out_no):

    try:
        return models.SalesOutHeader.objects.get(sales_out_no=sales_out_no)
    except ObjectDoesNotExist:
        raise ValueError("Invalid SalesOut Id!")


def id_to_production_out_header(production_out_no):

    try:
        return models.ProductionOutHeader.objects.get(production_out_no=production_out_no, active=True)
    except ObjectDoesNotExist:
        raise ValueError("Invalid Production Out Id!")


def id_to_tools_header(tool_head):

    try:
        return models.ToolsHeader.objects.get(tool_head=tool_head)
    except ObjectDoesNotExist:
        raise ValueError("Invalid ToolsOut Id!")


def string_to_role(role):

    try:
        return models.Roles.objects.get(role=role)
    except ObjectDoesNotExist:
        raise ValueError("Invalid Role!")


def int_to_tax(hsnsac):

    try:
        return models.TaxingInformation.objects.get(hsn_code=hsnsac, active=True)
    except ObjectDoesNotExist:
        raise ValueError("invalid HSNSAC!")

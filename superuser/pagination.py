
###############################################################################
# Code : Pagination
# Author : Arun Kumar R
# Description : Send the particular no of data from bulk amount of data
# Create Date : 09-02-2019
# Version : 1.0
###############################################################################
# Change log
###############################################################################
# Date          Version             Details                         Edited by
# 2019-02-09    1.0                 Inital Version                  Arun Kumar R
###############################################################################
from django.core.paginator import Paginator
from superuser import models
from django.db.models import Sum, Q
from django.contrib.auth.models import User


class Pagination(object):

    def __init__(self):
        self.page = None
        self.no_of_data = None
        self.queryset = None
        self.empty_list = list()

    def pagination(self, page, no_of_data, queryset, **kwargs):
        self.page = int(page)
        self.no_of_data = no_of_data
        self.queryset = eval(queryset)
        data = Paginator(self.queryset, self.no_of_data)
        if data.num_pages >= self.page:
            paginted_data = data.page(self.page).object_list
            return paginted_data
        else:
            return self.empty_list

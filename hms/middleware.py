###############################################################################
# Code              :   LoginRequiredMiddleware
# Author            :   Arun Kumar R
# Description       :   Login,Logout,SessionExpire,UserAllowedPageCheck
# Create Date       :   09-02-2019
# Version           :   1.0
###############################################################################
# Change log
###############################################################################
# Date       Version   Details                                      Edited by
# 2019-02-09 1.0       Inital Version                               Arun Kumar R
###############################################################################

from django.conf import settings
from django.contrib.auth import logout
from django.http import HttpResponse, HttpResponseRedirect

from datetime import datetime, timedelta

from superuser.packages import permission

import json


class LoginRequiredMiddleWare:

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        self.request = request
        # if self.request.get_full_path().split('?')[0] in permission.permission():
        #     pass
        # else:
        #     if request.is_ajax():
        #         return HttpResponse(json.dumps({"redirect": settings.PAGE_NOT_FOUND_URL}),
        #                             content_type="application/json")
        #     else:
        #         return HttpResponseRedirect(settings.PAGE_NOT_FOUND_URL)
        try:
            if datetime.now() - self.request.session['last_touch'] > timedelta(0, settings.AUTO_LOGOUT_DELAY * 60, 0):
                if request.is_ajax():
                    logout(self.request)
                    return HttpResponse(json.dumps({"redirect": settings.LOGIN_URL}), content_type="application/json")
                else:
                    logout(self.request)
                    path = settings.LOGIN_URL + "?next=" + self.request.get_full_path()
                    return HttpResponseRedirect(path)
            else:
                pass
        except KeyError:
            pass
        request.session['last_touch'] = datetime.now()
        response = self.get_response(request)
        return response

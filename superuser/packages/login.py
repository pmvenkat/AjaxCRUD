###############################################################################
# Code              :   Login
# Author            :   Arun Kumar R
# Description       :   Login,Logout,SessionCreation,Url assign to user
# Create Date       :   09-02-2019
# Version           :   1.0
###############################################################################
# Change log
###############################################################################
# Date       Version   Details                                      Edited by
# 2019-02-09 1.0       Inital Version                               Arun Kumar R
###############################################################################

from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse, HttpResponseRedirect
from django.views import View
import json
from hms import settings
from superuser.packages import permission
from superuser.models import RolesDetails, Permissions, UserProfile
import logging
import datetime


logger = logging.getLogger('django')


class Login(View):

    def __init__(self, **kwargs):
        # This Super() call to the View class __init__ method. ex:(Login(View))
        super().__init__(**kwargs)
        self.request = None

    def session_creation(self, username, next_url):
        # Login user name and primary role of url to be store into session keys of(User,NextUrl)
        self.request.session["User"] = username
        self.request.session["NextUrl"] = next_url
        return None

    @staticmethod
    def permission_added(user: object) -> object:
        role = Permissions.objects.filter(user=user)
        roles = [i.roles.role for i in role]
        permissions = [j["permissions"]
                       for i in role
                       for j in RolesDetails.objects.filter(role=i.roles).values('permissions')
                       ]
        permission.permission_lists.extend(permissions)
        return None

    def login(self, request, username, password):

        try:
            admin = User.objects.get(username=username)
            if admin.check_password(password):
                user = authenticate(username=username, password=password)
                if admin.is_active:
                    if user.is_authenticated:
                        login(request, user)
                        user_profile = UserProfile.objects.get(user=user)
                        self.session_creation(user.username, user_profile.url)
                        self.permission_added(user)
                        return user_profile.role, user_profile.display_name
                    else:
                        raise ValueError("The User don't have authenticate")
                else:
                    raise ValueError("The User Has  already Deleted")
            else:
                raise ValueError("You are Password Is Wrong")
        except ObjectDoesNotExist:
            raise ValueError("Your Username Has Been Wrong!")

    def post(self, request):
        """
        :param request:Username,Password
        :return: Url permission entry
        1. Confirm the username,password not empty(If empty alert)
        2. Check User has active and authenticated
        3. Given the URL permission to user and create Session
        """
        if datetime.date.today() <= datetime.date(2019, 12, 30) :
            pass
        else:
            return HttpResponse(json.dumps({"error": "Trial Version Expired"}), content_type="application/json")
        user_profile = json.loads(request.body)
        required_data = ["username", "password"]
        for data in required_data:
            if not (data in user_profile and user_profile[data]):
                return HttpResponse(json.dumps({"error": data + "  " + "This Field is required"}),
                                    content_type='application/json')
        try:
            next_page = user_profile["next"]
            if request.method == 'POST':
                if next_page == "None":
                    result, display_name = self.login(request, user_profile["username"], user_profile["password"])
                    url = request.session["NextUrl"]
                    return HttpResponse(json.dumps({"result": result, "display_name":display_name, "url": url}), content_type="application/json")

                else:
                    url = next_page
                    result, display_name = self.login(request, user_profile["username"], user_profile["password"])
                    return HttpResponse(json.dumps({"result": result, "display_name":display_name, "url": url}), content_type="application/json")

        except Exception as e:
            logger.error("%s ", str(e))
            return HttpResponse(json.dumps({"error": str(e)}), content_type="application/json")


class Logout(View):

    @staticmethod
    def get(request):
        try:
            del permission.permission_lists[6:]
            logout(request)
            return HttpResponseRedirect(settings.LOGIN_URL)
        except Exception as e:
            logger.error("%s : %s", request.session["User"], str(e))
            return HttpResponse(json.dumps({"error": str(e)}), content_type="application/json")

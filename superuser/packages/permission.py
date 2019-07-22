permission_lists = ["/superuser/index/", "/superuser/404PageNotFound/", "/superuser/login/", "/superuser/logout/"]


def permission():
    global permission_lists
    # for i in permission_lists:
    #     print(i)
    return set(permission_lists)

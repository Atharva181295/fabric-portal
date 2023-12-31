from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from users.models import User


class UserModelAdmin(BaseUserAdmin):
    # The fields to be used in displaying the User model.
    # These override the definitions on the base UserModelAdmin
    # that reference specific fields on auth.User.
    list_display = ["id", "email","username", "name", "profile_image", "role"]
    list_filter = ["role"]
    fieldsets = [
        ("User Credentials", {"fields": ["username", "password"]}),
        ("Personal info", {"fields": ["name", "email", "profile_image"]}),
        ("Permissions", {"fields": ["role","is_active"]}),
    ]
    # add_fieldsets is not a standard ModelAdmin attribute. UserModelAdmin
    # overrides get_fieldsets to use this attribute when creating a user.
    add_fieldsets = [
        (
            None,
            {
                "classes": ["wide"],
                "fields": ["username","email", "name", "password1", "password2", "profile_image","role"],
            },
        ),
    ]
    search_fields = ["username"]
    ordering = ["username", "id"]
    filter_horizontal = []


# Now register the new UserModelAdmin
admin.site.register(User, UserModelAdmin)
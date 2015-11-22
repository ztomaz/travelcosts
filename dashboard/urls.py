"""travelcosts URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import include, url
from django.contrib import admin

from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.conf.urls.static import static
from travelcosts import settings

js_info_dict = {
    'domain': 'djangojs',
    'packages': ('messages',),
}


urlpatterns = [
    url(r'^$', 'dashboard.views.dashboard', name="main"),
    url(r'trip', 'dashboard.views.dashboard_new_trip'),
    url(r'logout', 'home.views.logout'),
]

#!/usr/bin/env python
import os
import sys
from travelcosts import settings

if __name__ == "__main__":
    if settings.DEBUG:
        os.environ.setdefault("DJANGO_SETTINGS_MODULE", "travelcosts_local.settings")
    else:
        os.environ.setdefault("DJANGO_SETTINGS_MODULE", "travelcosts.settings")

    from django.core.management import execute_from_command_line

    execute_from_command_line(sys.argv)

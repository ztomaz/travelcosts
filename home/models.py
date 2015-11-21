from django.contrib.auth.models import AbstractUser, User
from django.db import models

# Create your models here.


class TravelcostsUser(AbstractUser):
    User._meta.get_field("username").max_length = 75

    # must be set upon registration ('normal' for normal registration, 'google' for google)
    # password_reset_key = models.CharField("Lost password reset key or activation key", max_length=15, blank=True,
    #                                      null=True, unique=True)

    # __unicode__ = lambda self:  u'%s %s' % (self.first_name, self.last_name)
    def __unicode__(self):
        if self.first_name or self.last_name:
            return u'%s %s' % (self.first_name, self.last_name)
        else:
            # if there's no first or last for this user, return the us ername which must exist
            return self.email

    def save(self, *args, **kwargs):
        if self.pk is None:
            self.username = self.email

        super(TravelcostsUser, self).save(*args, **kwargs)

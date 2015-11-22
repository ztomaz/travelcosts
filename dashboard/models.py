from django.db import models

# Create your models here.

### category ###
from home.models import TravelcostsUser

COLORS = [  # choices for category.color
    'ffffff',  # the first entry is the default
    '444444',
    'ff7d64',
    '00dcb4',
    '143264',
    'ff465a',
    '1ee65a',
    '8287a5',
    'b9aa9b',
    '007dff',
    'ffc864',
    '5ad2fa',
]


class Travel(models.Model):
    name = models.CharField("Travel name", max_length=100, null=False, blank=False)
    description = models.TextField("Description", null=True, blank=True)
    color = models.CharField("Color", default=COLORS, blank=False, null=False, max_length=6)

    # image has been replaced by color
    # image = models.ImageField(_("Icon"),
    #                          upload_to=get_image_path(g.DIRS['category_icon_dir'], "pos_category", "image"),
    #                          null=True, blank=True)

    def __unicode__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Categories"

    participants = models.ManyToManyField(TravelcostsUser)


currencies = {
    "USD": ("United States Dollar", "$"),
    "EUR": ("Euro", "€"),
    "JPY": ("Japanese Yen", "¥"),
    "GBP": ("Pound Sterling", "£"),
    "AUD": ("Australian Dollar", "$"),
    "CHF": ("Swiss Franc", "Fr"),
    "CAD": ("Canadian Dollar", "$"),
    "CNY": ("Chinese Yuan", "¥"),
}

currencies_choices = [(k, k) for k in currencies.keys()]
print (currencies_choices)

class TravelCost(models.Model):
    name = models.CharField("Travel name", max_length=100, null=False, blank=False)
    description = models.TextField("Description", null=True, blank=True)
    location = models.TextField("Location", null=True, blank=True)
    currency = models.CharField(max_length=3, choices=currencies_choices, null=True, blank=True, default="USD")
    travel = models.ForeignKey(Travel)
    amount = models.DecimalField("Amount", max_digits=20,
                                     decimal_places=10, blank=False, null=False)


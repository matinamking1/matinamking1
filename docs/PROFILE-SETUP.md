# Profile setup

## نمایش فعالیت Private

۱. در پروفایل GitHub، بالای تقویم فعالیت، منوی Contribution settings را باز کن و Private contributions را فعال کن. گیت‌هاب تعداد فعالیت خصوصی را بدون نام مخزن و جزئیات نمایش می‌دهد.

۲. تغییرات این مخزن را روی main منتشر کن. در Actions، گردش‌کار Profile Activity را اجرا کن. فایل assets/activity.svg با داده واقعی جایگزین می‌شود و روزانه تازه می‌شود.

۳. گردش‌کار به‌صورت پیش‌فرض از GITHUB_TOKEN همین مخزن استفاده می‌کند و فقط داده‌ای را می‌بیند که GitHub به آن اجازه بدهد. این توکن دسترسی عمومی به همه مخزن‌های Private حساب ندارد. اگر آمار خصوصی کامل در دسترس نبود، یک توکن شخصی با دسترسی لازم به مخزن‌های موردنظر در Settings → Secrets and variables → Actions با نام PROFILE_TOKEN ذخیره کن. توکن را در README، فایل کد، خروجی عمومی یا چت قرار نده. برای توکن‌های fine-grained فقط مخزن‌های لازم و دسترسی خواندن موردنیاز را انتخاب کن؛ محدودیت سازمان، SSO و انتخاب مالک می‌تواند دسترسی را محدود کند. classic PAT برای داده مخزن خصوصی ممکن است به repo نیاز داشته باشد که دسترسی گسترده‌تری دارد.

۴. Profile Activity و Generate Snake Animation را از Actions به‌صورت دستی اجرا کن. دسترسی نوشتن Actions به contents و اجازه push به شاخه main/output لازم است؛ قوانین محافظت شاخه ممکن است جلوی انتشار را بگیرند.

داشبورد فقط تعداد کل contribution، روزهای فعال، بیشترین فعالیت یک روز و تعداد restricted contribution را از API می‌گیرد. نام، لینک، کد، زبان یا رویداد خصوصی درخواست و منتشر نمی‌شود. عدد Private زیرمجموعه عدد کل است؛ دوباره با کل جمع نمی‌شود. اگر نمایش خصوصی غیرفعال باشد یا دسترسی کافی وجود نداشته باشد، عدد صفر به معنی نداشتن کار خصوصی نیست.

این نمودار بازه پیش‌فرض یک‌سال اخیر GitHub را نشان می‌دهد، نه کل تاریخ حساب. Contribution با commit برابر نیست؛ ایمیل commit، شاخه پیش‌فرض یا gh-pages، fork بودن مخزن و قوانین GitHub روی شمارش اثر دارند. هیچ تنظیم README نمی‌تواند نمایش تک‌تک فعالیت‌های همه مخزن‌ها را تضمین کند.

در صورت خطای API، فایل قبلی حفظ می‌شود؛ تاریخ Updated نشان می‌دهد داده چقدر تازه است. فایل اولیه عمداً عدد ساختگی ندارد. نشانگر زبان حذف شده چون آمار سرویس عمومی نماینده کد خصوصی یا مهارت فرد نیست.

## Design references

- https://github.com/DenverCoder1/DenverCoder1 — clear tools and activity sections.
- https://github.com/anuraghazra/anuraghazra — concise introduction and personal focus.
- https://github.com/Platane/snk — contribution snake.
- https://docs.github.com/en/account-and-profile/how-tos/contribution-settings/manage-visibility-settings-for-private-contributions-and-achievements
- https://docs.github.com/en/account-and-profile/reference/profile-contributions-reference

The SVG banner and contribution dashboard are original code-native assets. Biographical details and contact links were retained from the existing README.

## Portfolio alignment and profile views

Content source: the local portfolio at ../وب سایت پروتوفولیا/index.html (about, skills, education, experience and contact sections). The current specialty is C# / ASP.NET Core; earlier PHP/Laravel experience remains collapsed. No employer project is claimed to use .NET specifically. Contact email and LinkedIn match that portfolio. The target GitHub account remains matinamking, matching this profile repository; the portfolio currently has a different GitHub link.

The view badge is restored in the README with the existing username key, matinamking, preserving the service's existing counter. No base-count offset, fabricated count, or cache-busting requests are used. This is an approximate image-request counter, not unique visitors or official GitHub profile analytics. GitHub proxies images through Camo; direct requests to the service do not increase the counter. A local Markdown preview cannot verify increments on the published profile.

References:
- https://github.com/antonkomarev/github-profile-views-counter/blob/master/public/index.php
- https://github.com/DenverCoder1/readme-typing-svg

Visual additions: typing animation using the project's documented endpoint; an original animated SVG backend pipeline; animated banner accents; contribution snake now visible without expanding a details section. External services can be temporarily unavailable; meaningful alt text remains in the README.

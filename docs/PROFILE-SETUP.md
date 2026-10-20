# Profile setup

## نمایش فعالیت Private

۱. در پروفایل GitHub، بالای تقویم فعالیت، منوی Contribution settings را باز کن و Private contributions را فعال کن. گیت‌هاب تعداد فعالیت خصوصی را بدون نام مخزن و جزئیات نمایش می‌دهد.

۲. تغییرات این مخزن را روی main منتشر کن. در Actions، گردش‌کار Profile Activity را اجرا کن. فایل assets/activity.svg با داده واقعی جایگزین می‌شود و روزانه تازه می‌شود.

۳. هر دو گردش‌کار اکنون به Secret با نام PROFILE_TOKEN نیاز دارند؛ fallback به توکن محدود مخزن حذف شده است. در حساب matinamking1 از Settings → Developer settings → Personal access tokens → Tokens (classic) یک توکن با scope برابر read:user بساز؛ این مجوز برای خواندن اطلاعات پروفایل و تعداد فعالیت‌های خصوصی است و نیازی به دادن دسترسی repo به کد خصوصی برای این تقویم تجمیعی نیست. توکن را فقط در همین مخزن از Settings → Secrets and variables → Actions → New repository secret با نام PROFILE_TOKEN ذخیره کن. آن را در چت یا کد قرار نده. گردش‌کار مالک توکن را بررسی می‌کند و در صورت نبودن یا اشتباه‌بودن آن متوقف می‌شود.

۴. Profile Activity و Generate Snake Animation را از Actions به‌صورت دستی اجرا کن. دسترسی نوشتن Actions به contents و اجازه push به شاخه main/output لازم است؛ قوانین محافظت شاخه ممکن است جلوی انتشار را بگیرند.

داشبورد فقط تعداد کل contribution، روزهای فعال، بیشترین فعالیت یک روز و تعداد restricted contribution را از API می‌گیرد. نام، لینک، کد، زبان یا رویداد خصوصی درخواست و منتشر نمی‌شود. عدد Restricted تعداد مشارکت‌هایی است که جزئیاتشان از دید توکن محدود است، نه تعداد دقیق تمام فعالیت‌های Private؛ ممکن است برای توکن مالک صفر باشد. آن را به عدد کل تقویم اضافه نمی‌کنیم. فعال بودن Private contributions و دسترسی توکن برای دریافت تعداد خصوصی لازم است.

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

Content source: the local portfolio at ../وب سایت پروتوفولیا/index.html (about, skills, education, experience and contact sections). The current specialty is C# / ASP.NET Core; earlier PHP/Laravel experience remains collapsed. No employer project is claimed to use .NET specifically. Contact email and LinkedIn match that portfolio. The target account is matinamking1, matching the current Git remote. Workflows derive the owner from github.repository_owner.

The view badge is restored in the README with the username key matinamking1, matching the actual profile. Counters for different usernames are separate. No base-count offset, fabricated count, or cache-busting requests are used. This is an approximate image-request counter, not unique visitors or official GitHub profile analytics. GitHub proxies images through Camo; direct requests to the service do not increase the counter. A local Markdown preview cannot verify increments on the published profile.

References:
- https://github.com/antonkomarev/github-profile-views-counter/blob/master/public/index.php
- https://github.com/DenverCoder1/readme-typing-svg

Visual additions: typing animation using the project's documented endpoint; an original animated SVG backend pipeline; animated banner accents; contribution snake now visible without expanding a details section. External services can be temporarily unavailable; meaningful alt text remains in the README.

## بررسی نتیجه

پس از ذخیره Secret و انتشار تغییرات، هر دو گردش‌کار Profile Activity و Generate Snake Animation را از Actions اجرا کن. تقویم هر دو از contributionsCollection.contributionCalendar و با هویت مالک حساب خوانده می‌شود؛ روزهایی را که فقط فعالیت خصوصی داشته‌ای با تقویم اصلی پروفایلت مقایسه کن. اجرای موفق هنوز تضمین شمارش همه commitها نیست: قواعد ایمیل، شاخه و انتساب مشارکت GitHub برقرارند. مقدار Restricted ممکن است صفر باشد حتی وقتی تقویم شامل کار خصوصی است.

اگر Secret منقضی یا حذف شود، اجرا fail می‌شود و آخرین تصویر موفق باقی می‌ماند. هیچ توکن یا نام مخزن خصوصی در فایل تولیدشده نوشته نمی‌شود.

Account correction: the previous code queried matinamking and linked its output branch. The current remote is matinamking1/matinamking1. PROFILE_TOKEN must belong to matinamking1 and must be saved in that repository. Publish this correction and rerun both workflows; an old image remains visible while a run fails.

## Snake calendar consistency

Snake generation now exports the authenticated aggregate calendar through scripts/activity.cjs, the same fetch and owner validation used by the dashboard. scripts/snake.cjs generates both SVG themes locally from that calendar. Only the two SVG images are published; the temporary aggregate JSON remains outside dist. The SVG header includes contribution and active-day counts to make comparison possible. Runs at different times can differ when new activity is added. The animation follows an irregular food-seeking route with body collision avoidance, an eight-segment gradient body and directional eyes. All segments share one clock for a seamless loop; duration scales with route length. Motion is disabled when reduced motion is requested.

## Unified publication (current workflow)

The only current workflow is Profile Activity and Snake (activity.yml). It fetches one owner-authenticated calendar with PROFILE_TOKEN and builds assets/activity.svg, assets/snake-light.svg and assets/snake-dark.svg together. Every daily count and the snake totals are checked before files are written. All three images are committed to main together. The former main.yml publisher and output-branch image URLs have been removed; old instructions above referring to two separate workflows are superseded by this section.

Run Profile Activity and Snake after publishing these changes. The existing PROFILE_TOKEN stays the same. No private repository names or code are published. These visuals show GitHub contribution-calendar counts, which may differ from the raw commit totals of individual repositories.

#!/usr/bin/env python3
"""Functional checks for the local Podrumizza visual concept; no external messages."""
import json
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

ROOT = Path(__file__).resolve().parent
BASE = 'http://127.0.0.1:8082/'
checks, errors, failed, bad, methods, media_cancellations = [], [], [], [], [], []
completed = False

def ok(name, detail):
    checks.append({'name': name, 'status': 'passed', 'detail': detail})
    print('PASS:', name, flush=True)

def observe(page):
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.on('requestfailed', lambda request: (media_cancellations if request.resource_type=='media' and request.failure=='net::ERR_ABORTED' else failed).append({'url': request.url, 'failure': request.failure}))
    page.on('response', lambda response: bad.append({'url': response.url, 'status': response.status}) if response.status >= 400 else None)
    page.on('request', lambda request: methods.append(request.method))

def no_cart(page):
    expect(page.locator('.selection-button,.selection-count,.selection-modal,.selection-list,.item-add,[data-action="selection"],[data-action="add"],.cart,.cart-drawer')).to_have_count(0)

def booking_tab(page, link):
    with page.expect_popup() as popup_info:
        link.click()
    popup = popup_info.value
    observe(popup)
    popup.wait_for_load_state('networkidle')
    assert popup.url == BASE + 'rezervacija.html', popup.url
    no_cart(popup)
    popup.close()

try:
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path='/usr/bin/chromium', headless=True, args=['--no-sandbox'])
        ctx = browser.new_context(viewport={'width':1440,'height':1000}, accept_downloads=True)
        page = ctx.new_page()
        observe(page)
        response = page.goto(BASE, wait_until='networkidle')
        assert response.status == 200
        page.locator('img').evaluate_all('(imgs)=>imgs.forEach(img=>img.loading="eager")')
        page.wait_for_function('Array.from(document.images).every(img=>img.complete && img.naturalWidth>0)')
        expect(page.locator('h1')).to_contain_text('Dobro mesto.')
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
        menu = page.evaluate('window.PODRUMIZZA_MENU')
        counts = {'pizza':16,'rostilj':6,'salate':4,'deserti':3,'pica':6}
        assert len(menu) == 35
        assert page.evaluate('window.PODRUMIZZA_CATEGORIES.length') == 5
        assert page.evaluate('window.PODRUMIZZA_MENU.every(item=>Number.isFinite(item.price)&&item.price>0&&item.unit)')
        assert {cat:len([x for x in menu if x['category']==cat]) for cat in counts} == counts
        pizzas = [x for x in menu if x['category']=='pizza']
        assert [x['price'] for x in pizzas] == [740,870,840,940,1150,1100,1290,1190,1150,1050,1450,1090,950,1090,850,850]
        assert all(x['unit']=='32 cm' and x['source']=='provided-menu' for x in pizzas)
        assert all(x['source']=='concept' for x in menu if x['category']!='pizza')
        assert len({x['id'] for x in menu}) == 35
        assert pizzas[-1]['id']=='slatkicca' and pizzas[-1]['incomplete'] and 'nije potpun' in pizzas[-1]['allergenNote']
        expect(page.locator('#mobile-menu')).to_be_hidden()
        expect(page.locator('#mobile-menu details')).to_have_count(0)
        assert page.locator('.story-art img').evaluate('(img)=>Math.abs(img.clientWidth/img.clientHeight-1)<0.05')
        assert page.locator('.hero-image-wrap').evaluate('(x)=>Math.abs(x.clientHeight-504)<1')
        ok('desktop_layout_and_menu_source', 'Desktop original hero bounds and square story crop retained. Supplied pizza menu contains 16 exact prices, 32 cm sizes, source distinction and obscured-ingredient notice; other 19 concept items preserved. Mobile cards absent.')

        video=page.locator('#hero-video')
        page.wait_for_function('(() => {let v=document.querySelector("#hero-video");return v.readyState>=2&&!v.paused&&v.videoWidth===960})()')
        metadata=video.evaluate('(v)=>({duration:v.duration,muted:v.muted,loop:v.loop,inline:v.playsInline,width:v.videoWidth,height:v.videoHeight})')
        assert 15.8 < metadata['duration'] < 16.2 and metadata['muted'] and metadata['loop'] and metadata['inline']
        start_time=video.evaluate('(v)=>v.currentTime')
        page.wait_for_function('(start)=>document.querySelector("#hero-video").currentTime>start+.3',arg=start_time)
        expect(page.locator('#hero-video-toggle')).to_have_attribute('data-state','playing')
        page.screenshot(path=str(ROOT / 'desktop-videoframe.png'))
        page.locator('#hero-video-toggle').click()
        expect(page.locator('#hero-video-toggle')).to_have_attribute('data-state','paused')
        assert video.evaluate('(v)=>v.paused')
        page.locator('#meni').scroll_into_view_if_needed()
        page.evaluate('window.scrollTo({top:0,behavior:"instant"})')
        assert video.evaluate('(v)=>v.paused'), 'Manual pause must persist after offscreen return'
        page.locator('#hero-video-toggle').click()
        page.wait_for_function('!document.querySelector("#hero-video").paused')
        page.locator('#meni').scroll_into_view_if_needed()
        page.wait_for_function('document.querySelector("#hero-video").paused')
        page.evaluate('window.scrollTo({top:0,behavior:"instant"})')
        page.wait_for_function('!document.querySelector("#hero-video").paused')
        ok('hero_actual_video_and_controls', f'Silent H264 video decodes and advances frames ({metadata}); pause/resume works, offscreen playback pauses, manual pause persists.')

        reduced_ctx=browser.new_context(viewport={'width':1440,'height':1000},reduced_motion='reduce')
        reduced=reduced_ctx.new_page()
        observe(reduced)
        reduced.goto(BASE,wait_until='networkidle')
        reduced.wait_for_function('document.querySelector("#hero-video").readyState>=2')
        assert reduced.locator('#hero-video').evaluate('(v)=>v.paused&&!v.autoplay')
        expect(reduced.locator('#hero-video-toggle')).to_have_attribute('aria-label','Pokreni video')
        reduced.locator('#hero-video-toggle').click()
        reduced.wait_for_function('!document.querySelector("#hero-video").paused')
        reduced.locator('#hero-video-toggle').click()
        assert reduced.locator('#hero-video').evaluate('(v)=>v.paused')
        reduced_ctx.close()
        fallback_ctx=browser.new_context(viewport={'width':1440,'height':1000})
        fallback=fallback_ctx.new_page()
        fallback.route('**/hero-ambience.mp4',lambda route:route.abort())
        fallback.goto(BASE,wait_until='networkidle')
        expect(fallback.locator('#hero-video-fallback')).to_be_visible()
        expect(fallback.locator('#hero-video')).to_be_hidden()
        expect(fallback.locator('#hero-video-toggle')).to_be_hidden()
        assert fallback.locator('#hero-video-fallback').evaluate('(v)=>v.complete&&v.naturalWidth>0')
        fallback_ctx.close()
        ok('hero_reduced_motion_and_failure', 'Reduced motion defaults to paused and permits explicit playback. Forced video network failure displays original photograph and hides unavailable controls.')

        no_cart(page)
        booking_links = page.locator('a[href="rezervacija.html"]')
        visible = [link for link in booking_links.all() if link.is_visible()]
        assert len(visible) >= 5
        for link in visible:
            expect(link).to_have_attribute('target','_blank')
            booking_tab(page, link)
        ok('booking_links_and_no_cart', f'All {len(visible)} visible home booking links open the separate reservation page in a new browser tab; no cart/list/add UI remains.')

        for cat, count in counts.items():
            page.locator(f'#tab-{cat}').click()
            expect(page.locator(f'#tab-{cat}')).to_have_attribute('aria-selected', 'true')
            expect(page.locator('#menu-count')).to_have_text(f'{count} STAVKI')
            expect(page.locator('#menu-grid .menu-item')).to_have_count(min(6,count))
        page.locator('#tab-pizza').click()
        page.locator('[data-action="more"]').click()
        expect(page.locator('#menu-grid .menu-item')).to_have_count(16)
        ok('desktop_menu_categories_and_expansion', 'Desktop retains all five category tabs, correct item counts and six-to-sixteen pizza expansion.')
        page.locator('#menu-search').fill('rostilj')
        expect(page.locator('#menu-grid .menu-item')).not_to_have_count(0)
        expect(page.locator('#category-intro')).to_contain_text('Rezultati u svim kategorijama')
        page.locator('#menu-search').fill('šampinjoni')
        accented=page.locator('#menu-grid .menu-item').count()
        page.locator('#menu-search').fill('sampinjoni')
        expect(page.locator('#menu-grid .menu-item')).to_have_count(accented)
        assert accented>0
        page.locator('#menu-search').fill('zzzz-no-such-food')
        expect(page.locator('.empty-menu')).to_be_visible()
        page.locator('[data-action="reset"]').click()
        expect(page.locator('#menu-search')).to_have_value('')
        expect(page.locator('#menu-grid .menu-item')).to_have_count(6)
        ok('desktop_search', 'Global ingredient search ignores Serbian diacritics; empty results and reset work.')

        details=page.locator('.item-name[data-id="margherita"]')
        details.click()
        expect(page.locator('[role="dialog"]')).to_be_visible()
        expect(page.locator('#modal-title')).to_have_text('Margherita')
        expect(page.locator('.modal-details')).to_contain_text('mozzarella')
        expect(page.locator('.modal-details')).to_contain_text('gluten')
        expect(page.locator('.allergen-notice')).to_contain_text('potvrđuje osoblje')
        expect(page.locator('.proposed-price-label')).to_have_text('CENA SA MENIJA')
        expect(page.locator('.modal-bottom')).to_contain_text('740')
        expect(page.locator('.modal-close')).to_be_focused()
        page.keyboard.press('Shift+Tab')
        expect(page.locator('.modal a[href="rezervacija.html"]')).to_be_focused()
        page.keyboard.press('Tab')
        expect(page.locator('.modal-close')).to_be_focused()
        booking_tab(page,page.locator('.modal a[href="rezervacija.html"]'))
        page.keyboard.press('Escape')
        expect(page.locator('[role="dialog"]')).to_have_count(0)
        expect(details).to_be_focused()
        page.locator('[data-action="more"]').click()
        page.locator('.item-name[data-id="slatkicca"]').click()
        expect(page.locator('.allergen-notice')).to_contain_text('zaklonjen')
        expect(page.locator('.allergen-notice')).to_contain_text('nije potpun')
        page.keyboard.press('Escape')
        page.locator('#tab-pica').click()
        page.locator('.item-name').first.click()
        expect(page.locator('.proposed-price-label')).to_have_text('PREDLOG CENE')
        page.keyboard.press('Escape')
        ok('details_source_allergens_and_focus', 'Pizza detail shows supplied price; drinks show concept price. Incomplete Slatkicca flags obscured ingredients. Focus trap, Escape, restored focus and new-tab booking work.')
        page.locator('#tab-pizza').click()
        page.locator('#tab-pizza').focus()
        page.keyboard.press('ArrowRight')
        expect(page.locator('#tab-rostilj')).to_be_focused()
        expect(page.locator('#tab-rostilj')).to_have_attribute('aria-selected','true')
        page.keyboard.press('End')
        expect(page.locator('#tab-pica')).to_be_focused()
        page.keyboard.press('Home')
        expect(page.locator('#tab-pizza')).to_be_focused()
        assert page.locator('a[target="_blank"]').evaluate_all('(links)=>links.every(a=>a.rel.includes("noopener")&&a.rel.includes("noreferrer"))')
        ok('keyboard_and_links', 'Tabs support arrows/Home/End; external links retain opener/privacy protections.')

        for width in [320,390,760]:
            mobile_ctx=browser.new_context(viewport={'width':width,'height':844},is_mobile=True,has_touch=True)
            phone=mobile_ctx.new_page()
            observe(phone)
            phone.goto(BASE,wait_until='networkidle')
            phone.locator('img').evaluate_all('(imgs)=>imgs.forEach(img=>img.loading="eager")')
            phone.wait_for_function('Array.from(document.images).every(img=>img.complete&&img.naturalWidth>0)')
            assert phone.evaluate('document.documentElement.scrollWidth<=innerWidth'),f'Overflow at {width}'
            expect(phone.locator('#mobile-menu')).to_be_visible()
            expect(phone.locator('#mobile-menu details')).to_have_count(5)
            for hidden in ['#category-tabs','#menu-grid','.menu-category-heading']:
                expect(phone.locator(hidden)).to_be_hidden()
            assert phone.locator('#category-tabs button,#menu-grid button').evaluate_all('(items)=>items.every(x=>x.getClientRects().length===0)')
            assert phone.locator('.story-art img').evaluate('(img)=>Math.abs(img.clientWidth/img.clientHeight-1.15)<0.05')
            for cat,count in counts.items():
                group=phone.locator(f'details[data-category="{cat}"]')
                assert not group.evaluate('(x)=>x.open')
                expect(group.locator('.mobile-menu-item')).to_have_count(count)
                group.locator('summary').focus()
                phone.keyboard.press('Enter')
                assert group.evaluate('(x)=>x.open')
                expect(group.locator('.mobile-menu-item').first).to_be_visible()
                assert phone.evaluate('document.documentElement.scrollWidth<=innerWidth'),f'Accordion overflow at {width}/{cat}'
                group.locator('summary').click()
                assert not group.evaluate('(x)=>x.open')
            phone.locator('#mobile-summary-pizza').click()
            phone.locator('.mobile-item-name[data-id="margherita"]').click()
            expect(phone.locator('#modal-title')).to_have_text('Margherita')
            expect(phone.locator('.proposed-price-label')).to_have_text('CENA SA MENIJA')
            assert phone.evaluate('document.documentElement.scrollWidth<=innerWidth'),f'Dialog overflow at {width}'
            phone.keyboard.press('Escape')
            expect(phone.locator('.mobile-item-name[data-id="margherita"]')).to_be_focused()
            phone.locator('#mobile-summary-pizza').click()
            phone.locator('#menu-search').fill('sampinjoni')
            results=phone.locator('.mobile-menu-item').count()
            assert results>0
            assert phone.locator('#mobile-menu details').evaluate_all('(items)=>items.every(x=>x.open)')
            phone.locator('#menu-search').fill('šampinjoni')
            expect(phone.locator('.mobile-menu-item')).to_have_count(results)
            phone.locator('#menu-search').fill('limunada')
            expect(phone.locator('#mobile-menu details')).to_have_count(1)
            expect(phone.locator('#mobile-menu details')).to_have_attribute('data-category','pica')
            expect(phone.locator('.mobile-item-name').first).to_contain_text('limunada',ignore_case=True)
            phone.locator('#menu-search').fill('zzzz-no-such-food')
            expect(phone.locator('.mobile-menu-empty')).to_be_visible()
            expect(phone.locator('#mobile-menu details')).to_have_count(0)
            phone.locator('[data-mobile-clear]').click()
            expect(phone.locator('#menu-search')).to_have_value('')
            expect(phone.locator('#mobile-menu details')).to_have_count(5)
            assert phone.locator('#mobile-menu details').evaluate_all('(items)=>items.every(x=>!x.open)')
            phone.locator('.mobile-nav-toggle').click()
            expect(phone.locator('#mobile-nav')).to_be_visible()
            phone.locator('#mobile-nav a[href="#meni"]').click()
            expect(phone.locator('#mobile-nav')).to_be_hidden()
            phone.locator('.mobile-nav-toggle').click()
            phone.keyboard.press('Escape')
            expect(phone.locator('#mobile-nav')).to_be_hidden()
            booking_tab(phone,phone.locator('.mobile-reservation-link'))
            no_cart(phone)
            if width==390:
                phone.evaluate('document.activeElement?.blur();window.scrollTo({top:0,behavior:"instant"})')
                phone.screenshot(path=str(ROOT/'mobile.png'),full_page=True)
                phone.screenshot(path=str(ROOT/'mobile-viewport.png'))
                phone.locator('.mobile-category-image').evaluate_all('(imgs)=>Promise.all(imgs.map(img=>img.decode()))')
                phone.locator('#mobile-menu').evaluate('(x)=>window.scrollTo({top:scrollY+x.getBoundingClientRect().top-20,behavior:"instant"})')
                phone.locator('#mobile-menu').screenshot(path=str(ROOT/'mobile-menu.png'),style='.skip-link{visibility:hidden!important}')
                phone.locator('#mobile-summary-pizza').click()
                phone.locator('#mobile-summary-pizza').evaluate('(x)=>window.scrollTo({top:scrollY+x.getBoundingClientRect().top-20,behavior:"instant"})')
                phone.screenshot(path=str(ROOT/'mobile-menu-open.png'))
            phone.set_viewport_size({'width':761,'height':1000})
            expect(phone.locator('#mobile-menu')).to_be_hidden()
            expect(phone.locator('#mobile-menu details')).to_have_count(0)
            expect(phone.locator('#category-tabs')).to_be_visible()
            expect(phone.locator('#menu-grid')).to_be_visible()
            phone.set_viewport_size({'width':width,'height':844})
            expect(phone.locator('#mobile-menu details')).to_have_count(5)
            expect(phone.locator('#menu-grid')).to_be_hidden()
            mobile_ctx.close()
        ok('mobile_photo_accordions_search_and_transition', 'At 320/390/760px only five photographic disclosures display (16/6/4/3/6). Native Enter toggles every category; correct details/focus, accent-insensitive search, auto-open, drinks search, no-results/reset and nav/new-tab booking pass. At 761px desktop tabs return without duplicate focusable menu.')

        for width in [761,768,1024,1300,1440]:
            page.set_viewport_size({'width':width,'height':1000})
            page.goto(BASE,wait_until='networkidle')
            assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),f'Overflow at {width}'
            expect(page.locator('#mobile-menu')).to_be_hidden()
            expect(page.locator('#category-tabs')).to_be_visible()
        page.evaluate('document.activeElement?.blur();window.scrollTo({top:0,behavior:"instant"})')
        page.screenshot(path=str(ROOT/'desktop.png'),full_page=True)
        page.screenshot(path=str(ROOT/'desktop-viewport.png'))
        ok('desktop_intermediate_widths', 'Original desktop presentation retained without horizontal overflow at 761/768/1024/1300/1440px.')

        reservation_ctx = browser.new_context(viewport={'width':1440,'height':1000}, timezone_id='Europe/Budapest', accept_downloads=True)
        reservation = reservation_ctx.new_page()
        observe(reservation)
        reservation.goto(BASE + 'rezervacija.html', wait_until='networkidle')
        no_cart(reservation)
        reservation.screenshot(path=str(ROOT / 'reservation.png'), full_page=True)
        reservation.screenshot(path=str(ROOT / 'reservation-viewport.png'))
        expect(reservation.locator('#meal-later')).to_be_checked()
        expect(reservation.locator('#advance-meal-fields')).to_be_hidden()
        expect(reservation.locator('#meal-dishes')).to_be_disabled()
        reservation.locator('#guest-count').fill('')
        reservation.locator('#prepare-request').click()
        expect(reservation.locator('#form-errors')).to_be_visible()
        for selector in ['#guest-name','#guest-phone','#reservation-date','#reservation-time','#guest-count']:
            expect(reservation.locator(selector)).to_have_attribute('aria-invalid','true')
        expect(reservation.locator('#reservation-summary')).to_be_hidden()
        for invalid_count in ['0','1.5','51']:
            reservation.locator('#guest-count').fill(invalid_count)
            reservation.locator('#prepare-request').click()
            expect(reservation.locator('#guests-error')).to_be_visible()
            expect(reservation.locator('#reservation-summary')).to_be_hidden()
        ok('reservation_required_guests', 'Required contact/date/time/guests errors shown; empty, zero, fractional and over-limit guest counts cannot prepare a request.')

        name = 'QA <b>& "Test"'
        phone = '+381 64 123 4567'
        email = 'reservation-qa@example.invalid'
        note = '<img src=x onerror="window.__qaXss=1"> & <b>QA</b>'
        dietary = 'Alergija na lešnik — proveriti sa osobljem.'
        dates = reservation.evaluate('''() => {
            const format = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
            const now = new Date(), yesterday = new Date(now), future = new Date(now);
            yesterday.setDate(now.getDate()-1); future.setDate(now.getDate()+2);
            return {today:format(now),yesterday:format(yesterday),future:format(future)};
        }''')
        reservation.locator('#guest-name').fill(name)
        reservation.locator('#guest-phone').fill('not-a-phone')
        reservation.locator('#guest-email').fill('invalid-email')
        reservation.locator('#guest-count').fill('4')
        reservation.locator('#reservation-date').fill(dates['yesterday'])
        reservation.locator('#reservation-time').fill('19:30')
        reservation.locator('#prepare-request').click()
        for selector in ['#phone-error','#email-error','#date-error']:
            expect(reservation.locator(selector)).to_be_visible()
        reservation.locator('#guest-phone').fill(phone)
        reservation.locator('#guest-email').fill(email)
        reservation.locator('#reservation-date').fill(dates['today'])
        reservation.locator('#reservation-time').fill('00:00')
        reservation.locator('#prepare-request').click()
        expect(reservation.locator('#time-error')).to_be_visible()
        expect(reservation.locator('#reservation-summary')).to_be_hidden()
        ok('reservation_contact_and_time_validation', 'Invalid phone/e-mail, past dates and a past time on today’s date are rejected.')

        reservation.locator('#reservation-date').fill(dates['future'])
        reservation.locator('#reservation-time').fill('19:30')
        reservation.locator('#dietary-note').fill(dietary)
        reservation.locator('#visit-note').fill(note)
        reservation.locator('#meal-advance').check()
        expect(reservation.locator('#meal-dishes')).to_be_enabled()
        assert reservation.locator('#meal-dishes').get_attribute('required') is not None
        reservation.locator('#prepare-request').click()
        expect(reservation.locator('#dishes-error')).to_be_visible()
        expect(reservation.locator('#reservation-summary')).to_be_hidden()
        dishes = '2 × Margherita; 1 × roštilj plata za deljenje.'
        reservation.locator('#meal-dishes').fill(dishes)
        reservation.locator('#meal-later').check()
        reservation.locator('#prepare-request').click()
        expect(reservation.locator('#reservation-summary')).to_be_visible()
        expect(reservation.locator('#reservation-form-view')).to_be_hidden()
        expect(reservation.locator('#summary-heading')).to_have_text('Vaš upit je spreman.')
        expect(reservation.locator('.summary-unconfirmed')).to_contain_text('Rezervacija još nije potvrđena.')
        summary_rows = reservation.locator('#reservation-summary-details').evaluate('(dl)=>Object.fromEntries(Array.from(dl.children).map(row=>[row.querySelector("dt").textContent,row.querySelector("dd").textContent]))')
        assert summary_rows['Ime i prezime'] == name
        assert summary_rows['Telefon'] == phone and summary_rows['E-mail'] == email
        assert summary_rows['Broj gostiju'] == '4'
        assert '19:30' in summary_rows['Željeni termin']
        assert summary_rows['Dogovor oko obroka'] == 'Odlučićemo kada dođemo'
        assert 'Željena jela i količine' not in summary_rows
        assert summary_rows['Napomena'] == note
        expect(reservation.locator('#reservation-summary-details img,#reservation-summary-details b,#reservation-summary-details script')).to_have_count(0)
        assert reservation.evaluate('window.__qaXss === undefined')
        reservation.evaluate("Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async(text)=>{window.__qaClipboard=text}}})")
        reservation.locator('#copy-request').click()
        expect(reservation.locator('#request-copy-status')).to_contain_text('Upit je kopiran.')
        later_text = reservation.evaluate('window.__qaClipboard')
        assert 'Jela ćemo izabrati kada dođemo, bez pripreme unapred.' in later_text
        assert dishes not in later_text
        ok('reservation_meal_choices_and_safe_summary', 'Decide-on-arrival is default; advance meal needs dishes; later choice excludes stale dishes. Summary contains exact party/contact/time data and escapes markup safely without claiming confirmation.')

        reservation.locator('#edit-request').click()
        expect(reservation.locator('#reservation-form-view')).to_be_visible()
        for selector, value in [('#guest-name',name),('#guest-phone',phone),('#guest-email',email),('#guest-count','4'),('#reservation-date',dates['future']),('#reservation-time','19:30'),('#dietary-note',dietary),('#visit-note',note),('#meal-dishes',dishes)]:
            expect(reservation.locator(selector)).to_have_value(value)
        reservation.locator('#meal-advance').check()
        reservation.locator('#prepare-request').click()
        expect(reservation.locator('#reservation-summary-details')).to_contain_text(dishes)
        expect(reservation.locator('#reservation-summary-details')).to_contain_text('Želimo da izaberemo jela unapred')
        expect(reservation.locator('#reservation-summary-details')).to_contain_text('Da jela budu spremna za dogovoreno vreme dolaska, ako restoran potvrdi.')
        reservation.evaluate("Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async(text)=>{window.__qaClipboard=text}}})")
        reservation.locator('#copy-request').click()
        expect(reservation.locator('#request-copy-status')).to_contain_text('Upit je kopiran.')
        copied = reservation.evaluate('window.__qaClipboard')
        for expected in [name,phone,email,'Broj gostiju: 4','19:30',dishes,dietary,note,'Ovo je upit, ne potvrđena rezervacija.','Ništa nije automatski poslato.']:
            assert expected in copied, expected
        assert 'navedena jela budu spremna u vreme dolaska' in copied
        assert 'bez pripreme unapred' not in copied
        reservation.evaluate("Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw new Error('Force download fallback')}}})")
        with reservation.expect_download() as download_info:
            reservation.locator('#copy-request').click()
        download = download_info.value
        assert download.suggested_filename == 'Podrumizza-upit-za-rezervaciju.txt'
        download.save_as(ROOT / 'reservation-request.txt')
        downloaded = (ROOT / 'reservation-request.txt').read_text(encoding='utf-8-sig')
        assert downloaded == copied
        storage = reservation.evaluate('JSON.stringify({local:localStorage,session:sessionStorage})')
        for private in [name,phone,email,dishes,dietary,note]:
            assert private not in storage
        # Capture a clean representative request after completing malicious-input checks.
        reservation.locator('#edit-request').click()
        reservation.locator('#guest-name').fill('Ana Jovanović')
        reservation.locator('#guest-email').fill('ana@example.invalid')
        reservation.locator('#visit-note').fill('Rođendan. Mirniji sto ako je moguće.')
        reservation.locator('#prepare-request').click()
        reservation.evaluate('document.activeElement?.blur(); window.scrollTo({top:0,behavior:"instant"})')
        reservation.screenshot(path=str(ROOT / 'reservation-summary.png'),full_page=True)
        reservation.reload(wait_until='networkidle')
        expect(reservation.locator('#guest-name')).to_have_value('')
        expect(reservation.locator('#guest-phone')).to_have_value('')
        expect(reservation.locator('#visit-note')).to_have_value('')
        expect(reservation.locator('#reservation-summary')).to_be_hidden()
        ok('reservation_edit_copy_and_privacy', 'Edit preserves all entered values; advance food appears in summary and identical clipboard/TXT content. Personal fields never enter local/session storage and clear on reload. Nothing is sent automatically.')

        for width in [320,390,768,1024,1300]:
            reservation.set_viewport_size({'width':width,'height':844})
            assert reservation.evaluate('document.documentElement.scrollWidth <= innerWidth'), f'Reservation overflow at {width}'
            no_cart(reservation)
            if width == 390:
                reservation.evaluate('document.activeElement?.blur(); window.scrollTo({top:0,behavior:"instant"})')
                reservation.screenshot(path=str(ROOT / 'reservation-mobile.png'),full_page=True)
        ok('reservation_responsive', 'Reservation form has no horizontal overflow at 320, 390, 768, 1024 and 1300px; no cart or saved-list controls.')
        reservation_ctx.close()
        assert not any(method != 'GET' for method in methods), methods
        assert not errors, errors
        assert not failed, failed
        assert not bad, bad
        ok('runtime_assets', 'No browser page errors, failed asset requests or HTTP errors. Browser-cancelled media reads during lifecycle changes are recorded separately; the forced-failure scenario is isolated.')
        completed = True
        browser.close()
except Exception as error:
    checks.append({'name':'execution', 'status':'failed', 'detail':str(error)})
    raise
finally:
    report={'checks':checks,'page_errors':errors,'failed_requests':failed,'http_errors':bad,'media_lifecycle_cancellations':media_cancellations}
    (ROOT / 'report-run.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    if completed:
        (ROOT / 'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(report,ensure_ascii=False,indent=2))

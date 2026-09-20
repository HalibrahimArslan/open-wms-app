#!/usr/bin/env python3
"""public/ altindaki marka varliklarini tek bir geometriden uretir.

Calistirmak icin: python3 scripts/brand-assets.py (Pillow gerekir).

Kaynak geometri src/components/Brand/BrandMark.jsx ile aynidir (48x48):
  sol bay   : 5,5   16x38  r4  opaklik 0.45
  sag ust   : 25,5  18x17  r4  opaklik 1
  sag alt   : 25,26 18x17  r4  opaklik 0.45
"""
import os
from PIL import Image, ImageDraw

OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'public')
SS = 8  # supersampling

BRAND = (88, 41, 49)        # #582931
GRAD_A = (110, 53, 63)      # #6E353F
GRAD_B = (74, 33, 41)       # #4A2129

PARTS = [
    (5, 5, 16, 38, 4, 0.45),
    (25, 5, 18, 17, 4, 1.0),
    (25, 26, 18, 17, 4, 0.45),
]


def draw_mark(size, color):
    """Isareti `size` piksellik saydam bir kare uzerine cizer."""
    big = size * SS
    img = Image.new('RGBA', (big, big), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    k = big / 48.0
    for x, y, w, h, r, op in PARTS:
        d.rounded_rectangle(
            [x * k, y * k, (x + w) * k, (y + h) * k],
            radius=r * k,
            fill=color + (int(round(255 * op)),),
        )
    return img.resize((size, size), Image.LANCZOS)


def gradient(size):
    """Kosegen bordo gecis. Her satir icin tek renk yeterli degil, koseden
    koseye gittigi icin piksel basina hesaplanir."""
    img = Image.new('RGB', (size, size))
    px = img.load()
    for y in range(size):
        for x in range(size):
            t = (x / (size - 1) * 0.35 + y / (size - 1) * 0.65)
            px[x, y] = tuple(int(round(GRAD_A[i] + (GRAD_B[i] - GRAD_A[i]) * t)) for i in range(3))
    return img


def app_icon(size, glyph_ratio, corner_ratio=None):
    """Uygulama ikonu: bordo gecisli zemin uzerinde beyaz isaret."""
    big = size * SS
    bg = gradient(big).convert('RGBA')
    if corner_ratio:
        mask = Image.new('L', (big, big), 0)
        ImageDraw.Draw(mask).rounded_rectangle([0, 0, big - 1, big - 1], radius=int(big * corner_ratio), fill=255)
        bg.putalpha(mask)
    bg = bg.resize((size, size), Image.LANCZOS)

    g = int(round(size * glyph_ratio))
    glyph = draw_mark(g, (255, 255, 255))
    off = (size - g) // 2
    bg.alpha_composite(glyph, (off, off))
    return bg


def svg_favicon():
    c = '#582931'
    rects = '\n  '.join(
        '<rect x="%g" y="%g" width="%g" height="%g" rx="%g"%s/>' % (
            x, y, w, h, r, '' if op == 1.0 else ' fill-opacity="%g"' % op)
        for x, y, w, h, r, op in PARTS
    )
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="%s">\n'
        '  <style>\n'
        '    /* Koyu tarayici arayuzunde bordo sekme seridinde kayboluyor;\n'
        '       isaret o zaman acik bordo tonuna doner. */\n'
        '    @media (prefers-color-scheme: dark) { svg { fill: #E0BFC4; } }\n'
        '  </style>\n'
        '  %s\n'
        '</svg>\n' % (c, rects)
    )


if __name__ == '__main__':
    with open(os.path.join(OUT, 'brand-mark.svg'), 'w') as f:
        f.write(svg_favicon())

    # Sekme ikonu: kapsiz, duz bordo isaret.
    ico = draw_mark(256, BRAND)
    ico.save(os.path.join(OUT, 'favicon.ico'), sizes=[(16, 16), (32, 32), (48, 48)])

    # Uygulama ikonlari: bordo kap + beyaz isaret.
    app_icon(192, 0.58, corner_ratio=0.22).save(os.path.join(OUT, 'logo192.png'))
    # 512 "any maskable" olarak bildirildigi icin tam tasan kare zemin;
    # isaret de maskeleme guvenli alani icinde kalsin diye daha kucuk.
    app_icon(512, 0.54).save(os.path.join(OUT, 'logo512.png'))
    # iOS koseyi kendi yuvarlatir, bu yuzden kare birakilir.
    app_icon(180, 0.58).save(os.path.join(OUT, 'apple-touch-icon.png'))

    for n in ['brand-mark.svg', 'favicon.ico', 'logo192.png', 'logo512.png', 'apple-touch-icon.png']:
        print(n, os.path.getsize(os.path.join(OUT, n)), 'bayt')

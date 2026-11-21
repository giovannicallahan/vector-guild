#!/usr/bin/env python3
"""Draws the MathCosmos install icons from the brand mark (a lime square outline, a diamond and a small star
on the game's dark background). No network, no fonts: shapes only, so the result is the same everywhere.
Run: python3 tools/make-icons.py   (needs Pillow). Writes game/icons/*.png."""
import math, os
from PIL import Image, ImageDraw

BG = (8, 17, 20, 255)        # --void  #081114
LIME = (212, 243, 106, 255)  # --lime  #d4f36a
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'game', 'icons')
SS = 4  # supersample, then scale down for smooth edges


def draw(size, mark):
    """mark = share of the canvas the square mark takes (smaller for maskable: the safe zone is the middle 80%)."""
    n = size * SS
    im = Image.new('RGBA', (n, n), BG)
    d = ImageDraw.Draw(im)
    c = n / 2
    half = n * mark / 2
    w = max(2, round(n * mark * 0.035))
    d.rectangle([c - half, c - half, c + half, c + half], outline=LIME, width=w)
    r = half * 0.66  # diamond
    d.line([(c, c - r), (c + r, c), (c, c + r), (c - r, c), (c, c - r)], fill=LIME, width=w, joint='curve')
    for x, y in ((c, c - r), (c + r, c), (c, c + r), (c - r, c)):
        d.ellipse([x - w / 2, y - w / 2, x + w / 2, y + w / 2], fill=LIME)
    s = half * 0.24  # eight-point star in the middle
    sw = max(2, round(w * 0.8))
    for k in range(4):
        a = math.pi * k / 4
        dx, dy = math.cos(a) * s, math.sin(a) * s
        d.line([(c - dx, c - dy), (c + dx, c + dy)], fill=LIME, width=sw)
    return im.resize((size, size), Image.LANCZOS).convert('RGB')


os.makedirs(OUT, exist_ok=True)
for name, size, mark in (('icon-192.png', 192, 0.66), ('icon-512.png', 512, 0.66),
                         ('icon-maskable-512.png', 512, 0.5), ('icon-180.png', 180, 0.62)):
    draw(size, mark).save(os.path.join(OUT, name), optimize=True)
    print('wrote game/icons/' + name)

"""Generate PWA icons for CMFAS Study. Run once; output committed to public/icons."""
from PIL import Image, ImageDraw, ImageFont

NAVY = (15, 23, 42, 255)      # #0f172a
ACCENT = (56, 189, 248, 255)  # #38bdf8
OUT = r"E:/Kai/Projects/CMFAS-Study/public/icons"


def load_font(size):
    for path in (
        "C:/Windows/Fonts/segoeuib.ttf",
        "C:/Windows/Fonts/arialbd.ttf",
        "C:/Windows/Fonts/arial.ttf",
    ):
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            continue
    return ImageFont.load_default()


def draw_icon(size, maskable=False):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    if maskable:
        # Full-bleed navy, mark kept inside the safe center.
        d.rectangle([0, 0, size, size], fill=NAVY)
        mark_scale = 0.44
    else:
        radius = int(size * 0.22)
        d.rounded_rectangle([0, 0, size, size], radius=radius, fill=NAVY)
        mark_scale = 0.52

    # Accent underline bar beneath the letters.
    text = "CM"
    font = load_font(int(size * mark_scale))
    box = d.textbbox((0, 0), text, font=font)
    tw, th = box[2] - box[0], box[3] - box[1]
    tx = (size - tw) / 2 - box[0]
    ty = (size - th) / 2 - box[1] - size * 0.04
    d.text((tx, ty), text, font=font, fill=ACCENT)

    bar_w = tw * 0.9
    bar_h = max(3, int(size * 0.05))
    bx0 = (size - bar_w) / 2
    by0 = ty + th + size * 0.10
    d.rounded_rectangle([bx0, by0, bx0 + bar_w, by0 + bar_h], radius=bar_h // 2, fill=(148, 163, 184, 255))
    return img


draw_icon(192).save(f"{OUT}/icon-192.png")
draw_icon(512).save(f"{OUT}/icon-512.png")
draw_icon(512, maskable=True).save(f"{OUT}/icon-512-maskable.png")
print("icons written to", OUT)

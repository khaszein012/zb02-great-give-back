"""Generate flat placeholder art for Episode 3 so the build and tests run before real art exists.

Every file is written with the exact dimensions the layout expects, so swapping in Lovable
output later is a drop-in replacement. Run from anywhere; paths are resolved from this file.
"""
import pathlib

from PIL import Image, ImageDraw

ASSETS = pathlib.Path(__file__).resolve().parents[1] / "src" / "assets"

# Warm botanical palette, close to the shipped Episode 2 art so the two episodes sit together.
PALETTE = {
    "paper": (244, 236, 219),
    "cream": (250, 245, 234),
    "mustard": (214, 163, 70),
    "terracotta": (191, 111, 78),
    "sage": (139, 158, 126),
    "dusty": (124, 149, 173),
    "navy": (44, 62, 88),
    "ink": (58, 50, 44),
    "plum": (146, 106, 128),
}


def gradient(size, top, bottom):
    """Vertical two-colour wash, roughly matching gouache-on-paper shading."""
    w, h = size
    img = Image.new("RGB", size, top)
    draw = ImageDraw.Draw(img)
    for y in range(h):
        t = y / max(1, h - 1)
        draw.line(
            [(0, y), (w, y)],
            fill=tuple(round(top[i] + (bottom[i] - top[i]) * t) for i in range(3)),
        )
    return img


def stamp(img, label):
    """Small corner tick so a placeholder is never mistaken for final art."""
    draw = ImageDraw.Draw(img)
    w, h = img.size
    pad = max(12, w // 60)
    draw.text((pad, h - pad - 12), f"{label}  {w}x{h}", fill=PALETTE["ink"])
    return img


def build(name, size, top, bottom):
    img = gradient(size, PALETTE[top], PALETTE[bottom])
    stamp(img, name)
    img.save(ASSETS / f"{name}.jpg", quality=88)
    print(f"{name}.jpg  {size[0]}x{size[1]}")


def main():
    ASSETS.mkdir(parents=True, exist_ok=True)

    # World map and story art
    build("gadgeton", (1920, 1080), "dusty", "sage")
    build("story-give-back", (1536, 1024), "mustard", "paper")

    # Nine chapter illustrations at 4:3, the ratio the reader actually displays.
    chapter_moods = [
        ("dusty", "paper"), ("dusty", "sage"), ("mustard", "paper"), ("sage", "cream"),
        ("terracotta", "mustard"), ("dusty", "cream"), ("plum", "dusty"), ("navy", "plum"),
        ("mustard", "cream"),
    ]
    for i, (top, bottom) in enumerate(chapter_moods):
        build(f"chapter-{i}", (1536, 1152), top, bottom)

    # Mission backdrops, activity cards and pairs.
    for name, size, top, bottom in [
        ("gadget-garage", (1536, 1024), "dusty", "navy"),
        ("borrow-bench", (1536, 1024), "sage", "cream"),
        ("vault", (1536, 1024), "plum", "navy"),
        ("festival-green", (1536, 1024), "mustard", "sage"),
        ("sign-shop", (1536, 1024), "terracotta", "paper"),
        ("globe-room", (1536, 1024), "dusty", "cream"),
        ("magpie-nest", (1536, 1024), "navy", "plum"),
    ]:
        build(name, size, top, bottom)

    # Square cards: six gadgets and six people/pair cards.
    for name in ["gadget-computer", "gadget-tv", "gadget-dvd", "gadget-cd", "gadget-mp3", "gadget-camera"]:
        build(name, (768, 768), "cream", "dusty")
    for name in ["card-amys-camera", "card-leos-computer", "card-hollys-dvd", "card-maxs-cd", "card-our-house", "card-their-class"]:
        build(name, (768, 768), "paper", "sage")

    # Magic E pairs: short word and long word, same 8:7 card.
    for word in ["cap", "cape", "kit", "kite", "not", "note", "cub", "cube"]:
        build(f"magic-{word}", (768, 672), "mustard", "cream")

    # Equator and hemisphere diagrams.
    for name in ["globe-equator", "globe-brazil", "globe-both"]:
        build(name, (768, 768), "dusty", "sage")


if __name__ == "__main__":
    main()
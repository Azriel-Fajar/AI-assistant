"""
Rielcode starter ad scene.
Render preview:  manim -ql rielcode_ad.py RielcodeAd
Render 1080p:    manim -qh rielcode_ad.py RielcodeAd
Vertical (reels): manim -qh -r 1080,1920 rielcode_ad.py RielcodeAd
Output: media/videos/
"""

from manim import *

# Rielcode brand tokens (from my-video/src/RielcodeAd/theme.ts)
BG = "#f4f1e9"       # warm cream
GREEN = "#2e4636"    # primary
GREEN_DARK = "#223529"
INK = "#1a1a1a"      # headlines
MUTED = "#6b6b5e"    # body / labels
BORDER = "#d8d3c4"

# Fonts: Fraunces (headlines), Inter (body). Falls back if not installed.
HEAD_FONT = "Fraunces"
BODY_FONT = "Inter"

config.background_color = BG


class RielcodeAd(Scene):
    def construct(self):
        # Hook
        hook = Text("Bisnismu belum punya website?", font=BODY_FONT, color=MUTED, weight=MEDIUM).scale(0.55)
        hook.to_edge(UP, buff=1.2)
        self.play(FadeIn(hook, shift=UP * 0.3), run_time=0.6)

        # Headline (forest green block, editorial)
        line1 = Text("Website Profesional", font=HEAD_FONT, color=GREEN, weight=BOLD).scale(0.95)
        line2 = Text("untuk Bisnismu", font=HEAD_FONT, color=GREEN, weight=BOLD).scale(0.95)
        headline = VGroup(line1, line2).arrange(DOWN, buff=0.25).move_to(ORIGIN)
        self.play(Write(headline), run_time=1.0)
        self.wait(0.3)

        # Value points
        points = VGroup(
            Text("Desain custom", font=BODY_FONT, color=INK).scale(0.5),
            Text("Cepat, responsif, siap online", font=BODY_FONT, color=INK).scale(0.5),
            Text("Mulai dari IDR 500rb", font=BODY_FONT, color=INK).scale(0.5),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.3)
        dots = VGroup(*[Dot(color=GREEN, radius=0.06) for _ in points])
        rows = VGroup(*[VGroup(d, p).arrange(RIGHT, buff=0.25) for d, p in zip(dots, points)])
        rows.arrange(DOWN, aligned_edge=LEFT, buff=0.3).next_to(headline, DOWN, buff=0.7)
        for row in rows:
            self.play(FadeIn(row, shift=RIGHT * 0.3), run_time=0.4)

        self.wait(0.4)
        self.play(FadeOut(hook), FadeOut(headline), FadeOut(rows), run_time=0.5)

        # CTA card
        card = RoundedRectangle(width=7, height=2.4, corner_radius=0.2,
                                fill_color=GREEN, fill_opacity=1, stroke_width=0)
        brand = Text("Rielcode", font=HEAD_FONT, color=BG, weight=BOLD).scale(0.8)
        cta = Text("Chat sekarang, gratis konsultasi", font=BODY_FONT, color=BORDER).scale(0.45)
        group = VGroup(brand, cta).arrange(DOWN, buff=0.35).move_to(card)
        self.play(FadeIn(card, scale=0.9), run_time=0.5)
        self.play(Write(group), run_time=0.8)
        self.wait(1.0)

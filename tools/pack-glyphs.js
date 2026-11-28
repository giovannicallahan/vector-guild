/* Landmark art for tools/new-pack.js: small SVG drawings for the outpost ridge, picked by key in a pack spec
   (docs/PACK-SPEC.md, chapters[].landmark.glyph). Same style as the landmarks of the three 2.5 packs: drawn around
   (0, 0) on the ground line, at most about 20 units to each side and 40 up (negative y is up), in the outpost
   palette below, with no text, no ids and no scripts. The first three groups are the landmarks the shipped packs
   already use, copied unchanged, so a spec may reuse one; the last group is new and generic.
   Palette: lines #b4cead #93b6a0 #8cddd4 #82b8b2; fills #496866 #3f6a5a #607669 #73c6d2; lights #d4f36a #f3c37b;
   dark #203a3d. */
'use strict';
const GLYPHS = {
  /* Calculus 1 (game/realms/calc1/pack.js) */
  'tracking-dish': '<path d="M0 0V-16" stroke="#b4cead" stroke-width="3"/><path d="M-13 -30A15 15 0 0 0 13 -18Z" fill="#496866" stroke="#b4cead"/><path d="M0 -24L9 -36" stroke="#d4f36a" stroke-width="2"/><circle cx="10" cy="-37" r="2.5" fill="#d4f36a"/>',
  'pump-house': '<rect x="-14" y="-14" width="20" height="14" fill="#3f6a5a" stroke="#b4cead"/><path d="M6 -8H16V0" stroke="#82b8b2" stroke-width="3" fill="none"/><circle cx="-4" cy="-7" r="4" fill="none" stroke="#d4f36a" stroke-width="2"/>',
  'speed-gate': '<path d="M-14 0V-24M14 0V-24" stroke="#b4cead" stroke-width="3"/><path d="M-14 -24H14" stroke="#d4f36a" stroke-width="3"/><path d="M-8 -6H8" stroke="#f3c37b" stroke-width="2" stroke-dasharray="3 3"/>',
  'lathe-hall': '<path d="M-16 0V-12L-8 -18L0 -12L8 -18L16 -12V0Z" fill="#607669" stroke="#b4cead"/><circle cx="0" cy="-5" r="3.5" fill="none" stroke="#d4f36a" stroke-width="2"/>',
  'launch-tower': '<path d="M-8 0L-4 -40H4L8 0M-6 -14H6M-5 -27H5" stroke="#b4cead" stroke-width="2" fill="none"/><path d="M12 0V-30L15 -37L18 -30V0Z" fill="#73c6d2" stroke="#203a3d"/>',
  'drafting-dome': '<path d="M-15 0A15 15 0 0 1 15 0Z" fill="#496866" stroke="#b4cead"/><path d="M-9 -3Q0 -22 9 -3" fill="none" stroke="#d4f36a" stroke-width="2"/>',
  'reservoir-dam': '<path d="M-18 0L-12 -22H12L18 0Z" fill="#607669" stroke="#b4cead"/><path d="M-10 -18H10" stroke="#73c6d2" stroke-width="4"/><path d="M0 -10V0" stroke="#d4f36a" stroke-width="2"/>',
  /* Foundations (game/realms/found/pack.js) */
  'supply-crane': '<path d="M0 0V-34H22" stroke="#b4cead" stroke-width="3" fill="none"/><path d="M20 -34V-22" stroke="#d4f36a" stroke-width="2"/><rect x="15" y="-22" width="10" height="7" fill="#82b8b2"/>',
  'greenhouse': '<path d="M-14 0V-10A14 14 0 0 1 14 -10V0Z" fill="#3f6a5a" stroke="#b4cead"/><path d="M-6 -4V-12M0 -4V-15M6 -4V-11" stroke="#d4f36a" stroke-width="2"/>',
  'tank-farm': '<rect x="-16" y="-18" width="12" height="18" rx="5" fill="#607669" stroke="#b4cead"/><rect x="2" y="-24" width="14" height="24" rx="6" fill="#496866" stroke="#93b6a0"/><circle cx="9" cy="-28" r="2.5" fill="#d4f36a"/>',
  'flag-line': '<path d="M-10 0V-22M10 0V-28" stroke="#93b6a0" stroke-width="2"/><path d="M-10 -22L-1 -19L-10 -16Z" fill="#f3c37b"/><path d="M10 -28L19 -25L10 -22Z" fill="#d4f36a"/>',
  'cargo-rail': '<path d="M-20 0H20M-20 -6H20" stroke="#b4cead" stroke-width="2"/><rect x="-12" y="-16" width="14" height="9" fill="#73c6d2" stroke="#203a3d"/>',
  'kiln': '<path d="M-12 0V-18L0 -26L12 -18V0Z" fill="#607669" stroke="#b4cead"/><path d="M6 -22V-36" stroke="#f3c37b" stroke-width="3"/>',
  'signal-mast': '<path d="M0 0L-5 -40L5 -40Z" fill="#82b8b2"/><path d="M-12 -30Q0 -48 12 -30M-17 -26Q0 -54 17 -26" fill="none" stroke="#d4f36a" stroke-width="2"/>',
  /* Linear algebra (game/realms/la/pack.js) */
  'beacon': '<path d="M0 0V-34" stroke="#b4cead" stroke-width="3"/><circle cy="-38" r="5" fill="#d4f36a"/>',
  'survey-tower': '<path d="M-8 0L-3 -30H3L8 0Z" fill="#496866" stroke="#93b6a0"/><rect x="-7" y="-38" width="14" height="8" fill="#82b8b2"/>',
  'observatory': '<path d="M-14 0V-8A14 14 0 0 1 14 -8V0Z" fill="#607669" stroke="#b4cead"/><path d="M0 -22L8 -32" stroke="#d4f36a" stroke-width="3"/>',
  'comms-dish': '<path d="M0 0V-16" stroke="#93b6a0" stroke-width="3"/><path d="M-13 -28Q0 -8 13 -28" fill="none" stroke="#8cddd4" stroke-width="3"/><circle cy="-27" r="2.5" fill="#d4f36a"/>',
  'solar-field': '<path d="M-18 0L-12 -12H0L-6 0ZM2 0L8 -12H20L14 0Z" fill="#73c6d2" stroke="#203a3d"/>',
  'relay-pylons': '<path d="M-10 0V-24M10 0V-24M-10 -24Q0 -16 10 -24" stroke="#f3c37b" stroke-width="2.5" fill="none"/>',
  'signal-spire': '<path d="M0 0L-5 -40L5 -40Z" fill="#82b8b2"/><path d="M-12 -30Q0 -48 12 -30" fill="none" stroke="#d4f36a" stroke-width="2"/>',
  'guild-banner': '<path d="M-16 0V-14L0 -24L16 -14V0Z" fill="#496866" stroke="#b4cead"/><path d="M0 -24V-42L12 -37L0 -32" fill="#d4f36a" stroke="#d4f36a"/>',
  /* New and generic */
  'dice-house': '<rect x="-14" y="-24" width="24" height="24" rx="3" fill="#496866" stroke="#b4cead"/><circle cx="-7" cy="-17" r="2" fill="#d4f36a"/><circle cx="-2" cy="-12" r="2" fill="#d4f36a"/><circle cx="3" cy="-7" r="2" fill="#d4f36a"/><path d="M10 -24L16 -30V-6L10 0" fill="#3f6a5a" stroke="#b4cead"/>',
  'bar-chart': '<path d="M-18 0H18" stroke="#b4cead" stroke-width="2"/><rect x="-15" y="-12" width="7" height="12" fill="#607669"/><rect x="-5" y="-24" width="7" height="24" fill="#73c6d2"/><rect x="5" y="-18" width="7" height="18" fill="#82b8b2"/><path d="M-14 -16L-2 -30L9 -22L17 -34" fill="none" stroke="#d4f36a" stroke-width="2"/>',
  'bell-curve': '<path d="M-18 0H18" stroke="#b4cead" stroke-width="2"/><path d="M-18 -2C-8 -2 -7 -30 0 -30C7 -30 8 -2 18 -2" fill="#3f6a5a" stroke="#d4f36a" stroke-width="2"/><path d="M0 -30V0" stroke="#f3c37b" stroke-width="1.5" stroke-dasharray="3 2"/>',
  'logic-gate': '<path d="M-14 -30H0A12 12 0 0 1 0 -6H-14Z" fill="#496866" stroke="#b4cead" stroke-width="2"/><path d="M-20 -24H-14M-20 -12H-14M12 -18H20" stroke="#d4f36a" stroke-width="2"/><path d="M-6 -6V0" stroke="#93b6a0" stroke-width="3"/>',
  'network': '<path d="M-14 -6L0 -30L14 -10L-14 -6M0 -30L2 -14L14 -10M2 -14L-14 -6" fill="none" stroke="#93b6a0" stroke-width="1.5"/><circle cx="-14" cy="-6" r="3.5" fill="#73c6d2"/><circle cx="0" cy="-30" r="3.5" fill="#d4f36a"/><circle cx="14" cy="-10" r="3.5" fill="#82b8b2"/><circle cx="2" cy="-14" r="3" fill="#f3c37b"/>',
  'block-stack': '<rect x="-15" y="-10" width="30" height="10" fill="#607669" stroke="#b4cead"/><rect x="-10" y="-20" width="20" height="10" fill="#496866" stroke="#b4cead"/><rect x="-5" y="-30" width="10" height="10" fill="#73c6d2" stroke="#203a3d"/><circle cy="-35" r="2.5" fill="#d4f36a"/>',
  'spiral-tower': '<path d="M-6 0L-3 -34H3L6 0Z" fill="#496866" stroke="#b4cead"/><path d="M-12 -6Q12 -10 -9 -16Q12 -20 -6 -26Q10 -30 0 -36" fill="none" stroke="#d4f36a" stroke-width="2"/>',
  'wave-mast': '<path d="M-16 0V-30M16 0V-30" stroke="#b4cead" stroke-width="2.5"/><path d="M-16 -18Q-8 -32 0 -18T16 -18" fill="none" stroke="#8cddd4" stroke-width="2.5"/><path d="M-16 -30H16" stroke="#93b6a0" stroke-width="1.5"/>',
  'pendulum-frame': '<path d="M-14 0L-6 -34H6L14 0" fill="none" stroke="#b4cead" stroke-width="2.5"/><path d="M0 -34L7 -12" stroke="#93b6a0" stroke-width="1.5"/><circle cx="7" cy="-10" r="4" fill="#f3c37b"/><path d="M-6 -14Q0 -9 4 -12" fill="none" stroke="#d4f36a" stroke-width="1.5" stroke-dasharray="2 2"/>',
  'magnet-arch': '<path d="M-14 0V-18A14 14 0 0 1 14 -18V0H6V-18A6 6 0 0 0 -6 -18V0Z" fill="#607669" stroke="#b4cead"/><path d="M-14 -4H-6M6 -4H14" stroke="#f3c37b" stroke-width="4"/><path d="M-4 -30Q0 -36 4 -30" fill="none" stroke="#d4f36a" stroke-width="2"/>',
  'coil-tower': '<path d="M0 0V-12" stroke="#b4cead" stroke-width="3"/><rect x="-8" y="-34" width="16" height="22" rx="3" fill="#3f6a5a" stroke="#b4cead"/><path d="M-8 -30H8M-8 -25H8M-8 -20H8M-8 -15H8" stroke="#f3c37b" stroke-width="1.5"/><path d="M-4 -38L2 -42L-1 -36L5 -40" fill="none" stroke="#d4f36a" stroke-width="1.5"/>',
  'torus-ring': '<path d="M-3 0V-8M3 0V-8" stroke="#93b6a0" stroke-width="2"/><ellipse cx="0" cy="-20" rx="18" ry="11" fill="#496866" stroke="#b4cead"/><ellipse cx="0" cy="-21" rx="7" ry="3.5" fill="#203a3d" stroke="#d4f36a" stroke-width="1.5"/>',
  'knot-sculpture': '<path d="M0 0V-6" stroke="#b4cead" stroke-width="3"/><path d="M0 -8C-18 -8 -14 -34 0 -24C14 -34 18 -8 0 -8C-10 -8 -6 -30 0 -36C6 -30 10 -8 0 -8" fill="none" stroke="#8cddd4" stroke-width="2.5"/><circle cy="-36" r="2" fill="#d4f36a"/>',
  'lattice-frame': '<rect x="-16" y="-28" width="32" height="28" fill="#203a3d" stroke="#b4cead"/><path d="M-16 -14H16M-5 -28V0M5 -28V0" stroke="#93b6a0" stroke-width="1"/><circle cx="-5" cy="-14" r="2.5" fill="#d4f36a"/><circle cx="5" cy="-14" r="2.5" fill="#d4f36a"/><circle cx="5" cy="-28" r="2.5" fill="#f3c37b"/>',
  'crystal-spire': '<path d="M0 -40L9 -24L6 0H-6L-9 -24Z" fill="#73c6d2" stroke="#203a3d"/><path d="M0 -40V0M-9 -24H9" stroke="#8cddd4" stroke-width="1"/><circle cx="12" cy="-34" r="2" fill="#d4f36a"/>',
  'balance-scales': '<path d="M0 0V-32M-8 0H8" stroke="#b4cead" stroke-width="3"/><path d="M-16 -28H16" stroke="#d4f36a" stroke-width="2"/><path d="M-16 -28L-20 -16H-12ZM16 -28L12 -16H20Z" fill="#82b8b2" stroke="#93b6a0"/>',
  'lighthouse': '<path d="M-7 0L-4 -30H4L7 0Z" fill="#607669" stroke="#b4cead"/><path d="M-4 -20H4M-5 -10H5" stroke="#f3c37b" stroke-width="2"/><rect x="-5" y="-36" width="10" height="6" fill="#d4f36a"/><path d="M5 -33L18 -38M5 -33L18 -28" stroke="#d4f36a" stroke-width="1.5"/>',
  'wind-turbine': '<path d="M0 0V-26" stroke="#b4cead" stroke-width="3"/><path d="M0 -26L-2 -42L2 -42ZM0 -26L14 -20L12 -17ZM0 -26L-14 -20L-12 -17Z" fill="#82b8b2"/><circle cy="-26" r="2.5" fill="#d4f36a"/>',
  'arch-bridge': '<path d="M-20 -14H20" stroke="#b4cead" stroke-width="3"/><path d="M-16 0V-14M16 0V-14M-16 0Q0 -26 16 0" fill="none" stroke="#93b6a0" stroke-width="2"/><path d="M-8 -14V-7M0 -14V-4M8 -14V-7" stroke="#d4f36a" stroke-width="1.5"/>',
  'telescope': '<path d="M-10 0L0 -14L10 0" fill="none" stroke="#b4cead" stroke-width="2.5"/><path d="M-12 -14L12 -32" stroke="#73c6d2" stroke-width="6"/><path d="M12 -32L16 -35" stroke="#d4f36a" stroke-width="3"/><circle cx="18" cy="-38" r="1.5" fill="#d4f36a"/>',
  'archive-hall': '<path d="M-17 -22L0 -32L17 -22Z" fill="#496866" stroke="#b4cead"/><path d="M-12 0V-22M-4 0V-22M4 0V-22M12 0V-22" stroke="#b4cead" stroke-width="3"/><path d="M-18 0H18" stroke="#d4f36a" stroke-width="2"/>',
  'clock-tower': '<rect x="-8" y="-30" width="16" height="30" fill="#607669" stroke="#b4cead"/><circle cy="-20" r="5.5" fill="#203a3d" stroke="#d4f36a" stroke-width="1.5"/><path d="M0 -20V-24M0 -20L3 -18" stroke="#f3c37b" stroke-width="1.5"/><path d="M-10 -30L0 -38L10 -30Z" fill="#496866" stroke="#b4cead"/>',
  'obelisk': '<path d="M-6 0L-4 -32L0 -38L4 -32L6 0Z" fill="#496866" stroke="#b4cead"/><path d="M-2 -26H2M-2 -18H2M-2 -10H2" stroke="#d4f36a" stroke-width="1.5"/><path d="M-12 0H12" stroke="#93b6a0" stroke-width="2"/>'
};
/* The landmark a chapter gets when its spec names no glyph and gives no art: one per chapter, all different. */
const DEFAULTS = ['beacon', 'survey-tower', 'observatory', 'comms-dish', 'solar-field', 'relay-pylons', 'signal-mast'];
module.exports = { GLYPHS, DEFAULTS };

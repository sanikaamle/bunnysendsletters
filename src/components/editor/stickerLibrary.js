// PetalPost — sticker registry.
// PLACEHOLDER assets are wired in below. To add your own stickers later:
// 1. Drop PNG/WebP files into src/assets/stickers/<category>/
// 2. Import them below and add an entry to the matching category array.
// Nothing else in the editor needs to change — the toolbar renders
// whatever is registered here.

import flower1 from '../../assets/stickers/flowers/flower-1.svg'
import flower2 from '../../assets/stickers/flowers/flower-2.svg'
import flower3 from '../../assets/stickers/flowers/flower-3.svg'
import flower4 from '../../assets/stickers/flowers/flower-4.svg'
import bluelily from '../../assets/stickers/flowers/bluelily.png'
import pinklily from '../../assets/stickers/flowers/pinklily.png'
import yellowlily from '../../assets/stickers/flowers/yellowlily.png'
import tulip from '../../assets/stickers/flowers/tulip.png'

import star1 from '../../assets/stickers/stars/star-1.svg'
import star2 from '../../assets/stickers/stars/star-2.svg'
import star3 from '../../assets/stickers/stars/star-3.svg'
import goldenstar from '../../assets/stickers/stars/goldenstar.png'
import star4 from '../../assets/stickers/stars/buttonstar.png'

import heart1 from '../../assets/stickers/hearts/heart-1.svg'
import heart2 from '../../assets/stickers/hearts/heart-2.svg'
import heart3 from '../../assets/stickers/hearts/heart-3.svg'
import heart4 from '../../assets/stickers/hearts/checkedheart.png'
import heart5 from '../../assets/stickers/hearts/paperheart.png'

import stamp1 from '../../assets/stickers/stamps/stamp-1.svg'
import stamp2 from '../../assets/stickers/stamps/stamp-2.svg'
import stamp3 from '../../assets/stickers/stamps/stamp-3.svg'
import stamp4 from '../../assets/stickers/stamps/stamp.png'
import stamp5 from '../../assets/stickers/stamps/stampss.png'
import stamp6 from '../../assets/stickers/stamps/stampsss.png'


import tape1 from '../../assets/stickers/tape/tape-1.svg'
import tape2 from '../../assets/stickers/tape/tape-2.svg'
import tape3 from '../../assets/stickers/tape/tape-3.svg'
import tape4 from '../../assets/stickers/tape/tape-4.svg'

import teddy1 from '../../assets/stickers/teddy/teddy-1.svg'
import teddy2 from '../../assets/stickers/teddy/teddy-2.svg'
import teddy3 from '../../assets/stickers/teddy/teddy-3.svg'
import teddy4 from '../../assets/stickers/teddy/hellokitty.png'
import teddy5 from '../../assets/stickers/teddy/yellowkitty.png'
import teddy6 from '../../assets/stickers/teddy/sanrio.png'
import teddy7 from '../../assets/stickers/teddy/kitty2.png'
import teddy8 from '../../assets/stickers/teddy/kitty3.png'

import leaf1 from '../../assets/stickers/misc/leaf-1.svg'
import moon1 from '../../assets/stickers/misc/misc-moon.svg'
import cloud1 from '../../assets/stickers/misc/misc-cloud.svg'
import favv from '../../assets/stickers/misc/fav.png'
import bows from '../../assets/stickers/misc/bow.png'
import cameras from '../../assets/stickers/misc/camera.png'
import ducks from '../../assets/stickers/misc/duck.png'

export const STICKER_LIBRARY = {
  flowers: [
    { id: 'flower-1', url: flower1, label: 'Daisy Cluster' },
    { id: 'flower-2', url: flower2, label: 'Tulip' },
    { id: 'flower-3', url: flower3, label: 'White Daisy' },
    { id: 'flower-4', url: flower4, label: 'Blossom Sprig' },
    { id: 'bluelily', url: bluelily, label: 'Blue Lily' },
    { id: 'pinklily', url: pinklily, label: 'Pink Lily' },
    { id: 'yellowlily', url: yellowlily, label: 'Yellow Lily' },
    { id: 'tulip2', url: tulip, label: 'Tulip' },
  ],
  stars: [
    { id: 'star-1', url: star1, label: 'Star' },
    { id: 'star-2', url: star2, label: 'Sparkle' },
    { id: 'star-3', url: star3, label: 'Twin Stars' },
    { id: 'goldenstar', url: goldenstar, label: 'Golden Star' },
    {id: 'star-4', url: star4, label: 'Button Star'}
  ],
  hearts: [
    { id: 'heart-1', url: heart1, label: 'Heart' },
    { id: 'heart-2', url: heart2, label: 'Double Heart' },
    { id: 'heart-3', url: heart3, label: 'Stitched Heart' },
    { id: 'heart-4', url: heart4, label: 'Checked Heart' },
    { id: 'heart-5', url: heart5, label: 'Paper Heart' },
  ],
  stamps: [
    { id: 'stamp-1', url: stamp1, label: 'Stamp' },
    { id: 'stamp-2', url: stamp2, label: 'Heart Stamp' },
    { id: 'stamp-3', url: stamp3, label: 'Star Stamp' },
    { id: 'stamp-4', url: stamp4, label: 'Stamp' },
    { id: 'stamp-5', url: stamp5, label: 'Stamp' },
    { id: 'stamp-6', url: stamp6, label: 'Stamp' },
  ],
  tape: [
    { id: 'tape-1', url: tape1, label: 'Lavender Tape' },
    { id: 'tape-2', url: tape2, label: 'Striped Pink Tape' },
    { id: 'tape-3', url: tape3, label: 'Dotted Sage Tape' },
    { id: 'tape-4', url: tape4, label: 'Butter Dot Tape' },
  ],
  teddy: [
    { id: 'teddy-1', url: teddy1, label: 'Bear' },
    { id: 'teddy-2', url: teddy2, label: 'Bunny' },
    { id: 'teddy-3', url: teddy3, label: 'Cat' },
    {id: 'teddy-4', url: teddy4, label: 'Hello Kitty'},
    {id: 'teddy-5', url: teddy5, label: 'Yellow Kitty'},
    {id: 'teddy-6', url: teddy6, label: 'Sanrio'},
    {id: 'teddy-7', url: teddy7, label: 'Kitty 2'},
    {id: 'teddy-8', url: teddy8, label: 'Kitty 3'},
  ],
  misc: [
    { id: 'leaf-1', url: leaf1, label: 'Leaf' },
    { id: 'moon-1', url: moon1, label: 'Moon' },
    { id: 'cloud-1', url: cloud1, label: 'Cloud' },
    {id: 'favv', url: favv, label: 'Favourite'},
    {id: 'bows', url: bows, label: 'Bows'},
    {id: 'cameras', url: cameras, label: 'Cameras'},
    {id: 'duckss', url: ducks, label: 'Ducks'},
  ],
}

export const STICKER_CATEGORY_LABELS = {
  flowers: 'Flowers',
  stars: 'Stars',
  hearts: 'Hearts',
  stamps: 'Stamps',
  tape: 'Tape',
  teddy: 'Teddy',
  misc: 'Misc',
}

/* 
 @title departure
 @by prismograph
 @description this track I was playing live for youtube stream using Elektron Octatrack and Elektron Digitone. https://youtu.be/c6pr7OlBAls?si=TKqtwcmktrVH3MlK&t=1770
*/

samples('github:prismograph/departure/main/strudel.json?t=8238927943');

const setbpm = t => setcps(t/4/60);

const tempo = 175;
setbpm(tempo);

// gets fraction based on tempo
const frac = (fraction) => fraction*(120/tempo);

/* ------------------------- */

let breaks = s("breaks:[[0|1|2|3|4|5|6|7]*8]/4").chop(32).fit()
  .sometimesBy(1/8, choose(
    x => x.stretch("-1/15").room(1.6).size(1.5),
    x => x.ply("1").clip("2/4").speed(saw.range(1/6, 1/8).fast(4)).decay(1/8),
    x => x.ply("1").clip("2/4").speed(saw.range(1/8, 1/6).fast(4)).decay(1/8),
    x => x.ply("2").clip("5/16").decay(1/5).delay(.7).delaytime(frac(3/8)).delayfeedback(.4),
    x => x.ply("4").clip("7/8").decay(1/12),
  )).release(0.00)
    .orbit(1)
    .color('#af355a');

let short1 = s("short:[[0|1|2|3|4|5|6|7]*160]/4").chop(32).fit().orbit(2)
    .color('#357a9f');

const getBass = (pat) => note(pat).s("bass")
    .mask("<1@15 0@1>")
    .gain(.6)
    .adsr(".005:3:.0:.002")
    .distort("2.4:.5")
    .room(.3)
    .roomsize(1.4)
    .orbit(3)
    .color('#355a9f');

const bassA1 = getBass("<[f1@6 [~ f1 f2 c2]@2]*2 [<d#1 f#1>@6 <[~ e1 e2 c2] [f#1 b1 g#1]>@2]*2>/4");
const bassA2 = getBass("<[f1@6 <f2 [~ f1 f2@2]>@2]*2  [<d#1 f#1 c#1 e1>@4 <[~@3 <d#1 e1>@1] [~ _]>@2 <[c2] [~]>@2]*2>/4");

const pad = s("pad/16").chop(32).release(0).fit()
    .distort("1.4:.6").hpf(200)
    .orbit(4)
    .color('#359f5a');

const kick = note("c(<3@3 [3*2 5 ~]@1>,8)").s("bd:2").bank("RolandTR707")
    .distort("1.4:.6")
    .color('#5a359f');

arrange(
  [16, stack(pad)],
  [16, stack(pad, bassA1)],
  [16, stack(pad, bassA1, kick, short1)],
  [32, stack(pad, bassA1, kick, breaks).when(brand.segment(1).slow(2), choose(
    x => x.distort("1:.8").hpf(500).lpf(2000).ftype("ladder"),
    x => x.delay(".7").delayfeedback(.7).delaytime(perlin.range(.0001, .01)),
    x => x.lpf(saw.range(24000,0).slow(2)).delay(saw.range(0,1).slow(2)).delayfeedback(.6).delaytime(frac(3/8)),
    x => x,
  ))],
  [16, stack(pad, bassA1, kick, short1)],
  [32, stack(pad, bassA2, kick, breaks).when(brand.segment(1), choose(
    x => x.distort("1:.8").hpf(500).lpf(2000).ftype("ladder"),
    x => x.phaser(".7").phaserdepth(.7).phasersweep(perlin.range(100, 10000).segment(256)).distort("1.4:.8").hpf(400).lpf(3000).ftype("ladder"),
    x => x.delay(".7").delayfeedback(.7).delaytime(perlin.range(.0001, .01).segment(256)),
    x => x.lpf(saw.range(24000,0).slow(2)).delay(saw.range(0,1).slow(2)).delayfeedback(.6).delaytime(frac(3/8)),
    x => x,
  ))],
  [16, stack(pad.hpf("400").lpf("900").room(4.2).size(2).roomfade(30.4).roomdim(5000).postgain(.4), bassA2)],
).gain(.5)
  .punchcard({ vertical: true });

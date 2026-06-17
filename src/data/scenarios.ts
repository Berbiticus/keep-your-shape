import type { Scenario } from '../types'

// Coordinate system:
//   x: 0 = left touchline, 100 = right touchline
//   y: 0 = own goal line (bottom), 100 = opponent goal line (top)
//   Attacking direction → y = 100
//
// WINGER scenarios are authored for a RIGHT winger.
// When the user picks LEFT winger, all x-coords are mirrored (x → 100 − x)
// automatically in App.tsx — no duplicate data needed.
//
// Prompts are written side-neutral (say "the winger" / "your fullback")
// so they read correctly after mirroring.

const scenarios: Scenario[] = [

  // ═══════════════════════════════════════════════════════════════
  // WINGER (right-side authored — auto-mirrored for left winger)
  // ═══════════════════════════════════════════════════════════════

  {
    id: 'w-a1',
    role: 'winger',
    phase: 'attacking',
    principle: 'Hold width',
    prompt:
      "The ball is on the far side of the pitch with your left back. You're the winger on the other side — where should you be?",
    ball: { x: 12, y: 35 },
    teammates: [
      { x: 12, y: 35 }, // LB (ball)
      { x: 40, y: 52 }, // CM
      { x: 48, y: 76 }, // striker
    ],
    opponents: [
      { x: 32, y: 62 }, { x: 52, y: 65 },
      { x: 65, y: 65 }, { x: 78, y: 58 },
      { x: 40, y: 48 }, { x: 60, y: 48 },
    ],
    start: { x: 56, y: 62 },
    target: { x: 88, y: 62, radius: 10 },
    explanation:
      "Stay wide on the touchline! When the ball is on the far side, hugging the touchline stretches the defense and creates space in the middle. If you drift inside, you're giving away the wide area for free.",
    arrows: [
      { from: { x: 12, y: 35 }, to: { x: 14, y: 54 }, team: 'own' },
    ],
  },

  {
    id: 'w-a2',
    role: 'winger',
    phase: 'attacking',
    principle: 'Back-post run',
    prompt:
      "Your winger on the other side is about to whip in a cross from near the byline. Where do you attack in the box?",
    ball: { x: 6, y: 83 },
    teammates: [
      { x: 6,  y: 83 },
      { x: 46, y: 88 },
      { x: 35, y: 74 },
    ],
    opponents: [
      { x: 42, y: 91 }, { x: 60, y: 91 },
      { x: 25, y: 85 }, { x: 76, y: 89 },
    ],
    start: { x: 66, y: 86 },
    target: { x: 80, y: 92, radius: 9 },
    explanation:
      "Attack the back post! Defenders always crowd the near post. A cross that travels to the back post is much harder to clear. Sprint there at full speed and you'll arrive just as the ball does — perfect for a header or tap-in!",
    arrows: [
      {
        from: { x: 6, y: 83 },
        to: { x: 72, y: 96 },
        team: 'own',
        controlPoint: { x: 5, y: 98 },
      },
    ],
  },

  {
    id: 'w-a3',
    role: 'winger',
    phase: 'attacking',
    principle: 'Stay onside',
    prompt:
      "Your midfielder is about to play you in with a through ball. The last defender is near the top of the box — where do you time your run?",
    ball: { x: 48, y: 58 },
    teammates: [
      { x: 48, y: 58 },
      { x: 18, y: 65 },
    ],
    opponents: [
      { x: 40, y: 79 },
      { x: 62, y: 79 },
      { x: 28, y: 66 }, { x: 54, y: 66 },
    ],
    start: { x: 72, y: 84 },
    target: { x: 72, y: 78, radius: 7 },
    explanation:
      "Hang on the last defender's shoulder! If you sprint past them before the ball is kicked, the ref will flag offside and the chance is wasted. Stay level with or just behind the last defender, then explode forward the moment the ball is played.",
    arrows: [
      { from: { x: 48, y: 58 }, to: { x: 66, y: 80 }, team: 'own' },
      { from: { x: 40, y: 79 }, to: { x: 40, y: 85 }, team: 'opponent' },
      { from: { x: 62, y: 79 }, to: { x: 62, y: 85 }, team: 'opponent' },
    ],
  },

  {
    id: 'w-a4',
    role: 'winger',
    phase: 'attacking',
    principle: 'Passing triangle',
    prompt:
      "Your fullback has the ball but you're standing right in front of them — they can't play forward! What do you do?",
    ball: { x: 78, y: 42 },
    teammates: [
      { x: 78, y: 42 },
      { x: 50, y: 52 },
      { x: 45, y: 76 },
    ],
    opponents: [
      { x: 68, y: 55 }, { x: 55, y: 62 },
      { x: 78, y: 60 }, { x: 44, y: 64 },
    ],
    start: { x: 82, y: 44 },
    target: { x: 82, y: 63, radius: 10 },
    explanation:
      "Create an angle! Move forward AND to the side so your fullback has a clear passing lane. Good positions form a triangle between you, the ball, and another teammate. Standing right in front of them lets one defender cover you both at once.",
    arrows: [
      { from: { x: 78, y: 42 }, to: { x: 80, y: 60 }, team: 'own' },
    ],
  },

  {
    id: 'w-a5',
    role: 'winger',
    phase: 'attacking',
    principle: 'Check to receive',
    prompt:
      "The midfielder has the ball but your defender is right on your back. You can't receive it up top. What move do you make?",
    ball: { x: 50, y: 58 },
    teammates: [
      { x: 50, y: 58 },
      { x: 18, y: 70 },
      { x: 44, y: 82 },
    ],
    opponents: [
      { x: 42, y: 82 }, { x: 60, y: 82 },
      { x: 72, y: 80 },
      { x: 36, y: 64 },
    ],
    start: { x: 72, y: 82 },
    target: { x: 68, y: 68, radius: 10 },
    explanation:
      "Check back toward the ball! Drop away from your defender to find a pocket of space. Once you receive it to your feet, you can turn and attack. This move is called a 'checking run' and pros use it all the time to shake a marker.",
    arrows: [
      { from: { x: 72, y: 78 }, to: { x: 72, y: 83 }, team: 'opponent' },
      { from: { x: 50, y: 58 }, to: { x: 60, y: 72 }, team: 'own' },
    ],
  },

  {
    id: 'w-a6',
    role: 'winger',
    phase: 'attacking',
    principle: 'Run in behind',
    prompt:
      "The defense has pushed way up the pitch. Your attacking midfielder has the ball and there's loads of space behind the defense. Where do you go?",
    ball: { x: 50, y: 62 },
    teammates: [
      { x: 50, y: 62 },
      { x: 15, y: 68 },
      { x: 52, y: 72 },
    ],
    opponents: [
      { x: 38, y: 76 },
      { x: 56, y: 76 },
      { x: 25, y: 68 }, { x: 64, y: 70 },
    ],
    start: { x: 76, y: 64 },
    target: { x: 80, y: 83, radius: 10 },
    explanation:
      "Go! When defenders push up high, run in behind them into the space. Time your run so you don't go too early (offside!) but the second the ball is about to be played — sprint! A run in behind often ends in a 1v1 with the keeper.",
    arrows: [
      { from: { x: 38, y: 76 }, to: { x: 38, y: 83 }, team: 'opponent' },
      { from: { x: 56, y: 76 }, to: { x: 56, y: 83 }, team: 'opponent' },
    ],
  },

  {
    id: 'w-a7',
    role: 'winger',
    phase: 'attacking',
    principle: 'Create overlap space',
    prompt:
      "Your fullback is overlapping down the wing right next to you. Where do you move to help them?",
    ball: { x: 84, y: 66 },
    teammates: [
      { x: 84, y: 66 },
      { x: 52, y: 58 },
      { x: 46, y: 82 },
    ],
    opponents: [
      { x: 44, y: 82 }, { x: 60, y: 82 },
      { x: 75, y: 74 }, { x: 60, y: 66 },
    ],
    start: { x: 80, y: 72 },
    target: { x: 62, y: 75, radius: 12 },
    explanation:
      "Move inside to give them room! If you're both on the same wing, it's too crowded and easy to defend. Tuck inside — you might drag a defender with you — and now your fullback has the whole wide channel to attack into. You could also receive inside and shoot!",
    arrows: [
      { from: { x: 84, y: 54 }, to: { x: 84, y: 70 }, team: 'own' },
    ],
  },

  {
    id: 'w-a8',
    role: 'winger',
    phase: 'attacking',
    principle: 'Diagonal support run',
    prompt:
      "Your center back is carrying the ball forward. You're level with them — not helpful! Where do you run?",
    ball: { x: 60, y: 32 },
    teammates: [
      { x: 60, y: 32 },
      { x: 40, y: 48 },
      { x: 46, y: 74 },
    ],
    opponents: [
      { x: 50, y: 62 }, { x: 36, y: 54 },
      { x: 68, y: 60 }, { x: 55, y: 68 },
    ],
    start: { x: 80, y: 36 },
    target: { x: 85, y: 60, radius: 10 },
    explanation:
      "Make a diagonal run ahead and wide! When a teammate is carrying forward, run forward AND out to give them a clear forward pass option. Being level with the ball carrier doesn't help — they can't play forward to you. Depth creates a whole different attacking option.",
    arrows: [
      { from: { x: 60, y: 32 }, to: { x: 60, y: 52 }, team: 'own' },
    ],
  },

  {
    id: 'w-d1',
    role: 'winger',
    phase: 'defending',
    principle: 'Recover goal-side',
    prompt:
      "We just lost the ball! Their winger is running at our goal with pace. Where do you recover to?",
    ball: { x: 78, y: 62 },
    teammates: [
      { x: 50, y:  3 },
      { x: 42, y: 20 },
      { x: 58, y: 20 },
      { x: 18, y: 38 },
    ],
    opponents: [
      { x: 78, y: 62 },
      { x: 50, y: 60 },
      { x: 18, y: 62 },
    ],
    start: { x: 76, y: 68 },
    target: { x: 74, y: 50, radius: 12 },
    explanation:
      "Sprint goal-side — between them and your goal! You don't need to tackle right away; just get goal-side so they can't run straight at the keeper. 'Goal-side' means between the attacker and your goal. Never chase behind — always cut the angle.",
    arrows: [
      { from: { x: 78, y: 62 }, to: { x: 76, y: 44 }, team: 'opponent' },
    ],
  },

  {
    id: 'w-d2',
    role: 'winger',
    phase: 'defending',
    principle: 'Press to force wide',
    prompt:
      "Their center back has the ball near their own box. Your team is pressing high — where do you go to press?",
    ball: { x: 58, y: 22 },
    teammates: [
      { x: 50, y:  3 },
      { x: 40, y: 18 },
      { x: 58, y: 18 },
      { x: 50, y: 45 },
    ],
    opponents: [
      { x: 58, y: 22 },
      { x: 40, y: 22 },
      { x: 50, y:  4 },
      { x: 80, y: 26 },
    ],
    start: { x: 72, y: 52 },
    target: { x: 62, y: 35, radius: 10 },
    explanation:
      "Press from the inside! Approach the center back from the middle, not from the outside. This blocks the central passing lane and forces them to go wide or backward. If you press from outside, you're leaving the dangerous central channel wide open.",
    arrows: [
      { from: { x: 58, y: 22 }, to: { x: 56, y: 42 }, team: 'opponent' },
    ],
  },

  {
    id: 'w-d3',
    role: 'winger',
    phase: 'defending',
    principle: 'Stay compact',
    prompt:
      "The ball is on the far side of the pitch in the opponent's possession. You're the winger on the other side — where should you be?",
    ball: { x: 12, y: 58 },
    teammates: [
      { x: 50, y:  3 },
      { x: 42, y: 22 },
      { x: 58, y: 22 },
      { x: 18, y: 40 },
      { x: 44, y: 48 },
    ],
    opponents: [
      { x: 12, y: 58 },
      { x: 46, y: 65 },
      { x: 80, y: 65 },
      { x: 46, y: 50 },
    ],
    start: { x: 88, y: 62 },
    target: { x: 62, y: 52, radius: 12 },
    explanation:
      "Tuck inside and stay compact! When the ball is on the far side, you don't need to be wide — move toward the center to block passing lanes and help your team. Stay alert for a switch of play: the second the ball comes to your side, you can sprint out wide again.",
    arrows: [
      {
        from: { x: 12, y: 58 },
        to: { x: 78, y: 65 },
        team: 'opponent',
        controlPoint: { x: 44, y: 72 },
      },
    ],
  },

  {
    id: 'w-d4',
    role: 'winger',
    phase: 'defending',
    principle: 'Track your fullback',
    prompt:
      "The opposing fullback on your side is making an overlapping run down the wing — extra attacker! What do you do?",
    ball: { x: 80, y: 64 },
    teammates: [
      { x: 50, y:  3 },
      { x: 42, y: 22 },
      { x: 58, y: 22 },
      { x: 18, y: 42 },
      { x: 44, y: 50 },
    ],
    opponents: [
      { x: 82, y: 62 },
      { x: 78, y: 72 },
      { x: 50, y: 65 },
      { x: 18, y: 65 },
    ],
    start: { x: 74, y: 76 },
    target: { x: 78, y: 58, radius: 10 },
    explanation:
      "Track back with the overlapping fullback! They've created an extra attacker on your side — if you don't follow them, they'll have a free cross or shot. Drop back and stay with them. Once your team wins the ball back, you can push forward again.",
    arrows: [
      { from: { x: 82, y: 66 }, to: { x: 82, y: 48 }, team: 'opponent' },
    ],
  },

  {
    id: 'w-d5',
    role: 'winger',
    phase: 'defending',
    principle: 'High press',
    prompt:
      "Opponents have a goal kick and your coach says to press high. Their center back is their short option — where do you go?",
    ball: { x: 50, y: 4 },
    teammates: [
      { x: 50, y:  3 },
      { x: 42, y: 18 },
      { x: 58, y: 18 },
      { x: 50, y: 40 },
    ],
    opponents: [
      { x: 50, y:  4 },
      { x: 36, y: 18 },
      { x: 64, y: 18 },
      { x: 18, y: 22 },
      { x: 82, y: 22 },
    ],
    start: { x: 78, y: 48 },
    target: { x: 40, y: 30, radius: 12 },
    explanation:
      "Cut off the short pass! Get between the keeper and their center back so they can't play out easily. Force them to kick it long — that's much easier for your defenders to handle than a team playing neat combinations out from the back. First pressing player, first win!",
    arrows: [
      { from: { x: 50, y: 4 }, to: { x: 38, y: 18 }, team: 'opponent' },
    ],
  },

  {
    id: 'w-d6',
    role: 'winger',
    phase: 'defending',
    principle: 'Defensive shape',
    prompt:
      "We lost the ball and the other team is building up in midfield. You're way up the pitch. What do you do?",
    ball: { x: 46, y: 50 },
    teammates: [
      { x: 50, y:  3 },
      { x: 40, y: 22 },
      { x: 60, y: 22 },
      { x: 18, y: 40 },
      { x: 44, y: 48 },
    ],
    opponents: [
      { x: 46, y: 50 },
      { x: 54, y: 58 },
      { x: 48, y: 68 },
      { x: 18, y: 65 },
    ],
    start: { x: 78, y: 78 },
    target: { x: 75, y: 55, radius: 12 },
    explanation:
      "Drop back into your defensive position! As a winger, when your team doesn't have the ball, you need to get back to roughly midfield on your side. This keeps your team's shape compact. Being up high leaves a massive gap — and their fullback will run straight through it.",
    arrows: [
      { from: { x: 54, y: 58 }, to: { x: 52, y: 44 }, team: 'opponent' },
    ],
  },

  {
    id: 'w-d7',
    role: 'winger',
    phase: 'defending',
    principle: 'Track runners in the box',
    prompt:
      "Their winger is about to cross. One of their strikers is making a near-post run into your zone. Who do you track?",
    ball: { x: 88, y: 80 },
    teammates: [
      { x: 50, y:  3 },
      { x: 40, y: 20 },
      { x: 62, y: 20 },
      { x: 18, y: 40 },
      { x: 50, y: 38 },
    ],
    opponents: [
      { x: 88, y: 80 },
      { x: 58, y: 88 },
      { x: 44, y: 90 },
      { x: 20, y: 80 },
    ],
    start: { x: 68, y: 85 },
    target: { x: 55, y: 88, radius: 9 },
    explanation:
      "Track the near-post runner! Don't just watch the ball — when someone runs into your zone in the box, it's your job to follow them. Get goal-side of that striker and stay tight. If you lose them for even a second, they'll get an easy header at the near post.",
    arrows: [
      {
        from: { x: 88, y: 80 },
        to: { x: 52, y: 95 },
        team: 'opponent',
        controlPoint: { x: 88, y: 97 },
      },
      { from: { x: 58, y: 86 }, to: { x: 52, y: 95 }, team: 'opponent' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // STRIKER
  // ═══════════════════════════════════════════════════════════════

  {
    id: 'st-a1',
    role: 'striker',
    phase: 'attacking',
    principle: 'Channel run',
    prompt:
      "There's a gap between their right center back and right back. Your midfielder has the ball — where do you run as the striker?",
    ball: { x: 30, y: 60 },
    teammates: [
      { x: 30, y: 60 },
      { x: 15, y: 68 },
      { x: 55, y: 58 },
    ],
    opponents: [
      { x: 40, y: 80 }, { x: 58, y: 80 },
      { x: 72, y: 76 },
      { x: 35, y: 68 }, { x: 55, y: 68 },
    ],
    start: { x: 50, y: 75 },
    target: { x: 65, y: 80, radius: 9 },
    explanation:
      "Run into the channel — the gap between their center back and fullback! This is one of the most dangerous spaces in soccer. Time your run to stay onside, and the ball can be threaded through for a 1v1 with the keeper.",
    arrows: [
      { from: { x: 30, y: 60 }, to: { x: 50, y: 78 }, team: 'own' },
    ],
  },

  {
    id: 'st-a2',
    role: 'striker',
    phase: 'attacking',
    principle: 'Attack the cross',
    prompt:
      "Your left winger is crossing from the byline. You're the striker in the middle — where do you go?",
    ball: { x: 8, y: 83 },
    teammates: [
      { x: 8,  y: 83 },
      { x: 75, y: 86 },
      { x: 38, y: 72 },
    ],
    opponents: [
      { x: 40, y: 90 }, { x: 58, y: 90 },
      { x: 25, y: 86 }, { x: 75, y: 88 },
    ],
    start: { x: 45, y: 88 },
    target: { x: 55, y: 93, radius: 9 },
    explanation:
      "Arrive at the penalty spot or far post at full speed! As the striker, you need to get to the far side of the defenders. Near-post runs are easy to defend. Attack the space between the near and far post and any cross into that area becomes a goal chance.",
    arrows: [
      {
        from: { x: 8, y: 83 },
        to: { x: 52, y: 96 },
        team: 'own',
        controlPoint: { x: 6, y: 97 },
      },
    ],
  },

  {
    id: 'st-a3',
    role: 'striker',
    phase: 'attacking',
    principle: 'Hold up play',
    prompt:
      "Your goalkeeper is kicking long to you as the target striker. A defender is right behind you. Where do you position to control it?",
    ball: { x: 50, y: 5 },
    teammates: [
      { x: 50, y: 5 },
      { x: 32, y: 55 },
      { x: 62, y: 55 },
    ],
    opponents: [
      { x: 46, y: 83 }, { x: 60, y: 83 },
      { x: 28, y: 72 }, { x: 72, y: 72 },
    ],
    start: { x: 50, y: 91 },
    target: { x: 50, y: 82, radius: 9 },
    explanation:
      "Position yourself between the defender and where the ball will land! Don't run too deep or it's impossible to control. Get in front of the defender, use your body to shield them, and lay it off to a midfielder arriving behind you.",
    arrows: [
      { from: { x: 50, y: 5 }, to: { x: 50, y: 82 }, team: 'own' },
    ],
  },

  {
    id: 'st-a4',
    role: 'striker',
    phase: 'attacking',
    principle: 'Drop into the hole',
    prompt:
      "Your team can't find a way through. The defense is organized with through balls blocked. What do you do as the striker?",
    ball: { x: 45, y: 58 },
    teammates: [
      { x: 45, y: 58 },
      { x: 25, y: 62 },
      { x: 68, y: 62 },
      { x: 48, y: 48 },
    ],
    opponents: [
      { x: 40, y: 75 }, { x: 58, y: 75 },
      { x: 30, y: 65 }, { x: 65, y: 65 },
      { x: 48, y: 62 },
    ],
    start: { x: 50, y: 83 },
    target: { x: 50, y: 70, radius: 10 },
    explanation:
      "Drop into the space between the lines — 'the hole'! When defenders are blocking through balls, drop a little deeper to receive to feet. Once you get the ball facing goal, you can turn and shoot, or slip a winger in behind. This is one of the smartest things a striker can do.",
    arrows: [
      { from: { x: 40, y: 75 }, to: { x: 40, y: 80 }, team: 'opponent' },
      { from: { x: 58, y: 75 }, to: { x: 58, y: 80 }, team: 'opponent' },
    ],
  },

  {
    id: 'st-d1',
    role: 'striker',
    phase: 'defending',
    principle: 'Lead the press',
    prompt:
      "Their goalkeeper has the ball and your coach says to press high. As the striker, where do you go?",
    ball: { x: 50, y: 4 },
    teammates: [
      { x: 50, y: 5 },
      { x: 42, y: 20 },
      { x: 58, y: 20 },
      { x: 38, y: 40 },
      { x: 62, y: 40 },
    ],
    opponents: [
      { x: 50, y: 4 },
      { x: 38, y: 16 },
      { x: 62, y: 16 },
      { x: 18, y: 22 },
      { x: 82, y: 22 },
    ],
    start: { x: 50, y: 55 },
    target: { x: 50, y: 32, radius: 12 },
    explanation:
      "Get centrally to cut off the easiest pass! As the striker, you lead the press. Don't run straight at the keeper — position yourself between them and the nearest center back. This forces them to go long or wide, which is much easier for your team to defend.",
    arrows: [
      { from: { x: 50, y: 4 }, to: { x: 38, y: 16 }, team: 'opponent' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // MIDFIELDER
  // ═══════════════════════════════════════════════════════════════

  {
    id: 'cm-a1',
    role: 'midfielder',
    phase: 'attacking',
    principle: 'Find space between the lines',
    prompt:
      "Your defensive midfielder has the ball. The opposition is in a 4-4 defensive block. Where do you move to get on the ball?",
    ball: { x: 42, y: 42 },
    teammates: [
      { x: 42, y: 42 },
      { x: 22, y: 55 },
      { x: 72, y: 55 },
      { x: 50, y: 72 },
    ],
    opponents: [
      { x: 25, y: 52 }, { x: 45, y: 52 }, { x: 60, y: 52 }, { x: 80, y: 52 },
      { x: 30, y: 65 }, { x: 50, y: 65 }, { x: 65, y: 65 }, { x: 78, y: 65 },
    ],
    start: { x: 52, y: 42 },
    target: { x: 55, y: 60, radius: 10 },
    explanation:
      "Find the gap between their midfield and defensive lines! That space is called 'between the lines.' When you receive there, you're facing goal with defenders behind you — you can turn, shoot, or pick a killer pass. Getting there first is the skill.",
    arrows: [
      { from: { x: 42, y: 42 }, to: { x: 52, y: 55 }, team: 'own' },
    ],
  },

  {
    id: 'cm-a2',
    role: 'midfielder',
    phase: 'attacking',
    principle: 'Late run into the box',
    prompt:
      "Your striker is holding up the ball near the top of the box. You're the central midfielder — where do you go?",
    ball: { x: 48, y: 80 },
    teammates: [
      { x: 48, y: 80 },
      { x: 12, y: 75 },
      { x: 82, y: 75 },
      { x: 44, y: 62 },
    ],
    opponents: [
      { x: 40, y: 85 }, { x: 58, y: 85 },
      { x: 28, y: 75 }, { x: 68, y: 75 },
      { x: 45, y: 72 }, { x: 58, y: 72 },
    ],
    start: { x: 50, y: 65 },
    target: { x: 52, y: 76, radius: 10 },
    explanation:
      "Make a late run into the box! Defenders forget about midfielders when the ball is up front. A run from deep is much harder to defend than one from close in. Time it as the striker is about to lay the ball off and you could get a clean shot.",
    arrows: [
      { from: { x: 48, y: 80 }, to: { x: 44, y: 72 }, team: 'own' },
    ],
  },

  {
    id: 'cm-a3',
    role: 'midfielder',
    phase: 'attacking',
    principle: 'Support without crowding',
    prompt:
      "Your right winger is 1v1 on the touchline with the ball. You're the central midfielder — where do you position?",
    ball: { x: 85, y: 65 },
    teammates: [
      { x: 85, y: 65 },
      { x: 50, y: 75 },
      { x: 20, y: 68 },
      { x: 48, y: 58 },
    ],
    opponents: [
      { x: 78, y: 72 },
      { x: 45, y: 80 }, { x: 62, y: 80 },
      { x: 32, y: 72 }, { x: 55, y: 65 },
    ],
    start: { x: 72, y: 68 },
    target: { x: 55, y: 72, radius: 12 },
    explanation:
      "Stay central and give the winger space! If you crowd close, you're just adding another player for the defender to block. Hold the middle to give the winger an option if they beat their man, receive a cutback, or get a shot on goal yourself. You're the safety valve.",
    arrows: [
      { from: { x: 85, y: 65 }, to: { x: 82, y: 78 }, team: 'own' },
    ],
  },

  {
    id: 'cm-d1',
    role: 'midfielder',
    phase: 'defending',
    principle: 'Press the holding midfielder',
    prompt:
      "Their defensive midfielder keeps getting the ball in the center and turning. Where do you go?",
    ball: { x: 50, y: 48 },
    teammates: [
      { x: 50, y: 5 },
      { x: 40, y: 22 },
      { x: 60, y: 22 },
      { x: 18, y: 42 },
      { x: 82, y: 42 },
    ],
    opponents: [
      { x: 50, y: 48 },
      { x: 35, y: 58 }, { x: 65, y: 58 },
      { x: 48, y: 68 },
      { x: 22, y: 55 }, { x: 78, y: 55 },
    ],
    start: { x: 50, y: 62 },
    target: { x: 50, y: 52, radius: 9 },
    explanation:
      "Close down their holding midfielder quickly! When they have time to turn in the center, they can pick any pass. Get tight, force them to play backward, and you cut off the supply to their forwards. Being too deep lets them dictate the game.",
    arrows: [
      { from: { x: 50, y: 48 }, to: { x: 48, y: 62 }, team: 'opponent' },
    ],
  },

  {
    id: 'cm-d2',
    role: 'midfielder',
    phase: 'defending',
    principle: 'Cover the channel',
    prompt:
      "Your right back pushed forward and we just lost the ball. There's a big gap on the right side. What do you do?",
    ball: { x: 65, y: 62 },
    teammates: [
      { x: 50, y:  5 },
      { x: 42, y: 22 },
      { x: 58, y: 22 },
      { x: 18, y: 42 },
      { x: 82, y: 38 },
    ],
    opponents: [
      { x: 65, y: 62 },
      { x: 80, y: 68 },
      { x: 50, y: 65 },
      { x: 22, y: 65 },
    ],
    start: { x: 48, y: 55 },
    target: { x: 68, y: 48, radius: 12 },
    explanation:
      "Cover the space your fullback left! When a fullback goes forward and we lose the ball, the nearest midfielder must cover the channel. Drop into the right side so the opponent's winger can't run straight at your defense. Don't wait — they'll sprint into that space immediately.",
    arrows: [
      { from: { x: 80, y: 66 }, to: { x: 80, y: 52 }, team: 'opponent' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // DEFENDER
  // ═══════════════════════════════════════════════════════════════

  {
    id: 'df-d1',
    role: 'defender',
    phase: 'defending',
    principle: 'Hold the defensive line',
    prompt:
      "A striker is making a run in behind, but your team has good shape. Do you step out to chase them or hold your line?",
    ball: { x: 45, y: 60 },
    teammates: [
      { x: 50, y:  5 },
      { x: 60, y: 22 },
      { x: 18, y: 35 },
      { x: 82, y: 35 },
      { x: 45, y: 45 },
    ],
    opponents: [
      { x: 45, y: 60 },
      { x: 52, y: 72 },
      { x: 28, y: 65 },
    ],
    start: { x: 40, y: 18 },
    target: { x: 40, y: 28, radius: 9 },
    explanation:
      "Hold your line! If you step out and the striker runs past you, there's no one left. Keep your shape — let the midfielder do the pressing. Your job as a center back is to stay between the ball and the goal. Only step when you're sure you'll win it clean.",
    arrows: [
      { from: { x: 52, y: 72 }, to: { x: 52, y: 82 }, team: 'opponent' },
    ],
  },

  {
    id: 'df-d2',
    role: 'defender',
    phase: 'defending',
    principle: 'Track the diagonal run',
    prompt:
      "A striker is making a diagonal run across the back four into your zone. You're the nearest center back — what do you do?",
    ball: { x: 32, y: 65 },
    teammates: [
      { x: 50, y:  5 },
      { x: 60, y: 20 },
      { x: 18, y: 32 },
      { x: 82, y: 32 },
      { x: 44, y: 45 },
    ],
    opponents: [
      { x: 32, y: 65 },
      { x: 48, y: 72 },
      { x: 22, y: 72 },
    ],
    start: { x: 40, y: 20 },
    target: { x: 46, y: 28, radius: 8 },
    explanation:
      "Track the runner and stay goal-side! When a striker makes a diagonal run across your area, follow them or they'll get in behind. Keep your body between them and the goal at all times. Don't watch the ball — know where the runner is.",
    arrows: [
      { from: { x: 48, y: 72 }, to: { x: 38, y: 82 }, team: 'opponent' },
    ],
  },

  {
    id: 'df-d3',
    role: 'defender',
    phase: 'defending',
    principle: 'Step to intercept',
    prompt:
      "The opposing midfielder looks like they're about to play a through ball in behind. Do you step forward to cut it out?",
    ball: { x: 48, y: 60 },
    teammates: [
      { x: 50, y:  5 },
      { x: 60, y: 22 },
      { x: 18, y: 35 },
      { x: 82, y: 35 },
      { x: 45, y: 45 },
    ],
    opponents: [
      { x: 48, y: 60 },
      { x: 50, y: 75 },
      { x: 25, y: 65 },
    ],
    start: { x: 40, y: 22 },
    target: { x: 44, y: 34, radius: 9 },
    explanation:
      "Step forward and intercept! Read the pass early — if you can get there before the striker, you win the ball clean. Watch the passer's body shape to predict the direction, then step with confidence. Half-stepping is the worst option: you neither block the pass nor stay in position.",
    arrows: [
      { from: { x: 48, y: 60 }, to: { x: 50, y: 80 }, team: 'opponent' },
    ],
  },

  {
    id: 'df-a1',
    role: 'defender',
    phase: 'attacking',
    principle: 'Overlap as fullback',
    prompt:
      "Your winger has beaten their fullback and is driving to the byline. You're the fullback behind them — where do you go?",
    ball: { x: 82, y: 78 },
    teammates: [
      { x: 82, y: 78 },
      { x: 52, y: 72 },
      { x: 50, y: 88 },
      { x: 44, y: 62 },
    ],
    opponents: [
      { x: 75, y: 82 },
      { x: 52, y: 88 }, { x: 38, y: 85 },
      { x: 68, y: 72 },
    ],
    start: { x: 80, y: 52 },
    target: { x: 90, y: 78, radius: 10 },
    explanation:
      "Overlap around your winger to the byline! When they beat their man, sprint into the space they've created. Now you can cross from a fresh angle the defense doesn't expect. Late overlapping runs from fullbacks are some of the hardest things in soccer to defend.",
    arrows: [
      { from: { x: 82, y: 78 }, to: { x: 78, y: 90 }, team: 'own' },
    ],
  },

  {
    id: 'df-d4',
    role: 'defender',
    phase: 'defending',
    principle: 'Fullback recovery shape',
    prompt:
      "The ball is on the far side in the opponent's possession. You're the right fullback — where do you tuck?",
    ball: { x: 12, y: 55 },
    teammates: [
      { x: 50, y:  5 },
      { x: 40, y: 22 },
      { x: 58, y: 22 },
      { x: 15, y: 40 },
      { x: 44, y: 45 },
    ],
    opponents: [
      { x: 12, y: 55 },
      { x: 46, y: 62 },
      { x: 78, y: 62 },
      { x: 44, y: 50 },
    ],
    start: { x: 88, y: 50 },
    target: { x: 68, y: 38, radius: 12 },
    explanation:
      "Tuck inside and narrow your position! When the ball is 60 yards away, you don't need to be wide. Move inward so there are fewer gaps between you and your teammates. Be ready to sprint wide the moment the ball switches to your side — but stay compact while it's far away.",
    arrows: [
      {
        from: { x: 12, y: 55 },
        to: { x: 72, y: 60 },
        team: 'opponent',
        controlPoint: { x: 44, y: 68 },
      },
    ],
  },
]

export default scenarios

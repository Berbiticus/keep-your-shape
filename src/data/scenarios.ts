import type { Scenario } from '../types'

// Coordinate system:
//   x: 0 = left touchline, 100 = right touchline
//   y: 0 = own goal line, 100 = opponent goal line
//   Attacking direction → y = 100 (opponent goal, top of screen)
//
// Arrows show what key players are DOING in the play (before the player decides).
//   team:'own'      = blue arrow  (teammate movement / pass intent)
//   team:'opponent' = red arrow   (opponent movement / threat)

const scenarios: Scenario[] = [
  // ─── ATTACKING ─────────────────────────────────────────────────────────────

  {
    id: 'a1',
    phase: 'attacking',
    principle: 'Hold width',
    prompt:
      "Your left back has the ball on the far side of the pitch. You're the right winger — where should you be?",
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
      // LB driving forward with ball
      { from: { x: 12, y: 35 }, to: { x: 14, y: 54 }, team: 'own' },
    ],
  },

  {
    id: 'a2',
    phase: 'attacking',
    principle: 'Back-post run',
    prompt:
      "Your left winger is about to whip in a cross from near the byline. Where do you attack in the box?",
    ball: { x: 6, y: 83 },
    teammates: [
      { x: 6,  y: 83 }, // LW crossing
      { x: 46, y: 88 }, // striker
      { x: 35, y: 74 }, // CM arriving
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
      // LW's cross arcing toward back-post area (curved ball flight)
      {
        from: { x: 6, y: 83 },
        to: { x: 72, y: 96 },
        team: 'own',
        controlPoint: { x: 5, y: 98 },
      },
    ],
  },

  {
    id: 'a3',
    phase: 'attacking',
    principle: 'Stay onside',
    prompt:
      "Your midfielder is about to play you in with a through ball. The last defender is near the top of the box — where do you time your run?",
    ball: { x: 48, y: 58 },
    teammates: [
      { x: 48, y: 58 }, // CM (ball)
      { x: 18, y: 65 }, // LW
    ],
    opponents: [
      { x: 40, y: 79 }, // last CB — this is the offside line
      { x: 62, y: 79 }, // last CB
      { x: 28, y: 66 }, { x: 54, y: 66 },
    ],
    start: { x: 72, y: 84 },
    target: { x: 72, y: 78, radius: 7 },
    explanation:
      "Hang on the last defender's shoulder! If you sprint past them before the ball is kicked, the ref will flag offside and the chance is wasted. Stay level with or just behind the last defender, then explode forward the moment the ball is played.",
    arrows: [
      // CM's through-ball intention
      { from: { x: 48, y: 58 }, to: { x: 66, y: 80 }, team: 'own' },
      // Defenders stepping up (offside trap)
      { from: { x: 40, y: 79 }, to: { x: 40, y: 85 }, team: 'opponent' },
      { from: { x: 62, y: 79 }, to: { x: 62, y: 85 }, team: 'opponent' },
    ],
  },

  {
    id: 'a4',
    phase: 'attacking',
    principle: 'Passing triangle',
    prompt:
      "Your right back has the ball but you're standing right in front of him — he can't play forward! What do you do?",
    ball: { x: 78, y: 42 },
    teammates: [
      { x: 78, y: 42 }, // RB (ball)
      { x: 50, y: 52 }, // CM
      { x: 45, y: 76 }, // striker
    ],
    opponents: [
      { x: 68, y: 55 }, { x: 55, y: 62 },
      { x: 78, y: 60 }, { x: 44, y: 64 },
    ],
    start: { x: 82, y: 44 },
    target: { x: 82, y: 63, radius: 10 },
    explanation:
      "Create an angle! Move forward AND to the side so your right back has a clear passing lane. Good positions form a triangle between you, the ball, and another teammate. Standing right in front of him lets one defender cover you both at once.",
    arrows: [
      // RB's desired forward pass — currently blocked by bad positioning
      { from: { x: 78, y: 42 }, to: { x: 80, y: 60 }, team: 'own' },
    ],
  },

  {
    id: 'a5',
    phase: 'attacking',
    principle: 'Check to receive',
    prompt:
      "The midfielder has the ball but your defender is right on your back. You can't receive it up top. What move do you make?",
    ball: { x: 50, y: 58 },
    teammates: [
      { x: 50, y: 58 }, // CM (ball)
      { x: 18, y: 70 }, // LW
      { x: 44, y: 82 }, // striker
    ],
    opponents: [
      { x: 42, y: 82 }, { x: 60, y: 82 },
      { x: 72, y: 80 }, // tight marker
      { x: 36, y: 64 },
    ],
    start: { x: 72, y: 82 },
    target: { x: 68, y: 68, radius: 10 },
    explanation:
      "Check back toward the ball! Drop away from your defender to find a pocket of space. Once you receive it to your feet, you can turn and attack. This move is called a 'checking run' and pros use it all the time to shake a marker.",
    arrows: [
      // Tight marker pressing into the player's back
      { from: { x: 72, y: 78 }, to: { x: 72, y: 83 }, team: 'opponent' },
      // CM looking to play forward
      { from: { x: 50, y: 58 }, to: { x: 60, y: 72 }, team: 'own' },
    ],
  },

  {
    id: 'a6',
    phase: 'attacking',
    principle: 'Run in behind',
    prompt:
      "The defense has pushed way up the pitch. Your attacking midfielder has the ball and there's loads of space behind the defense. Where do you go?",
    ball: { x: 50, y: 62 },
    teammates: [
      { x: 50, y: 62 }, // AM (ball)
      { x: 15, y: 68 }, // LW
      { x: 52, y: 72 }, // striker
    ],
    opponents: [
      { x: 38, y: 76 }, // last defenders — pushed up HIGH
      { x: 56, y: 76 },
      { x: 25, y: 68 }, { x: 64, y: 70 },
    ],
    start: { x: 76, y: 64 },
    target: { x: 80, y: 83, radius: 10 },
    explanation:
      "Go! When defenders push up high, run in behind them into the space. Time your run so you don't go too early (offside!) but the second the ball is about to be played — sprint! A run in behind often ends in a 1v1 with the keeper.",
    arrows: [
      // Two defenders stepping up aggressively (shows their high line)
      { from: { x: 38, y: 76 }, to: { x: 38, y: 83 }, team: 'opponent' },
      { from: { x: 56, y: 76 }, to: { x: 56, y: 83 }, team: 'opponent' },
    ],
  },

  {
    id: 'a7',
    phase: 'attacking',
    principle: 'Create overlap space',
    prompt:
      "Your right back is overlapping down the wing right next to you. Where do you move to help him?",
    ball: { x: 84, y: 66 },
    teammates: [
      { x: 84, y: 66 }, // RB overlapping (ball)
      { x: 52, y: 58 }, // CM
      { x: 46, y: 82 }, // striker
    ],
    opponents: [
      { x: 44, y: 82 }, { x: 60, y: 82 },
      { x: 75, y: 74 }, { x: 60, y: 66 },
    ],
    start: { x: 80, y: 72 },
    target: { x: 62, y: 75, radius: 12 },
    explanation:
      "Move inside to give him room! If you're both on the same wing, it's too crowded and easy to defend. Tuck inside — you might drag a defender with you — and now your right back has the whole wide channel to attack into. You could also receive inside and shoot!",
    arrows: [
      // RB's overlapping run forward along the touchline
      { from: { x: 84, y: 54 }, to: { x: 84, y: 70 }, team: 'own' },
    ],
  },

  {
    id: 'a8',
    phase: 'attacking',
    principle: 'Diagonal support run',
    prompt:
      "Your center back is carrying the ball forward. You're level with them — not helpful! Where do you run?",
    ball: { x: 60, y: 32 },
    teammates: [
      { x: 60, y: 32 }, // CB carrying ball
      { x: 40, y: 48 }, // CM
      { x: 46, y: 74 }, // striker
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
      // CB driving forward with the ball
      { from: { x: 60, y: 32 }, to: { x: 60, y: 52 }, team: 'own' },
    ],
  },

  // ─── DEFENDING ─────────────────────────────────────────────────────────────

  {
    id: 'd1',
    phase: 'defending',
    principle: 'Recover goal-side',
    prompt:
      "We just lost the ball! Their right winger is running at our goal with pace. Where do you recover to?",
    ball: { x: 78, y: 62 },
    teammates: [
      { x: 50, y:  3 }, // own GK
      { x: 42, y: 20 }, // own CB
      { x: 58, y: 20 }, // own CB
      { x: 18, y: 38 }, // own LB
    ],
    opponents: [
      { x: 78, y: 62 }, // opp RW (ball) — threat
      { x: 50, y: 60 }, // opp ST
      { x: 18, y: 62 }, // opp LW
    ],
    start: { x: 76, y: 68 },
    target: { x: 74, y: 50, radius: 12 },
    explanation:
      "Sprint goal-side — between them and your goal! You don't need to tackle right away; just get goal-side so they can't run straight at the keeper. 'Goal-side' means between the attacker and your goal. Never chase behind — always cut the angle.",
    arrows: [
      // Opp RW sprinting toward own goal (y decreasing = toward our goal)
      { from: { x: 78, y: 62 }, to: { x: 76, y: 44 }, team: 'opponent' },
    ],
  },

  {
    id: 'd2',
    phase: 'defending',
    principle: 'Press to force wide',
    prompt:
      "Their center back has the ball near their own box. Your team is pressing high — where do you go to press?",
    ball: { x: 58, y: 22 },
    teammates: [
      { x: 50, y:  3 }, // own GK
      { x: 40, y: 18 }, // own CB
      { x: 58, y: 18 }, // own CB
      { x: 50, y: 45 }, // own ST (pressing left CB)
    ],
    opponents: [
      { x: 58, y: 22 }, // opp CB (ball)
      { x: 40, y: 22 }, // opp CB
      { x: 50, y:  4 }, // opp GK
      { x: 80, y: 26 }, // opp RB
    ],
    start: { x: 72, y: 52 },
    target: { x: 62, y: 35, radius: 10 },
    explanation:
      "Press from the inside! Approach the center back from the middle, not from the outside. This blocks the central passing lane and forces them to go wide or backward. If you press from outside, you're leaving the dangerous central channel wide open.",
    arrows: [
      // Opp CB intending to play forward through the middle
      { from: { x: 58, y: 22 }, to: { x: 56, y: 42 }, team: 'opponent' },
    ],
  },

  {
    id: 'd3',
    phase: 'defending',
    principle: 'Stay compact',
    prompt:
      "Their left winger has the ball on the far side. You're the right winger. Where should you be?",
    ball: { x: 12, y: 58 },
    teammates: [
      { x: 50, y:  3 }, // own GK
      { x: 42, y: 22 }, // own CB
      { x: 58, y: 22 }, // own CB
      { x: 18, y: 40 }, // own LB (nearest)
      { x: 44, y: 48 }, // own CM
    ],
    opponents: [
      { x: 12, y: 58 }, // opp LW (ball)
      { x: 46, y: 65 }, // opp ST
      { x: 80, y: 65 }, // opp RW (wants the switch)
      { x: 46, y: 50 }, // opp CM
    ],
    start: { x: 88, y: 62 },
    target: { x: 62, y: 52, radius: 12 },
    explanation:
      "Tuck inside and stay compact! When the ball is on the far side, you don't need to be wide — move toward the center to block passing lanes and help your team. Stay alert for a switch of play: the second the ball comes to your side, you can sprint out wide again.",
    arrows: [
      // Opp LW looking to switch the play across to opp RW (long diagonal)
      {
        from: { x: 12, y: 58 },
        to: { x: 78, y: 65 },
        team: 'opponent',
        controlPoint: { x: 44, y: 72 },
      },
    ],
  },

  {
    id: 'd4',
    phase: 'defending',
    principle: 'Track your fullback',
    prompt:
      "Their right back is making an overlapping run down the wing — extra attacker! You're the left winger. What do you do?",
    ball: { x: 80, y: 64 },
    teammates: [
      { x: 50, y:  3 }, // own GK
      { x: 42, y: 22 }, // own CB
      { x: 58, y: 22 }, // own CB
      { x: 18, y: 42 }, // own LB
      { x: 44, y: 50 }, // own CM
    ],
    opponents: [
      { x: 82, y: 62 }, // opp RB — overlapping run
      { x: 78, y: 72 }, // opp RW
      { x: 50, y: 65 }, // opp ST (ball)
      { x: 18, y: 65 }, // opp LW
    ],
    start: { x: 74, y: 76 },
    target: { x: 78, y: 58, radius: 10 },
    explanation:
      "Track back with the overlapping fullback! They've created an extra attacker on your side — if you don't follow them, they'll have a free cross or shot. Drop back and stay with them. Once your team wins the ball back, you can push forward again.",
    arrows: [
      // Opp RB's overlapping run (going toward our goal = y decreasing)
      { from: { x: 82, y: 66 }, to: { x: 82, y: 48 }, team: 'opponent' },
    ],
  },

  {
    id: 'd5',
    phase: 'defending',
    principle: 'High press',
    prompt:
      "Opponents have a goal kick and your coach says to press high. Their center back at the left is their short option. Where do you position yourself?",
    ball: { x: 50, y: 4 },
    teammates: [
      { x: 50, y:  3 }, // own GK
      { x: 42, y: 18 }, // own CB
      { x: 58, y: 18 }, // own CB
      { x: 50, y: 40 }, // own ST (pressing left CB)
    ],
    opponents: [
      { x: 50, y:  4 }, // opp GK (ball)
      { x: 36, y: 18 }, // opp LCB — short option
      { x: 64, y: 18 }, // opp RCB
      { x: 18, y: 22 }, // opp LB
      { x: 82, y: 22 }, // opp RB
    ],
    start: { x: 78, y: 48 },
    target: { x: 40, y: 30, radius: 12 },
    explanation:
      "Cut off the short pass! Get between the keeper and their center back so they can't play out easily. Force them to kick it long — that's much easier for your defenders to handle than a team playing neat combinations out from the back. First pressing player, first win!",
    arrows: [
      // Opp GK's intended short pass to the left CB
      { from: { x: 50, y: 4 }, to: { x: 38, y: 18 }, team: 'opponent' },
    ],
  },

  {
    id: 'd6',
    phase: 'defending',
    principle: 'Defensive shape',
    prompt:
      "We lost the ball and the other team is building up in midfield. You're way up the pitch. What do you do?",
    ball: { x: 46, y: 50 },
    teammates: [
      { x: 50, y:  3 }, // own GK
      { x: 40, y: 22 }, // own CB
      { x: 60, y: 22 }, // own CB
      { x: 18, y: 40 }, // own LB
      { x: 44, y: 48 }, // own CM
    ],
    opponents: [
      { x: 46, y: 50 }, // opp CM (ball)
      { x: 54, y: 58 }, // opp AM
      { x: 48, y: 68 }, // opp ST
      { x: 18, y: 65 }, // opp LW
    ],
    start: { x: 78, y: 78 },
    target: { x: 75, y: 55, radius: 12 },
    explanation:
      "Drop back into your defensive position! As a winger, when your team doesn't have the ball, you need to get back to roughly midfield on your side. This keeps your team's shape compact. Being up high leaves a massive gap — and their fullback will run straight through it.",
    arrows: [
      // Opp AM driving forward through the space
      { from: { x: 54, y: 58 }, to: { x: 52, y: 44 }, team: 'opponent' },
    ],
  },

  {
    id: 'd7',
    phase: 'defending',
    principle: 'Track runners in the box',
    prompt:
      "Their right winger is about to cross. One of their strikers is making a near-post run. Who do you track?",
    ball: { x: 88, y: 80 },
    teammates: [
      { x: 50, y:  3 }, // own GK
      { x: 40, y: 20 }, // own CB
      { x: 62, y: 20 }, // own CB
      { x: 18, y: 40 }, // own LB
      { x: 50, y: 38 }, // own DM
    ],
    opponents: [
      { x: 88, y: 80 }, // opp RW (crossing)
      { x: 58, y: 88 }, // opp ST — near-post run
      { x: 44, y: 90 }, // opp 2nd ST
      { x: 20, y: 80 }, // opp LW arriving
    ],
    start: { x: 68, y: 85 },
    target: { x: 55, y: 88, radius: 9 },
    explanation:
      "Track the near-post runner! Don't just watch the ball — when someone runs into your zone in the box, it's your job to follow them. Get goal-side of that striker and stay tight. If you lose them for even a second, they'll get an easy header at the near post.",
    arrows: [
      // Opp RW's cross arcing toward near post (curved)
      {
        from: { x: 88, y: 80 },
        to: { x: 52, y: 95 },
        team: 'opponent',
        controlPoint: { x: 88, y: 97 },
      },
      // Opp ST's near-post run
      { from: { x: 58, y: 86 }, to: { x: 52, y: 95 }, team: 'opponent' },
    ],
  },
]

export default scenarios

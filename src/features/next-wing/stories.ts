export interface Choice { title: string; outcome: string; strength: string }
export interface Chapter { question: string; context: string; choices: Choice[] }
export interface Story { id: string; title: string; subtitle: string; symbol: string; action: string; chapters: Chapter[] }
export const STORIES: Story[] = [
  {
    id: 'climate', title: 'A cooler neighbourhood', subtitle: 'Climate & resilient communities', symbol: '01',
    action: 'Ask a local community group what support they need during extreme weather.',
    chapters: [
      { question: 'A heatwave is approaching. Where do you begin?', context: 'In this fictional neighbourhood, you and a few volunteers have two weeks and a small shared budget.', choices: [
        { title: 'Organise neighbour check-ins', outcome: 'You reach people who might otherwise be overlooked. Volunteers now need a clear rota and consent from the people they contact.', strength: 'The Connector' },
        { title: 'Partner with a library on a cool gathering space', outcome: 'The library offers a room. Transport and opening hours still determine who can benefit.', strength: 'The Community Builder' },
        { title: 'Map existing support and share verified information', outcome: 'Your guide helps people find support. Printed copies and translation are needed to reach people offline.', strength: 'The Bridge Builder' },
      ] },
      { question: 'Some residents are still being left out. What changes?', context: 'At your first meeting, residents explain that the plan does not fit shift workers and people with limited mobility.', choices: [
        { title: 'Invite residents to redesign the plan', outcome: 'The launch is smaller, but it now reflects the people it serves. Residents choose practical priorities together.', strength: 'The Listener' },
        { title: 'Arrange help through an established local organisation', outcome: 'Experienced partners bring trusted contacts. You agree on responsibilities rather than promising more than you can deliver.', strength: 'The Connector' },
        { title: 'Pilot one accessible street-level service', outcome: 'The pilot reaches fewer people initially. It gives you a realistic way to learn before expanding.', strength: 'The Practical Innovator' },
      ] },
      { question: 'The first effort is over. What should last?', context: 'People appreciated the support, but volunteers are tired. A lasting plan needs shared ownership.', choices: [
        { title: 'Create a rotating community team', outcome: 'Responsibility is shared and volunteers can rest. The project becomes a community effort rather than depending on you.', strength: 'The Community Builder' },
        { title: 'Bring residents’ findings to a public meeting', outcome: 'Your experience becomes evidence for longer-term planning. Policy change takes time, but residents have a voice in it.', strength: 'The Advocate' },
        { title: 'Publish a small, honest guide to what worked', outcome: 'You document gaps as well as successes. Another neighbourhood can adapt the idea without repeating every mistake.', strength: 'The Bridge Builder' },
      ] },
    ],
  },
  {
    id: 'trust', title: 'A rumour travels fast', subtitle: 'Information & public trust', symbol: '02',
    action: 'Before sharing a surprising claim, trace it to its original source and check the date.',
    chapters: [
      { question: 'An alarming post is spreading. What do you do first?', context: 'A fictional message claims that a neighbourhood service is closing. Nobody has linked to an official announcement.', choices: [
        { title: 'Contact the service for confirmation', outcome: 'You learn that the hours are changing, not that the service is closing. A clear explanation is still needed.', strength: 'The Connector' },
        { title: 'Trace the post to its original source', outcome: 'The screenshot came from an older announcement. You keep a record of the context so others can check for themselves.', strength: 'The Investigator' },
        { title: 'Ask the group to pause sharing while you check', outcome: 'Some people wait; others feel dismissed. Your next message needs to acknowledge why they were worried.', strength: 'The Listener' },
      ] },
      { question: 'You have better information. How do you share it?', context: 'The people who shared the rumour were trying to help. A public argument could make them less willing to listen.', choices: [
        { title: 'Post a calm explanation with the source', outcome: 'Readers can verify your explanation. You distinguish confirmed facts from questions that remain open.', strength: 'The Bridge Builder' },
        { title: 'Message the original sharer respectfully', outcome: 'They update their post. The correction reaches their audience, though not everyone who saw the original will return.', strength: 'The Connector' },
        { title: 'Invite the service to answer community questions', outcome: 'People can ask about their real concerns. This takes coordination but builds a direct channel for future questions.', strength: 'The Community Builder' },
      ] },
      { question: 'How could the next rumour spread less easily?', context: 'One correction helps today. The group asks for a habit they can keep using.', choices: [
        { title: 'Make a simple source-checking guide', outcome: 'The group gains a repeatable process: source, date, evidence and uncertainty. No guide removes the need for judgment.', strength: 'The Investigator' },
        { title: 'Organise a friendly media-literacy session', outcome: 'People practise checking examples together. The session works best when questions are welcomed, not mocked.', strength: 'The Bridge Builder' },
        { title: 'Create a shared corrections policy', outcome: 'Updating a mistake becomes normal. Trust grows from being accountable, not from pretending to be infallible.', strength: 'The Advocate' },
      ] },
    ],
  },
  {
    id: 'belonging', title: 'A place at the table', subtitle: 'Loneliness & belonging', symbol: '03',
    action: 'Invite someone to a low-pressure shared activity, leaving them free to decline.',
    chapters: [
      { question: 'People live close together but rarely meet. What is your first step?', context: 'Your fictional apartment block has an unused common room. Several residents say they would like more connection.', choices: [
        { title: 'Ask residents what would feel welcoming', outcome: 'You hear different needs: quiet activities, accessible hours and no pressure to talk. One event will not suit everyone.', strength: 'The Listener' },
        { title: 'Start a small weekly tea table', outcome: 'A few people arrive. Familiarity could grow through repetition, though cost and hosting need to stay manageable.', strength: 'The Community Builder' },
        { title: 'Connect with an existing neighbourhood group', outcome: 'You discover activities already nearby. Your role can be helping people find them rather than duplicating the effort.', strength: 'The Connector' },
      ] },
      { question: 'The same few people keep coming. Who is missing?', context: 'Someone points out that the invitations assume everyone speaks the same language and has evenings free.', choices: [
        { title: 'Try translated invitations and another time', outcome: 'New people attend. Translation helps, but you keep asking what else makes participation difficult.', strength: 'The Bridge Builder' },
        { title: 'Offer a quiet activity alongside conversation', outcome: 'People can join without performing sociability. The group becomes comfortable with different ways of participating.', strength: 'The Listener' },
        { title: 'Invite volunteers to welcome newcomers individually', outcome: 'A familiar face makes arrival easier. Welcomers ask rather than assume what each person needs.', strength: 'The Connector' },
      ] },
      { question: 'The gathering has found its rhythm. What happens next?', context: 'People want it to continue, but the original hosts cannot do everything.', choices: [
        { title: 'Share hosting among willing residents', outcome: 'The gathering gains more than one owner. Clear boundaries keep volunteering sustainable.', strength: 'The Community Builder' },
        { title: 'Keep it small and dependable', outcome: 'You choose consistency over growth. A modest promise kept can matter more than a large promise abandoned.', strength: 'The Listener' },
        { title: 'Help another block start its own version', outcome: 'You share what you learned, while encouraging the new group to choose its own format.', strength: 'The Bridge Builder' },
      ] },
    ],
  },
  {
    id: 'technology', title: 'Who does the tool serve?', subtitle: 'Technology & inclusion', symbol: '04',
    action: 'Ask someone who uses a service what makes it difficult before proposing a technical fix.',
    chapters: [
      { question: 'A community service wants a new digital tool. Where do you start?', context: 'In this fictional project, a small team wants to make booking appointments easier. The budget is limited.', choices: [
        { title: 'Observe the current process with users’ permission', outcome: 'You discover that confusing instructions matter as much as the software. Listening changes what you planned to build.', strength: 'The Listener' },
        { title: 'Build a simple prototype to test', outcome: 'People can react to something concrete. You label it as a prototype so nobody mistakes it for a working service.', strength: 'The Practical Innovator' },
        { title: 'Review tools the organisation already has', outcome: 'An existing tool may solve part of the problem. You can spend more time on training and access.', strength: 'The Investigator' },
      ] },
      { question: 'The trial excludes some of the people who need it. What now?', context: 'Some users have older phones, use assistive technology, or prefer speaking to a person.', choices: [
        { title: 'Keep phone and in-person options available', outcome: 'People retain a choice of channels. Staff need a shared process so bookings stay consistent.', strength: 'The Advocate' },
        { title: 'Test accessibility with affected users', outcome: 'The team finds issues it had missed. Fixing them takes time and becomes part of the release criteria.', strength: 'The Practical Innovator' },
        { title: 'Simplify the flow and minimise required data', outcome: 'The form becomes easier to complete. The organisation considers what information it actually needs to provide the service.', strength: 'The Bridge Builder' },
      ] },
      { question: 'The tool works today. Who takes care of tomorrow?', context: 'Your volunteer team is about to move on. A useful service needs maintenance and accountability.', choices: [
        { title: 'Train staff and document a maintenance plan', outcome: 'The service has named owners and a way to report problems. Sustainability becomes part of the design.', strength: 'The Community Builder' },
        { title: 'Publish limitations and a feedback channel', outcome: 'Users know what the tool can and cannot do. Their reports guide future improvements.', strength: 'The Advocate' },
        { title: 'Schedule a review with users after launch', outcome: 'Success is judged by people’s experience, not simply whether the software shipped.', strength: 'The Listener' },
      ] },
    ],
  },
]

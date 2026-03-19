import 'dotenv/config'
import { PrismaClient } from '../src/lib/generated/prisma/client.js'
import { PrismaPg } from '@prisma/adapter-pg'

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  }),
})

const todos = [
  // Work (20)
  { title: 'Finish Q2 report', description: 'Compile all department metrics and write summary', completed: true },
  { title: 'Review PR #42', description: 'Check auth middleware refactor', completed: false },
  { title: 'Team standup notes', description: null, completed: true },
  { title: 'Update project roadmap', description: 'Add Q3 milestones and re-prioritize backlog', completed: false },
  { title: 'Schedule 1:1 with manager', description: null, completed: true },
  { title: 'Fix production bug #1024', description: 'Users unable to reset password on mobile', completed: false },
  { title: 'Write unit tests for auth module', description: null, completed: false },
  { title: 'Deploy staging environment', description: 'Use new Docker config from devops branch', completed: true },
  { title: 'Review design mockups', description: 'Dashboard redesign from Figma', completed: false },
  { title: 'Update API documentation', description: 'Add new /todos endpoints to OpenAPI spec', completed: false },
  { title: 'Respond to client emails', description: null, completed: true },
  { title: 'Set up error monitoring', description: 'Integrate Sentry into production build', completed: false },
  { title: 'Code review for new hire', description: 'Review Sarah\'s first PR carefully', completed: false },
  { title: 'Prepare sprint retrospective', description: null, completed: true },
  { title: 'Optimize database queries', description: 'Profile slow queries on the todos endpoint', completed: false },
  { title: 'Set up CI/CD pipeline', description: 'GitHub Actions for auto-deploy on merge', completed: false },
  { title: 'Write release notes for v2.1', description: null, completed: false },
  { title: 'Migrate legacy endpoints', description: 'Replace REST routes with server functions', completed: false },
  { title: 'Conduct user interviews', description: '5 sessions scheduled for Friday', completed: true },
  { title: 'Finalize hiring decision', description: null, completed: false },

  // Personal (20)
  { title: 'Call dentist', description: 'Schedule cleaning, overdue by 3 months', completed: false },
  { title: 'Pay rent', description: null, completed: true },
  { title: 'Organize desk', description: 'Get a cable management solution', completed: false },
  { title: 'Renew car registration', description: 'Expires end of month', completed: false },
  { title: 'Call mom', description: null, completed: true },
  { title: 'Book flights for summer trip', description: 'Check prices for July 10-17', completed: false },
  { title: 'Clean apartment', description: null, completed: true },
  { title: 'Do laundry', description: null, completed: true },
  { title: 'Fix leaking faucet', description: 'Call the super or buy washer kit', completed: false },
  { title: 'Update resume', description: null, completed: false },
  { title: 'Respond to party invite', description: null, completed: true },
  { title: 'Get oil change', description: 'Car is at 5,000 miles since last service', completed: false },
  { title: 'Set up automatic bill pay', description: 'Electric and internet bills', completed: false },
  { title: 'Find a plumber', description: 'Bathroom sink draining slowly', completed: false },
  { title: 'Write birthday card for dad', description: null, completed: true },
  { title: 'Cancel unused subscriptions', description: 'Check Rocket Money for unused charges', completed: false },
  { title: 'Back up photos to cloud', description: null, completed: false },
  { title: 'Donate old clothes', description: 'Bag in closet already packed', completed: false },
  { title: 'Schedule eye exam', description: null, completed: false },
  { title: 'Refill prescriptions', description: null, completed: true },

  // Shopping (15)
  { title: 'Buy groceries', description: 'Eggs, milk, bread, chicken, vegetables', completed: true },
  { title: 'Order new headphones', description: 'Sony WH-1000XM5 on sale this week', completed: false },
  { title: 'Get birthday gift for Alex', description: 'Maybe a book or kitchen gadget', completed: false },
  { title: 'Buy standing desk mat', description: null, completed: false },
  { title: 'Restock coffee beans', description: 'Running low, order from local roaster', completed: true },
  { title: 'Get new running shoes', description: 'Current ones are worn down', completed: false },
  { title: 'Buy printer ink', description: null, completed: true },
  { title: 'Order replacement phone case', description: 'Cracked last week', completed: false },
  { title: 'Stock up on vitamins', description: 'Vitamin D and magnesium', completed: false },
  { title: 'Buy HDMI cable', description: 'Need 4K capable, 2m length', completed: false },
  { title: 'Get new bath towels', description: null, completed: false },
  { title: 'Order desk lamp', description: 'Something warm-toned for evening work', completed: false },
  { title: 'Buy hand soap refills', description: null, completed: true },
  { title: 'Get a new water bottle', description: 'Insulated, 32oz', completed: false },
  { title: 'Order new keyboard', description: 'Mechanical, tenkeyless layout', completed: false },

  // Fitness (15)
  { title: 'Morning run', description: '5km at easy pace', completed: true },
  { title: 'Yoga session', description: '30-minute flow on YouTube', completed: false },
  { title: 'Meal prep for the week', description: 'Grilled chicken, rice, roasted veggies', completed: true },
  { title: 'Go to gym', description: 'Upper body day', completed: true },
  { title: 'Stretch after work', description: 'Hip flexors and hamstrings', completed: false },
  { title: 'Try new hiking trail', description: 'Redwood trail on Saturday morning', completed: false },
  { title: 'Track calories for the week', description: null, completed: false },
  { title: 'Sign up for 5K race', description: 'Registration closes Friday', completed: false },
  { title: 'Swim laps at community pool', description: '30 minutes, freestyle', completed: false },
  { title: 'Buy new gym gloves', description: null, completed: false },
  { title: 'Do 100 pushups challenge day 14', description: null, completed: true },
  { title: 'Schedule rest day', description: null, completed: true },
  { title: 'Cook healthy dinner', description: 'Salmon and asparagus', completed: false },
  { title: 'Foam roll after workout', description: null, completed: true },
  { title: 'Drink 8 glasses of water', description: null, completed: false },

  // Learning (15)
  { title: 'Read chapter 3 of Deep Work', description: null, completed: true },
  { title: 'Complete TypeScript course', description: 'Finish modules 8-10 on generics', completed: false },
  { title: 'Watch system design lecture', description: 'Distributed systems on YouTube', completed: false },
  { title: 'Practice LeetCode problems', description: 'Two medium problems today', completed: false },
  { title: 'Study Spanish for 20 minutes', description: 'Duolingo streak day 42', completed: true },
  { title: 'Read React docs on suspense', description: null, completed: false },
  { title: 'Listen to podcast on startups', description: 'Lex Fridman with Sam Altman episode', completed: true },
  { title: 'Take notes on last book chapter', description: null, completed: false },
  { title: 'Review flashcards', description: 'Anki deck for SQL concepts', completed: false },
  { title: 'Write blog post draft', description: 'Topic: lessons from building with TanStack', completed: false },
  { title: 'Watch CSS Grid tutorial', description: null, completed: true },
  { title: 'Complete AWS certification module', description: 'Module 6: IAM and security', completed: false },
  { title: 'Practice piano', description: '15 minutes, focus on chord transitions', completed: false },
  { title: 'Read design patterns chapter', description: 'Observer and strategy patterns', completed: false },
  { title: 'Set up personal wiki', description: 'Obsidian vault for study notes', completed: false },

  // Misc (15)
  { title: 'Water the plants', description: null, completed: true },
  { title: 'Take out recycling', description: null, completed: true },
  { title: 'Reply to text messages', description: null, completed: false },
  { title: 'Check the mail', description: null, completed: true },
  { title: 'Print boarding pass', description: 'Flight on Thursday at 7am', completed: false },
  { title: 'Set alarm for early meeting', description: '8:30am call with London team', completed: false },
  { title: 'Charge all devices', description: null, completed: true },
  { title: 'Clear email inbox', description: 'Inbox zero challenge', completed: false },
  { title: 'Watch the new show everyone is talking about', description: null, completed: false },
  { title: 'Call the bank', description: 'Dispute a charge on last statement', completed: false },
  { title: 'Feed the cat', description: null, completed: true },
  { title: 'Set up out-of-office reply', description: 'For next week vacation', completed: false },
  { title: 'Find parking permit form', description: null, completed: false },
  { title: 'RSVP to wedding', description: 'Deadline is this Sunday', completed: false },
  { title: 'Review monthly budget', description: 'Check spending vs targets', completed: false },
]

async function main() {
  const user = await prisma.user.findFirst()

  if (!user) {
    console.error('❌ No users found. Please sign up in the app first, then run the seed again.')
    process.exit(1)
  }

  await prisma.todo.createMany({
    data: todos.map((todo) => ({
      ...todo,
      userId: user.id,
    })),
  })

  console.log(`✅ Seeded ${todos.length} todos for user ${user.email}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())

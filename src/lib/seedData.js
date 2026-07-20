import { collection, getDocs, addDoc, doc, setDoc } from 'firebase/firestore'
import { db } from './firebase'

const SEED_VERSION = '1.0.0'

// All seed data for initial Firestore population
const SEED_DATA = {
  app_settings: [{
    id: 'config',
    data: {
      appName: 'Ngoms AI',
      tagline: 'Learn Smarter. Not Harder.',
      primaryColor: '#3B82F6',
      accentColor: '#7C3AED',
      version: SEED_VERSION,
      maintenanceMode: false,
      maintenanceMessage: 'We are upgrading Ngoms AI. Back soon!',
      supportEmail: 'support@ngoms.ai',
      aiQueryLimit: '50',
      maxFileSize: '10',
    }
  }],
  app_banner: [{
    id: 'main_banner',
    data: {
      title: 'Welcome to Ngoms AI Premium',
      subtitle: 'Unlock unlimited AI tutoring, flashcards & quizzes',
      icon: 'Sparkles',
      bgColor: 'from-primary to-violet',
      actionText: 'Upgrade Now',
      actionRoute: '/settings',
      active: true,
    }
  }],
  features: [
    { id: 'feat_ai_chat', data: { icon: '💬', name: 'AI Chat Tutor', enabled: true, key: 'ai_chat' } },
    { id: 'feat_flashcards', data: { icon: '🎴', name: 'Flashcard Studio', enabled: true, key: 'flashcards' } },
    { id: 'feat_quiz', data: { icon: '⚡', name: 'Quiz Engine', enabled: true, key: 'quiz' } },
    { id: 'feat_notes', data: { icon: '📝', name: 'Smart Notes', enabled: true, key: 'notes' } },
    { id: 'feat_planner', data: { icon: '📅', name: 'Study Planner', enabled: true, key: 'planner' } },
    { id: 'feat_analytics', data: { icon: '📊', name: 'Analytics', enabled: true, key: 'analytics' } },
    { id: 'feat_leaderboard', data: { icon: '🏆', name: 'Leaderboard', enabled: true, key: 'leaderboard' } },
    { id: 'feat_forum', data: { icon: '👥', name: 'Community Forum', enabled: false, key: 'forum' } },
    { id: 'feat_study_music', data: { icon: '🎵', name: 'Phonk Study Music', enabled: false, key: 'study_music' } },
  ],
  courses: [
    { data: { title: 'Introduction to Computer Science', category: 'Technology', icon: '💻', color: 'from-blue-500 to-primary', lessons: '12', students: '342', status: 'Active' } },
    { data: { title: 'Mathematics for AI', category: 'Mathematics', icon: '🔢', color: 'from-violet to-purple-500', lessons: '8', students: '189', status: 'Active' } },
    { data: { title: 'English Literature Essentials', category: 'Languages', icon: '📖', color: 'from-amber-500 to-orange-500', lessons: '10', students: '256', status: 'Active' } },
    { data: { title: 'Biology: Human Body Systems', category: 'Science', icon: '🧬', color: 'from-emerald-500 to-teal-500', lessons: '15', students: '421', status: 'Active' } },
    { data: { title: 'Business Fundamentals', category: 'Business', icon: '📈', color: 'from-pink-500 to-rose-500', lessons: '6', students: '178', status: 'Active' } },
    { data: { title: 'Malawian History & Culture', category: 'History', icon: '🌍', color: 'from-cyan-500 to-blue-500', lessons: '7', students: '95', status: 'Active' } },
  ],
  flashcard_decks: [
    { data: { title: 'Python Programming Basics', author: 'Ngoms AI', views: '1240', status: 'Active', cards: [
      { front: 'What is a variable?', back: 'A named storage location for data in memory' },
      { front: 'What does print() do?', back: 'Outputs text to the console' },
      { front: 'What is a list?', back: 'An ordered, mutable collection of items' },
      { front: 'What is a dictionary?', back: 'A key-value pair data structure' },
      { front: 'What is a for loop?', back: 'A loop that iterates over a sequence' },
    ]}},
    { data: { title: 'Cell Biology', author: 'Ngoms AI', views: '890', status: 'Active', cards: [
      { front: 'What is the powerhouse of the cell?', back: 'Mitochondria' },
      { front: 'What is photosynthesis?', back: 'Process where plants convert sunlight into energy' },
      { front: 'What is DNA?', back: 'Deoxyribonucleic acid, the genetic blueprint' },
      { front: 'What is osmosis?', back: 'Movement of water across a semipermeable membrane' },
    ]}},
    { data: { title: 'English Grammar Rules', author: 'Ngoms AI', views: '2100', status: 'Active', cards: [
      { front: 'What is a noun?', back: 'A word that names a person, place, or thing' },
      { front: 'What is a verb?', back: 'An action word' },
      { front: 'When to use their vs there?', back: 'Their = possessive, There = location' },
      { front: 'What is a preposition?', back: 'A word showing relationship between words' },
    ]}},
    { data: { title: 'Algebra Formulas', author: 'Ngoms AI', views: '670', status: 'Active', cards: [
      { front: 'Quadratic formula', back: 'x = (-b ± √(b²-4ac)) / 2a' },
      { front: 'Slope formula', back: 'm = (y2 - y1) / (x2 - x1)' },
      { front: 'Distance formula', back: 'd = √((x2-x1)² + (y2-y1)²)' },
    ]}},
    { data: { title: 'World History Highlights', author: 'Ngoms AI', views: '450', status: 'Active', cards: [
      { front: 'When did WW2 end?', back: '1945' },
      { front: 'Who was Nelson Mandela?', back: 'First Black president of South Africa' },
      { front: 'What was the Berlin Wall?', back: 'Wall dividing East and West Berlin (1961-1989)' },
    ]}},
  ],
  quizzes: [
    { data: { title: 'Python Basics Quiz', course: 'Introduction to Computer Science', difficulty: 'Easy', passRate: '75', attempts: '340', status: 'Active', questions: [
      { q: 'What is Python?', options: ['A snake', 'A programming language', 'A database', 'An OS'], answer: 1 },
      { q: 'What symbol starts a comment?', options: ['//', '/*', '#', '--'], answer: 2 },
      { q: 'How do you create a variable?', options: ['var x', 'x = value', 'let x', 'const x'], answer: 1 },
    ]}},
    { data: { title: 'Cell Biology Quiz', course: 'Biology: Human Body Systems', difficulty: 'Medium', passRate: '70', attempts: '210', status: 'Active', questions: [
      { q: 'Powerhouse of the cell?', options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Golgi'], answer: 2 },
      { q: 'What carries genetic info?', options: ['RNA', 'DNA', 'Protein', 'Lipid'], answer: 1 },
    ]}},
    { data: { title: 'Algebra Quiz', course: 'Mathematics for AI', difficulty: 'Hard', passRate: '60', attempts: '89', status: 'Active', questions: [
      { q: 'Solve: 2x + 5 = 15', options: ['x=3', 'x=5', 'x=7', 'x=10'], answer: 1 },
      { q: 'What is x² if x=4?', options: ['8', '12', '16', '20'], answer: 2 },
    ]}},
  ],
  plans: [
    { id: 'plan_free', data: { name: 'Free', price: '0', period: 'month', color: 'from-gray-500 to-gray-600', status: 'Active', features: ['5 AI queries per day', 'Access to free courses', 'Basic flashcards', 'Community access'], limits: { aiQueries: '5', courses: '3', flashcards: '20' } } },
    { id: 'plan_premium', data: { name: 'Premium', price: '15000', period: 'month', color: 'from-primary to-violet', status: 'Active', features: ['Unlimited AI tutoring', 'All courses unlocked', 'Unlimited flashcards', 'Quiz engine', 'Study planner', 'Analytics', 'Priority support'], limits: { aiQueries: 'unlimited', courses: 'all', flashcards: 'unlimited' } } },
    { id: 'plan_annual', data: { name: 'Annual Pro', price: '150000', period: 'year', color: 'from-amber-500 to-orange-500', status: 'Active', features: ['Everything in Premium', '2 months free', 'Exclusive content', 'Early feature access', 'API access', 'Dedicated support'], limits: { aiQueries: 'unlimited', courses: 'all', flashcards: 'unlimited' } } },
  ],
  badges: [
    { data: { name: 'First Steps', desc: 'Complete your first lesson', icon: '🎯', color: 'from-blue-500 to-primary', earners: '1240', status: 'Active' } },
    { data: { name: 'Quiz Master', desc: 'Pass 10 quizzes with 80%+', icon: '🧠', color: 'from-violet to-purple-500', earners: '456', status: 'Active' } },
    { data: { name: 'Streak Warrior', desc: '7-day study streak', icon: '🔥', color: 'from-amber-500 to-orange-500', earners: '320', status: 'Active' } },
    { data: { name: 'Flashcard Pro', desc: 'Master 100 flashcards', icon: '🎴', color: 'from-emerald-500 to-teal-500', earners: '189', status: 'Active' } },
    { data: { name: 'Night Owl', desc: 'Study after 10 PM 5 times', icon: '🦉', color: 'from-indigo-500 to-violet', earners: '67', status: 'Active' } },
    { data: { name: 'Scholar', desc: 'Complete a full course', icon: '🎓', color: 'from-pink-500 to-rose-500', earners: '234', status: 'Active' } },
  ],
  leaderboard: [
    { data: { name: 'Davie Kuminga', xp: '5420', rank: '1', avatar: 'D', badge: 'Scholar' } },
    { data: { name: 'Chisomo Banda', xp: '4890', rank: '2', avatar: 'C', badge: 'Quiz Master' } },
    { data: { name: 'Thandiwe Phiri', xp: '4230', rank: '3', avatar: 'T', badge: 'Streak Warrior' } },
    { data: { name: 'Kondwani Mvula', xp: '3780', rank: '4', avatar: 'K', badge: 'Flashcard Pro' } },
    { data: { name: 'Grace Mhango', xp: '3200', rank: '5', avatar: 'G', badge: 'First Steps' } },
    { data: { name: 'Yamikani Chirwa', xp: '2840', rank: '6', avatar: 'Y', badge: 'Night Owl' } },
    { data: { name: 'Latita Kumwenda', xp: '2310', rank: '7', avatar: 'L', badge: 'First Steps' } },
    { data: { name: 'Steven Nkhoma', xp: '1890', rank: '8', avatar: 'S', badge: 'First Steps' } },
    { data: { name: 'Patience Soko', xp: '1450', rank: '9', avatar: 'P', badge: 'First Steps' } },
    { data: { name: 'Brian Kazembe', xp: '980', rank: '10', avatar: 'B', badge: 'First Steps' } },
  ],
  faqs: [
    { data: { question: 'What is Ngoms AI?', answer: 'Ngoms AI is an AI-powered education platform designed to help students learn smarter through AI tutoring, flashcards, quizzes, and more.', category: 'General', status: 'Active' } },
    { data: { question: 'How much does it cost?', answer: 'Ngoms AI offers a free plan with limited features and a Premium plan at MWK 15,000/month or MWK 150,000/year for unlimited access.', category: 'Pricing', status: 'Active' } },
    { data: { question: 'Can I use Ngoms AI offline?', answer: 'Yes! The mobile app (APK) supports offline mode for flashcards and downloaded courses.', category: 'Features', status: 'Active' } },
    { data: { question: 'How do AI tutoring sessions work?', answer: 'Simply open the Chat Tutor, type your question, and our AI will provide a detailed explanation. Premium users get unlimited queries.', category: 'Features', status: 'Active' } },
    { data: { question: 'Is my data secure?', answer: 'Yes, all data is encrypted and stored securely using Firebase. We never share your data with third parties.', category: 'Privacy', status: 'Active' } },
    { data: { question: 'How do I cancel my subscription?', answer: 'Go to Settings > Subscription > Cancel. You will keep access until the end of your billing period.', category: 'Pricing', status: 'Active' } },
  ],
  testimonials: [
    { data: { name: 'Davie Kuminga', role: 'Computer Science Student', rating: '5', text: 'Ngoms AI completely changed how I study. The AI tutor explains things better than my professors sometimes!', status: 'Active' } },
    { data: { name: 'Chisomo Banda', role: 'High School Student', rating: '5', text: 'The flashcards are amazing. I went from failing biology to topping the class in 2 months.', status: 'Active' } },
    { data: { name: 'Thandiwe Phiri', role: 'University of Malawi', rating: '4', text: 'Love the study planner feature. Keeps me organized and the streak system keeps me motivated.', status: 'Active' } },
    { data: { name: 'Kondwani Mvula', role: 'Self-Learner', rating: '5', text: 'Best education app in Malawi. The phonk study music is a nice touch too!', status: 'Active' } },
  ],
  announcements: [
    { data: { title: 'Welcome to Ngoms AI!', body: 'Thank you for joining Ngoms AI. Explore our courses, flashcards, and AI tutoring features to start learning smarter today.', date: '2026-07-20', priority: 'high', status: 'Active' } },
    { data: { title: 'New: Premium Plan Available', body: 'Unlock unlimited AI tutoring, all courses, and advanced features with our Premium plan starting at MWK 15,000/month.', date: '2026-07-19', priority: 'medium', status: 'Active' } },
    { data: { title: 'Flashcard Studio Updated', body: 'We have added new flashcard decks for Python, Biology, and English Grammar. Check them out!', date: '2026-07-18', priority: 'low', status: 'Active' } },
  ],
  notifications: [
    { data: { title: 'Welcome to Ngoms AI!', body: 'Your learning journey starts here. Tap to explore courses.', date: '2026-07-20', type: 'welcome', sent: '1', status: 'sent' } },
    { data: { title: 'Study Streak: 7 days!', body: 'You are on fire! Keep your streak going by studying today.', date: '2026-07-20', type: 'streak', sent: '1', status: 'sent' } },
    { data: { title: 'New Flashcard Deck', body: 'Python Programming Basics is now available in Flashcard Studio.', date: '2026-07-19', type: 'content', sent: '1', status: 'sent' } },
  ],
  coupons: [
    { data: { code: 'WELCOME20', discount: '20', expiry: '2026-12-31', maxUses: '100', uses: '23', status: 'Active' } },
    { data: { code: 'STUDENT50', discount: '50', expiry: '2026-09-30', maxUses: '50', uses: '12', status: 'Active' } },
    { data: { code: 'MALAWI15', discount: '15', expiry: '2026-08-31', maxUses: '200', uses: '89', status: 'Active' } },
  ],
  documents: [
    { data: { title: 'Python Cheat Sheet', type: 'PDF', size: '2.4 MB', date: '2026-07-15', uploadedBy: 'Ngoms AI', status: 'Active', fileUrl: '' } },
    { data: { title: 'Biology Diagrams', type: 'PDF', size: '5.1 MB', date: '2026-07-10', uploadedBy: 'Ngoms AI', status: 'Active', fileUrl: '' } },
    { data: { title: 'Algebra Reference Card', type: 'PDF', size: '0.8 MB', date: '2026-07-05', uploadedBy: 'Ngoms AI', status: 'Active', fileUrl: '' } },
  ],
  system_logs: [
    { data: { action: 'Firestore database initialized', level: 'info', time: '2026-07-20 14:33:00', user: 'system' } },
    { data: { action: 'Seed data loaded', level: 'info', time: '2026-07-20 14:33:01', user: 'system' } },
  ],
}

export async function seedFirestore() {
  try {
    // Check if already seeded
    const settingsSnap = await getDocs(collection(db, 'app_settings'))
    if (settingsSnap.size > 0) {
      console.log('[Seed] Firestore already has data, skipping seed')
      return false
    }

    console.log('[Seed] Firestore is empty, seeding initial data...')

    for (const [colName, docs] of Object.entries(SEED_DATA)) {
      for (const item of docs) {
        try {
          if (item.id) {
            // Use setDoc with specific ID
            await setDoc(doc(db, colName, item.id), item.data)
          } else {
            // Use addDoc for auto-ID
            await addDoc(collection(db, colName), item.data)
          }
        } catch (e) {
          console.warn(`[Seed] Failed to write to ${colName}:`, e.message)
        }
      }
      console.log(`[Seed] ✓ ${colName} (${docs.length} docs)`)
    }

    console.log('[Seed] ✅ Firestore seeded successfully!')
    return true
  } catch (err) {
    console.error('[Seed] Error:', err.message)
    return false
  }
}

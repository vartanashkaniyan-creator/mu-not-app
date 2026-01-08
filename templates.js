// در بخش templates object، بعد از برنامه شماره 25 اضافه کن:

const languageLearningTemplate = {
    id: 'language_learner',
    name: 'آموزش زبان',
    category: 'education',
    icon: '📚',
    color: '#9C27B0',
    description: 'یادگیری زبان با فلش کارت، تمرین و تست',
    version: '1.0.0',
    
    // HTML Template
    template: `
        <div class="language-app">
            <!-- Header -->
            <div class="language-header">
                <h1 data-i18n="language.title">📚 آموزش زبان</h1>
                <div class="user-progress">
                    <div class="level">سطح: <span id="userLevel">مبتدی</span></div>
                    <div class="progress-bar">
                        <div class="progress-fill" id="progressFill" style="width: 30%"></div>
                    </div>
                    <div class="xp">امتیاز: <span id="userXP">150</span></div>
                </div>
            </div>

            <!-- Navigation -->
            <div class="language-nav">
                <button class="nav-btn active" onclick="showSection('flashcards')">
                    <i class="fas fa-layer-group"></i>
                    فلش کارت
                </button>
                <button class="nav-btn" onclick="showSection('quiz')">
                    <i class="fas fa-question-circle"></i>
                    تست
                </button>
                <button class="nav-btn" onclick="showSection('vocabulary')">
                    <i class="fas fa-book"></i>
                    لغات
                </button>
                <button class="nav-btn" onclick="showSection('practice')">
                    <i class="fas fa-microphone"></i>
                    تمرین
                </button>
            </div>

            <!-- Content Sections -->
            <div class="language-content">
                
                <!-- Flashcards Section -->
                <div class="section active" id="flashcards">
                    <div class="flashcard" onclick="flipCard()">
                        <div class="card-front">
                            <div class="card-word" id="cardWord">Hello</div>
                            <div class="card-hint">(برای مشاهده معنی کلیک کنید)</div>
                        </div>
                        <div class="card-back">
                            <div class="card-meaning" id="cardMeaning">سلام</div>
                            <div class="card-example" id="cardExample">Hello, how are you?</div>
                            <div class="card-pronunciation">
                                <i class="fas fa-volume-up" onclick="playPronunciation()"></i>
                                /həˈloʊ/
                            </div>
                        </div>
                    </div>
                    
                    <div class="flashcard-controls">
                        <button class="btn btn-outline" onclick="prevCard()">
                            <i class="fas fa-arrow-right"></i>
                            قبلی
                        </button>
                        <button class="btn" onclick="markAsLearned()">
                            <i class="fas fa-check"></i>
                            بلدم
                        </button>
                        <button class="btn btn-outline" onclick="nextCard()">
                            بعدی
                            <i class="fas fa-arrow-left"></i>
                        </button>
                    </div>
                    
                    <div class="stats">
                        <div class="stat">
                            <span class="stat-label">کارت‌های باقی‌مانده:</span>
                            <span class="stat-value" id="cardsLeft">25</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">یاد گرفته شده:</span>
                            <span class="stat-value" id="cardsLearned">75</span>
                        </div>
                    </div>
                </div>

                <!-- Quiz Section -->
                <div class="section" id="quiz">
                    <div class="quiz-question">
                        <h3 id="questionText">معنی کلمه "Book" چیست؟</h3>
                        <div class="question-progress">سوال ۵ از ۱۰</div>
                    </div>
                    
                    <div class="quiz-options">
                        <button class="option-btn" onclick="checkAnswer(1)">
                            <span class="option-letter">الف</span>
                            <span class="option-text" id="option1">کتاب</span>
                        </button>
                        <button class="option-btn" onclick="checkAnswer(2)">
                            <span class="option-letter">ب</span>
                            <span class="option-text" id="option2">قلم</span>
                        </button>
                        <button class="option-btn" onclick="checkAnswer(3)">
                            <span class="option-letter">ج</span>
                            <span class="option-text" id="option3">میز</span>
                        </button>
                        <button class="option-btn" onclick="checkAnswer(4)">
                            <span class="option-letter">د</span>
                            <span class="option-text" id="option4">صندلی</span>
                        </button>
                    </div>
                    
                    <div class="quiz-feedback" id="quizFeedback"></div>
                    
                    <div class="quiz-controls">
                        <button class="btn btn-outline" onclick="skipQuestion()">
                            رد کردن
                        </button>
                        <button class="btn" onclick="nextQuestion()" id="nextBtn" disabled>
                            بعدی
                            <i class="fas fa-arrow-left"></i>
                        </button>
                    </div>
                </div>

                <!-- Vocabulary Section -->
                <div class="section" id="vocabulary">
                    <div class="vocab-filters">
                        <select id="categoryFilter" onchange="filterVocabulary()">
                            <option value="all">همه دسته‌ها</option>
                            <option value="basic">مقدماتی</option>
                            <option value="food">غذا</option>
                            <option value="travel">سفر</option>
                            <option value="business">کسب‌وکار</option>
                        </select>
                        
                        <select id="levelFilter" onchange="filterVocabulary()">
                            <option value="all">همه سطوح</option>
                            <option value="a1">A1</option>
                            <option value="a2">A2</option>
                            <option value="b1">B1</option>
                            <option value="b2">B2</option>
                        </select>
                    </div>
                    
                    <div class="vocab-list" id="vocabList">
                        <!-- Vocabulary items will be loaded here -->
                    </div>
                    
                    <div class="vocab-actions">
                        <button class="btn btn-outline" onclick="exportVocabulary()">
                            <i class="fas fa-download"></i>
                            خروجی لغات
                        </button>
                        <button class="btn" onclick="addCustomWord()">
                            <i class="fas fa-plus"></i>
                            اضافه کردن لغت
                        </button>
                    </div>
                </div>

                <!-- Practice Section -->
                <div class="section" id="practice">
                    <div class="practice-exercise">
                        <h3>تمرین تلفظ</h3>
                        <div class="practice-word" id="practiceWord">Computer</div>
                        <div class="practice-pronunciation">/kəmˈpjuːtər/</div>
                        
                        <div class="recording-section">
                            <button class="btn-record" id="recordBtn" onclick="startRecording()">
                                <i class="fas fa-microphone"></i>
                                ضبط تلفظ
                            </button>
                            <div class="recording-status" id="recordingStatus">آماده</div>
                        </div>
                        
                        <div class="practice-feedback" id="practiceFeedback"></div>
                    </div>
                    
                    <div class="practice-tips">
                        <h4><i class="fas fa-lightbulb"></i> نکات تلفظ:</h4>
                        <ul>
                            <li>به استرس کلمات توجه کنید</li>
                            <li>حروف صدادار را کامل تلفظ کنید</li>
                            <li>با سرعت مناسب صحبت کنید</li>
                        </ul>
                    </div>
                </div>

            </div>

            <!-- Bottom Navigation -->
            <div class="language-bottom-nav">
                <button class="bottom-nav-btn" onclick="showStats()">
                    <i class="fas fa-chart-line"></i>
                    آمار
                </button>
                <button class="bottom-nav-btn" onclick="openSettings()">
                    <i class="fas fa-cog"></i>
                    تنظیمات
                </button>
                <button class="bottom-nav-btn" onclick="dailyChallenge()">
                    <i class="fas fa-trophy"></i>
                    چالش روزانه
                </button>
            </div>
        </div>
    `,
    
    // CSS Styles
    css: `
        .language-app {
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
            font-family: 'Vazir', Tahoma, sans-serif;
        }
        
        .language-header {
            text-align: center;
            margin-bottom: 20px;
            background: linear-gradient(135deg, #9C27B0, #673AB7);
            color: white;
            padding: 20px;
            border-radius: 15px;
        }
        
        .language-header h1 {
            margin: 0 0 15px 0;
            font-size: 24px;
        }
        
        .user-progress {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 15px;
        }
        
        .progress-bar {
            flex: 1;
            height: 10px;
            background: rgba(255,255,255,0.3);
            border-radius: 5px;
            overflow: hidden;
        }
        
        .progress-fill {
            height: 100%;
            background: #FFC107;
            transition: width 0.3s;
        }
        
        .language-nav {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            margin-bottom: 20px;
        }
        
        .nav-btn {
            padding: 12px;
            border: none;
            background: #f5f5f5;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s;
            font-size: 14px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 5px;
        }
        
        .nav-btn.active {
            background: #9C27B0;
            color: white;
        }
        
        .nav-btn i {
            font-size: 20px;
        }
        
        .section {
            display: none;
            animation: fadeIn 0.3s ease;
        }
        
        .section.active {
            display: block;
        }
        
        .flashcard {
            background: white;
            border-radius: 15px;
            padding: 30px;
            text-align: center;
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
            cursor: pointer;
            height: 250px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            margin-bottom: 20px;
            perspective: 1000px;
            transition: transform 0.6s;
            transform-style: preserve-3d;
        }
        
        .flashcard.flipped {
            transform: rotateY(180deg);
        }
        
        .card-front, .card-back {
            backface-visibility: hidden;
            position: absolute;
            width: 100%;
            padding: 20px;
        }
        
        .card-back {
            transform: rotateY(180deg);
        }
        
        .card-word {
            font-size: 36px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #333;
        }
        
        .card-meaning {
            font-size: 30px;
            color: #9C27B0;
            margin-bottom: 15px;
        }
        
        .card-example {
            font-size: 16px;
            color: #666;
            font-style: italic;
            margin-bottom: 15px;
            padding: 10px;
            background: #f9f9f9;
            border-radius: 8px;
        }
        
        .flashcard-controls {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin-bottom: 20px;
        }
        
        .stats {
            display: flex;
            justify-content: space-around;
            background: #f9f9f9;
            padding: 15px;
            border-radius: 10px;
        }
        
        .stat {
            text-align: center;
        }
        
        .stat-label {
            display: block;
            font-size: 12px;
            color: #666;
            margin-bottom: 5px;
        }
        
        .stat-value {
            font-size: 24px;
            font-weight: bold;
            color: #9C27B0;
        }
        
        .quiz-question {
            background: white;
            padding: 20px;
            border-radius: 15px;
            margin-bottom: 20px;
            box-shadow: 0 3px 10px rgba(0,0,0,0.1);
        }
        
        .quiz-options {
            display: grid;
            grid-template-columns: 1fr;
            gap: 10px;
            margin-bottom: 20px;
        }
        
        .option-btn {
            padding: 15px;
            border: 2px solid #e0e0e0;
            background: white;
            border-radius: 10px;
            cursor: pointer;
            text-align: right;
            display: flex;
            align-items: center;
            gap: 15px;
            transition: all 0.3s;
        }
        
        .option-btn:hover {
            border-color: #9C27B0;
        }
        
        .option-letter {
            width: 30px;
            height: 30px;
            background: #f0f0f0;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        }
        
        .quiz-feedback {
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 20px;
            display: none;
        }
        
        .quiz-feedback.correct {
            background: #E8F5E9;
            color: #2E7D32;
            display: block;
        }
        
        .quiz-feedback.incorrect {
            background: #FFEBEE;
            color: #C62828;
            display: block;
        }
        
        .vocab-filters {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
        }
        
        .vocab-filters select {
            flex: 1;
            padding: 10px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            background: white;
        }
        
        .vocab-list {
            max-height: 300px;
            overflow-y: auto;
            margin-bottom: 20px;
        }
        
        .vocab-item {
            padding: 15px;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .vocab-word {
            font-weight: bold;
            font-size: 18px;
        }
        
        .vocab-meaning {
            color: #666;
        }
        
        .practice-exercise {
            background: white;
            padding: 25px;
            border-radius: 15px;
            text-align: center;
            margin-bottom: 20px;
            box-shadow: 0 3px 10px rgba(0,0,0,0.1);
        }
        
        .practice-word {
            font-size: 32px;
            font-weight: bold;
            margin: 20px 0;
            color: #333;
        }
        
        .btn-record {
            padding: 15px 30px;
            background: #FF4081;
            color: white;
            border: none;
            border-radius: 25px;
            font-size: 16px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            margin: 20px auto;
        }
        
        .recording-status {
            padding: 10px;
            background: #f5f5f5;
            border-radius: 8px;
            margin-top: 10px;
        }
        
        .practice-tips {
            background: #E3F2FD;
            padding: 15px;
            border-radius: 10px;
            border-right: 4px solid #2196F3;
        }
        
        .language-bottom-nav {
            display: flex;
            justify-content: space-around;
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px solid #eee;
        }
        
        .bottom-nav-btn {
            padding: 10px;
            background: none;
            border: none;
            color: #666;
            cursor: pointer;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 5px;
            transition: color 0.3s;
        }
        
        .bottom-nav-btn:hover {
            color: #9C27B0;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .dark-theme .flashcard,
        .dark-theme .quiz-question,
        .dark-theme .practice-exercise {
            background: #2d2d2d;
            color: white;
        }
        
        .dark-theme .nav-btn {
            background: #333;
            color: #ccc;
        }
        
        .dark-theme .option-btn {
            background: #333;
            border-color: #444;
            color: #ccc;
        }
    `,
    
    // JavaScript Logic
    script: `
        // Language Learning App Logic
        let currentSection = 'flashcards';
        let currentCard = 0;
        let userData = {
            level: 'مبتدی',
            xp: 150,
            cardsLearned: 75,
            cardsTotal: 100
        };
        
        // Sample vocabulary data
        const vocabulary = [
            { word: 'Hello', meaning: 'سلام', example: 'Hello, how are you?', pronunciation: '/həˈloʊ/', category: 'basic', level: 'a1' },
            { word: 'Book', meaning: 'کتاب', example: 'I read a book every week.', pronunciation: '/bʊk/', category: 'basic', level: 'a1' },
            { word: 'Computer', meaning: 'کامپیوتر', example: 'I work on my computer.', pronunciation: '/kəmˈpjuːtər/', category: 'basic', level: 'a1' },
            { word: 'Water', meaning: 'آب', example: 'Drink plenty of water.', pronunciation: '/ˈwɔːtər/', category: 'basic', level: 'a1' },
            { word: 'Friend', meaning: 'دوست', example: 'She is my best friend.', pronunciation: '/frend/', category: 'basic', level: 'a1' }
        ];
        
        // Quiz questions
        const quizQuestions = [
            {
                question: 'معنی کلمه "Book" چیست؟',
                options: ['کتاب', 'قلم', 'میز', 'صندلی'],
                correct: 1
            },
            {
                question: 'مترادف "Happy" کدام است؟',
                options: ['ناراحت', 'خوشحال', 'عصبانی', 'خسته'],
                correct: 2
            }
        ];
        
        // Initialize app
        function initLanguageApp() {
            updateUserStats();
            showSection('flashcards');
            loadFlashcard();
            loadVocabulary();
            
            // Load from storage if available
            const savedData = localStorage.getItem('languageAppData');
            if (savedData) {
                const data = JSON.parse(savedData);
                userData = { ...userData, ...data };
                updateUserStats();
            }
        }
        
        // Show section
        function showSection(sectionId) {
            // Hide all sections
            document.querySelectorAll('.section').forEach(section => {
                section.classList.remove('active');
            });
            
            // Remove active class from all nav buttons
            document.querySelectorAll('.nav-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Show selected section
            document.getElementById(sectionId).classList.add('active');
            
            // Activate corresponding nav button
            document.querySelectorAll('.nav-btn').forEach(btn => {
                if (btn.textContent.includes(getSectionName(sectionId))) {
                    btn.classList.add('active');
                }
            });
            
            currentSection = sectionId;
        }
        
        function getSectionName(id) {
            const names = {
                'flashcards': 'فلش کارت',
                'quiz': 'تست',
                'vocabulary': 'لغات',
                'practice': 'تمرین'
            };
            return names[id] || id;
        }
        
        // Flashcard functions
        function loadFlashcard() {
            const card = vocabulary[currentCard];
            if (!card) return;
            
            document.getElementById('cardWord').textContent = card.word;
            document.getElementById('cardMeaning').textContent = card.meaning;
            document.getElementById('cardExample').textContent = card.example;
            
            // Update card counter
            document.getElementById('cardsLeft').textContent = vocabulary.length - currentCard;
            document.getElementById('cardsLearned').textContent = userData.cardsLearned;
        }
        
        function flipCard() {
            const card = document.querySelector('.flashcard');
            card.classList.toggle('flipped');
        }
        
        function nextCard() {
            currentCard = (currentCard + 1) % vocabulary.length;
            const card = document.querySelector('.flashcard');
            card.classList.remove('flipped');
            setTimeout(loadFlashcard, 300);
        }
        
        function prevCard() {
            currentCard = currentCard === 0 ? vocabulary.length - 1 : currentCard - 1;
            const card = document.querySelector('.flashcard');
            card.classList.remove('flipped');
            setTimeout(loadFlashcard, 300);
        }
        
        function markAsLearned() {
            userData.cardsLearned++;
            userData.xp += 10;
            
            if (userData.cardsLearned >= 50) userData.level = 'متوسط';
            if (userData.cardsLearned >= 80) userData.level = 'پیشرفته';
            
            updateUserStats();
            saveData();
            nextCard();
            
            // Show success message
            showMessage('آفرین! این کلمه را یاد گرفتید', 'success');
        }
        
        // Quiz functions
        function loadQuestion(questionIndex) {
            const question = quizQuestions[questionIndex];
            if (!question) return;
            
            document.getElementById('questionText').textContent = question.question;
            document.getElementById('option1').textContent = question.options[0];
            document.getElementById('option2').textContent = question.options[1];
            document.getElementById('option3').textContent = question.options[2];
            document.getElementById('option4').textContent = question.options[3];
            
            // Reset feedback
            document.getElementById('quizFeedback').className = '';
            document.getElementById('quizFeedback').textContent = '';
            document.getElementById('nextBtn').disabled = true;
        }
        
        function checkAnswer(optionNumber) {
            const feedback = document.getElementById('quizFeedback');
            const nextBtn = document.getElementById('nextBtn');
            
            if (optionNumber === quizQuestions[0].correct) {
                feedback.textContent = 'آفرین! پاسخ صحیح است';
                feedback.className = 'quiz-feedback correct';
                userData.xp += 20;
            } else {
                feedback.textContent = 'پاسخ صحیح: گزینه ' + quizQuestions[0].correct;
                feedback.className = 'quiz-feedback incorrect';
            }
            
            nextBtn.disabled = false;
            updateUserStats();
            saveData();
        }
        
        function nextQuestion() {
            // Load next question (simplified)
            loadQuestion(0); // In real app, track current question
        }
        
        function skipQuestion() {
            nextQuestion();
        }
        
        // Vocabulary functions
        function loadVocabulary() {
            const vocabList = document.getElementById('vocabList');
            vocabList.innerHTML = '';
            
            vocabulary.forEach((word, index) => {
                const item = document.createElement('div');
                item.className = 'vocab-item';
                item.innerHTML = \`
                    <div>
                        <div class="vocab-word">\${word.word}</div>
                        <div class="vocab-meaning">\${word.meaning}</div>
                    </div>
                    <div>
                        <span class="vocab-level">\${word.level.toUpperCase()}</span>
                    </div>
                \`;
                vocabList.appendChild(item);
            });
        }
        
        function filterVocabulary() {
            const category = document.getElementById('categoryFilter').value;
            const level = document.getElementById('levelFilter').value;
            
            // In real app, filter vocabulary based on selections
            console.log('Filtering by:', category, level);
        }
        
        function exportVocabulary() {
            const json = JSON.stringify(vocabulary, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = 'vocabulary.json';
            a.click();
            
            URL.revokeObjectURL(url);
            showMessage('لغات با موفقیت صادر شدند', 'success');
        }
        
        function addCustomWord() {
            const word = prompt('لغت جدید را وارد کنید:');
            if (word) {
                const meaning = prompt('معنی را وارد کنید:');
                if (meaning) {
                    vocabulary.unshift({
                        word: word,
                        meaning: meaning,
                        example: '',
                        pronunciation: '',
                        category: 'custom',
                        level: 'custom'
                    });
                    loadVocabulary();
                    showMessage('لغت جدید اضافه شد', 'success');
                }
            }
        }
        
        // Practice functions
        function startRecording() {
            const recordBtn = document.getElementById('recordBtn');
            const status = document.getElementById('recordingStatus');
            
            recordBtn.innerHTML = '<i class="fas fa-stop"></i> توقف ضبط';
            recordBtn.onclick = stopRecording;
            status.textContent = 'در حال ضبط...';
            status.style.color = '#FF4081';
        }
        
        function stopRecording() {
            const recordBtn = document.getElementById('recordBtn');
            const status = document.getElementById('recordingStatus');
            const feedback = document.getElementById('practiceFeedback');
            
            recordBtn.innerHTML = '<i class="fas fa-microphone"></i> ضبط تلفظ';
            recordBtn.onclick = startRecording;
            status.textContent = 'ضبط شد';
            status.style.color = '#4CAF50';
            
            // Simulate feedback
            feedback.textContent = 'تلفظ خوبی بود! کمی روی استرس کلمه کار کنید.';
            feedback.style.color = '#4CAF50';
            
            userData.xp += 15;
            updateUserStats();
            saveData();
        }
        
        function playPronunciation() {
            const word = vocabulary[currentCard]?.word;
            if (!word) return;
            
            // Use Web Speech API if available
            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(word);
                utterance.lang = 'en-US';
                utterance.rate = 0.8;
                speechSynthesis.speak(utterance);
            } else {
                alert('مرورگر شما از پخش صدا پشتیبانی نمی‌کند');
            }
        }
        
        // User stats
        function updateUserStats() {
            document.getElementById('userLevel').textContent = userData.level;
            document.getElementById('userXP').textContent = userData.xp;
            
            const progress = (userData.cardsLearned / userData.cardsTotal) * 100;
            document.getElementById('progressFill').style.width = progress + '%';
        }
        
        function showStats() {
            const stats = \`
                <div style="text-align: center; padding: 20px;">
                    <h3>📊 آمار یادگیری</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0;">
                        <div style="background: #E8F5E9; padding: 15px; border-radius: 10px;">
                            <div style="font-size: 12px; color: #666;">سطح</div>
                            <div style="font-size: 24px; font-weight: bold;">\${userData.level}</div>
                        </div>
                        <div style="background: #E3F2FD; padding: 15px; border-radius: 10px;">
                            <div style="font-size: 12px; color: #666;">امتیاز</div>
                            <div style="font-size: 24px; font-weight: bold;">\${userData.xp}</div>
                        </div>
                        <div style="background: #FFF3E0; padding: 15px; border-radius: 10px;">
                            <div style="font-size: 12px; color: #666;">لغات یادگرفته</div>
                            <div style="font-size: 24px; font-weight: bold;">\${userData.cardsLearned}</div>
                        </div>
                        <div style="background: #F3E5F5; padding: 15px; border-radius: 10px;">
                            <div style="font-size: 12px; color: #666;">درصد پیشرفت</div>
                            <div style="font-size: 24px; font-weight: bold;">\${Math.round((userData.cardsLearned / userData.cardsTotal) * 100)}%</div>
                        </div>
                    </div>
                    <button onclick="AP.ui.modal.hide()" style="padding: 10px 20px; background: #9C27B0; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        بستن
                    </button>
                </div>
            \`;
            
            AP.ui.modal.show({
                title: 'آمار یادگیری',
                content: stats,
                size: 'md'
            });
        }
        
        function openSettings() {
            const settings = \`
                <div style="padding: 20px;">
                    <h4 style="margin-bottom: 15px;">تنظیمات آموزش زبان</h4>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px;">تعداد کارت‌های روزانه:</label>
                        <select style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 5px;">
                            <option>10</option>
                            <option selected>20</option>
                            <option>30</option>
                            <option>50</option>
                        </select>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px;">زبان مقصد:</label>
                        <select style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 5px;">
                            <option selected>انگلیسی</option>
                            <option>فرانسوی</option>
                            <option>آلمانی</option>
                            <option>عربی</option>
                        </select>
                    </div>
                    <div style="margin-bottom: 20px;">
                        <label>
                            <input type="checkbox" checked>
                            فعال‌سازی یادآوری روزانه
                        </label>
                    </div>
                    <button onclick="AP.ui.modal.hide()" style="width: 100%; padding: 12px; background: #9C27B0; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        ذخیره تنظیمات
                    </button>
                </div>
            \`;
            
            AP.ui.modal.show({
                title: 'تنظیمات',
                content: settings,
                size: 'sm'
            });
        }
        
        function dailyChallenge() {
            const challenge = \`
                <div style="text-align: center; padding: 20px;">
                    <h3 style="color: #FF9800;">🏆 چالش روزانه</h3>
                    <div style="font-size: 48px; margin: 20px 0;">10/15</div>
                    <p>تاکنون ۱۰ سوال از ۱۵ سوال امروز را پاسخ داده‌اید!</p>
                    <p style="font-size: 14px; color: #666; margin-top: 10px;">چالش امروز تا ۲ ساعت دیگر تمام می‌شود</p>
                    <button onclick="startDailyChallenge()" style="margin-top: 20px; padding: 12px 30px; background: #FF9800; color: white; border: none; border-radius: 25px; cursor: pointer; font-weight: bold;">
                        شروع چالش
                    </button>
                </div>
            \`;
            
            AP.ui.modal.show({
                title: 'چالش روزانه',
                content: challenge,
                size: 'sm'
            });
        }
        
        function startDailyChallenge() {
            showSection('quiz');
            AP.ui.modal.hide();
            showMessage('چالش روزانه شروع شد!', 'success');
        }
        
        // Utility functions
        function saveData() {
            localStorage.setItem('languageAppData', JSON.stringify(userData));
        }
        
        function showMessage(text, type = 'info') {
            AP.ui.toast(text, type);
        }
        
        // Initialize when page loads
        setTimeout(initLanguageApp, 100);
    `
};

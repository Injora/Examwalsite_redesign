const EXAM_DATA = [
      { id: 'upsc-prelims', name: 'UPSC CSE Prelims 2026', date: '2026-06-15', icon: '🏛️' },
      { id: 'upsc-mains', name: 'UPSC CSE Mains 2026', date: '2026-09-19', icon: '🏛️' },
      { id: 'ssc-cgl', name: 'SSC CGL Tier 1 2026', date: '2026-07-14', icon: '📋' },
      { id: 'ssc-chsl', name: 'SSC CHSL 2026', date: '2026-06-28', icon: '📋' },
      { id: 'sbi-po', name: 'SBI PO Prelims 2026', date: '2026-05-17', icon: '🏦' },
      { id: 'ibps-po', name: 'IBPS PO Prelims 2026', date: '2026-10-11', icon: '🏦' },
      { id: 'ibps-clerk', name: 'IBPS Clerk Prelims 2026', date: '2026-09-06', icon: '🏦' },
      { id: 'nda-1', name: 'NDA I 2026', date: '2026-04-27', icon: '⚔️' },
      { id: 'nda-2', name: 'NDA II 2026', date: '2026-09-14', icon: '⚔️' },
      { id: 'railway-ntpc', name: 'Railway NTPC CBT 1 2026', date: '2026-08-20', icon: '🚂' },
      { id: 'railway-groupd', name: 'Railway Group D 2026', date: '2026-07-25', icon: '🚂' },
      { id: 'cds-1', name: 'CDS I 2026', date: '2026-04-20', icon: '⚔️' },
      { id: 'cuet', name: 'CUET UG 2026', date: '2026-05-10', icon: '🎓' },
      { id: 'neet', name: 'NEET UG 2026', date: '2026-05-04', icon: '🩺' },
      { id: 'jee-main', name: 'JEE Main 2026 (Session 2)', date: '2026-04-23', icon: '⚡' },
      { id: 'cat', name: 'CAT 2026', date: '2026-11-29', icon: '📊' },
    ];
    let selectedExams = JSON.parse(localStorage.getItem('ews_countdown_exams') || '[]');
    function saveSelections() {
      localStorage.setItem('ews_countdown_exams', JSON.stringify(selectedExams));
    }
    function formatDate(dateStr) {
      const d = new Date(dateStr + 'T00:00:00');
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    }
    function getCountdown(dateStr) {
      const now = new Date();
      const target = new Date(dateStr + 'T00:00:00');
      const diff = target - now;
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0, passed: true };
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      return { days, hours, minutes, seconds, total: diff, passed: false };
    }
    function getUrgencyClass(countdown) {
      if (countdown.passed) return 'past-exam';
      if (countdown.days <= 7) return 'urgency-danger';
      if (countdown.days <= 30) return 'urgency-warn';
      return 'urgency-safe';
    }
    function getUrgencyLabel(countdown) {
      if (countdown.passed) return 'Exam date has passed';
      const d = countdown.days;
      if (d <= 7) return `Only ${d} day${d !== 1 ? 's' : ''} left — crunch time!`;
      if (d <= 15) return `${d} days left — final sprint`;
      if (d <= 30) return `${d} days left — stay focused`;
      if (d <= 60) return `${d} days left — keep the momentum`;
      return `${d} days left — you've got this`;
    }
    function renderChips() {
      const container = document.getElementById('examSelector');
      container.innerHTML = EXAM_DATA.map(exam => {
        const isSelected = selectedExams.includes(exam.id);
        return `<button class="exam-chip${isSelected ? ' selected' : ''}" data-exam-id="${exam.id}"><span class="chip-dot"></span>${exam.icon} ${exam.name}</button>`;
      }).join('');
      container.querySelectorAll('.exam-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          const examId = chip.dataset.examId;
          if (selectedExams.includes(examId)) {
            selectedExams = selectedExams.filter(id => id !== examId);
            chip.classList.remove('selected');
          } else {
            selectedExams.push(examId);
            chip.classList.add('selected');
          }
          saveSelections();
          renderCountdowns();
          checkFinalStretchMode();
        });
      });
    }
    function renderCountdowns() {
      const grid = document.getElementById('countdownsGrid');
      const empty = document.getElementById('countdownEmpty');
      if (selectedExams.length === 0) { empty.style.display = 'block'; grid.style.display = 'none'; return; }
      empty.style.display = 'none';
      grid.style.display = 'grid';
      const selected = selectedExams.map(id => EXAM_DATA.find(e => e.id === id)).filter(Boolean).sort((a, b) => new Date(a.date) - new Date(b.date));
      grid.innerHTML = selected.map(exam => {
        const cd = getCountdown(exam.date);
        const urgency = getUrgencyClass(cd);
        const finalWeekMsg = cd.days <= 7 && !cd.passed ? '<div class="final-week-warning">⚠️ Final week — focus only on revision and mock tests</div>' : '';
        return `
      <div class="countdown-card ${urgency}" data-exam-id="${exam.id}">
        <div class="card-glow"></div>
        <div class="countdown-card-header">
          <div>
            <div class="countdown-exam-name">${exam.icon} ${exam.name}</div>
            <div class="countdown-exam-date">📅 ${formatDate(exam.date)}</div>
          </div>
          <button class="countdown-remove" data-remove="${exam.id}" title="Remove">✕</button>
        </div>
        <div class="countdown-digits">
          <div class="digit-unit"><div class="digit-value" data-field="days">${String(cd.days).padStart(2, '0')}</div><div class="digit-label">Days</div></div>
          <div class="digit-unit"><div class="digit-value" data-field="hours">${String(cd.hours).padStart(2, '0')}</div><div class="digit-label">Hours</div></div>
          <div class="digit-unit"><div class="digit-value" data-field="minutes">${String(cd.minutes).padStart(2, '0')}</div><div class="digit-label">Mins</div></div>
          <div class="digit-unit"><div class="digit-value" data-field="seconds">${String(cd.seconds).padStart(2, '0')}</div><div class="digit-label">Secs</div></div>
        </div>
        <div class="countdown-urgency-tag"><span class="urgency-dot"></span> ${getUrgencyLabel(cd)}</div>
        ${finalWeekMsg}
      </div>`;
      }).join('');
      grid.querySelectorAll('.countdown-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const examId = btn.dataset.remove;
          selectedExams = selectedExams.filter(id => id !== examId);
          saveSelections();
          const chip = document.querySelector(`.exam-chip[data-exam-id="${examId}"]`);
          if (chip) chip.classList.remove('selected');
          renderCountdowns();
          checkFinalStretchMode();
        });
      });
    }
    function tickCountdowns() {
      document.querySelectorAll('.countdown-card[data-exam-id]').forEach(card => {
        const exam = EXAM_DATA.find(e => e.id === card.dataset.examId);
        if (!exam) return;
        const cd = getCountdown(exam.date);
        const urgency = getUrgencyClass(cd);
        card.querySelector('[data-field="days"]').textContent = String(cd.days).padStart(2, '0');
        card.querySelector('[data-field="hours"]').textContent = String(cd.hours).padStart(2, '0');
        card.querySelector('[data-field="minutes"]').textContent = String(cd.minutes).padStart(2, '0');
        card.querySelector('[data-field="seconds"]').textContent = String(cd.seconds).padStart(2, '0');
        card.classList.remove('urgency-safe', 'urgency-warn', 'urgency-danger', 'past-exam');
        card.classList.add(urgency);
        const tag = card.querySelector('.countdown-urgency-tag');
        if (tag) tag.innerHTML = `<span class="urgency-dot"></span> ${getUrgencyLabel(cd)}`;
      });
    }
    renderChips();
    renderCountdowns();
    setInterval(tickCountdowns, 1000);
    const STREAK_KEY = 'ews_streak';
    function getToday() { return new Date().toISOString().split('T')[0]; }
    function loadStreak() {
      const raw = localStorage.getItem(STREAK_KEY);
      if (!raw) return { lastDate: null, count: 0, tasksToday: 0 };
      return JSON.parse(raw);
    }
    function saveStreak(data) { localStorage.setItem(STREAK_KEY, JSON.stringify(data)); }
    function updateStreak() {
      const today = getToday();
      let streak = loadStreak();
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      if (streak.lastDate === today) {
      } else if (streak.lastDate === yesterday) {
        streak.count++;
        streak.lastDate = today;
        streak.tasksToday = 0;
        const badge = document.getElementById('streakBadge');
        badge.classList.add('streak-glow');
        setTimeout(() => badge.classList.remove('streak-glow'), 800);
      } else {
        streak.count = 1;
        streak.lastDate = today;
        streak.tasksToday = 0;
      }
      saveStreak(streak);
      renderStreak(streak);
    }
    function incrementStreakTask() {
      const streak = loadStreak();
      const today = getToday();
      if (streak.lastDate !== today) {
        streak.lastDate = today;
        streak.count = streak.count > 0 ? streak.count : 1;
      }
      streak.tasksToday = (streak.tasksToday || 0) + 1;
      saveStreak(streak);
      renderStreak(streak);
    }
    function renderStreak(streak) {
      document.getElementById('streakCount').textContent = `Day ${streak.count}`;
      const nearestExam = getMinDaysLeft();
      const meta = nearestExam > 0 ? `· ${nearestExam}d to exam` : '';
      document.getElementById('streakMeta').textContent = meta;
    }
    function getMinDaysLeft() {
      const selected = selectedExams.map(id => EXAM_DATA.find(e => e.id === id)).filter(Boolean);
      if (selected.length === 0) return 0;
      const daysArr = selected.map(e => getCountdown(e.date).days).filter(d => d > 0);
      return daysArr.length ? Math.min(...daysArr) : 0;
    }
    updateStreak();
    const SYLLABUS_KEY = 'ews_syllabus';
    const SYLLABUS_DATA = [
      {
        id: 'quant', name: 'Quantitative Aptitude', icon: '🔢', color: 'var(--accent)',
        topics: ['Number System', 'Percentage', 'Profit & Loss', 'Simple & Compound Interest', 'Ratio & Proportion', 'Time & Work', 'Speed, Distance & Time', 'Algebra', 'Geometry', 'Trigonometry', 'Data Interpretation', 'Averages & Mixtures']
      },
      {
        id: 'english', name: 'English Language', icon: '📖', color: 'var(--accent3)',
        topics: ['Reading Comprehension', 'Cloze Test', 'Error Spotting', 'Sentence Improvement', 'Fill in the Blanks', 'Para Jumbles', 'Vocabulary & Synonyms', 'Idioms & Phrases', 'One Word Substitution']
      },
      {
        id: 'gk', name: 'General Knowledge', icon: '🌍', color: 'var(--accent4)',
        topics: ['Indian History', 'Geography', 'Indian Polity', 'Economics', 'Science & Technology', 'Current Affairs', 'Art & Culture', 'Environment', 'Sports']
      },
      {
        id: 'reasoning', name: 'Reasoning & Logic', icon: '🧩', color: 'var(--accent2)',
        topics: ['Coding-Decoding', 'Blood Relations', 'Syllogism', 'Seating Arrangement', 'Puzzles', 'Direction Sense', 'Order & Ranking', 'Inequality', 'Input-Output', 'Data Sufficiency']
      },
    ];
    function loadSyllabus() {
      const raw = localStorage.getItem(SYLLABUS_KEY);
      if (raw) return JSON.parse(raw);
      const init = {};
      SYLLABUS_DATA.forEach(s => { init[s.id] = s.topics.map(() => false); });
      return init;
    }
    function saveSyllabus(data) { localStorage.setItem(SYLLABUS_KEY, JSON.stringify(data)); }
    function renderSyllabus() {
      const state = loadSyllabus();
      const topicTimestamps = loadTopicTimestamps();
      const grid = document.getElementById('syllabusGrid');
      const now = Date.now();
      const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
      grid.innerHTML = SYLLABUS_DATA.map(subject => {
        const completed = state[subject.id] || subject.topics.map(() => false);
        const doneCount = completed.filter(Boolean).length;
        const pct = Math.round((doneCount / subject.topics.length) * 100);
        const topicItems = subject.topics.map((topic, i) => {
          const isDone = completed[i];
          const topicKey = `${subject.id}::${topic}`;
          const lastTouch = topicTimestamps[topicKey];
          const needsRevision = isDone && lastTouch && (now - lastTouch > SEVEN_DAYS);
          return `<div class="syllabus-topic-item ${isDone ? 'completed' : ''}" data-subject="${subject.id}" data-index="${i}" data-topic-key="${topicKey}">
        <div class="topic-checkbox">${isDone ? '✓' : ''}</div>
        <span class="topic-name">${topic}</span>
        ${needsRevision ? '<span class="topic-revision-badge">⚠️ Due for revision</span>' : ''}
      </div>`;
        }).join('');
        return `<div class="syllabus-card reveal">
      <div class="syllabus-card-header">
        <div class="syllabus-subject-name">${subject.icon} ${subject.name}</div>
        <div class="syllabus-pct">${pct}%</div>
      </div>
      <div class="syllabus-progress-bar"><div class="syllabus-progress-fill" style="width:${pct}%"></div></div>
      <div class="syllabus-topic-count">${doneCount} / ${subject.topics.length} topics completed</div>
      <button class="syllabus-toggle" data-subject="${subject.id}">Show Topics ▾</button>
      <div class="syllabus-topics" id="topics-${subject.id}">${topicItems}</div>
    </div>`;
      }).join('');
      grid.querySelectorAll('.syllabus-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
          const list = document.getElementById('topics-' + btn.dataset.subject);
          list.classList.toggle('open');
          btn.textContent = list.classList.contains('open') ? 'Hide Topics ▴' : 'Show Topics ▾';
        });
      });
      grid.querySelectorAll('.syllabus-topic-item').forEach(item => {
        item.addEventListener('click', () => {
          const subj = item.dataset.subject;
          const idx = parseInt(item.dataset.index);
          const topicKey = item.dataset.topicKey;
          const st = loadSyllabus();
          st[subj][idx] = !st[subj][idx];
          saveSyllabus(st);
          const ts = loadTopicTimestamps();
          ts[topicKey] = Date.now();
          saveTopicTimestamps(ts);
          if (st[subj][idx]) incrementStreakTask();
          renderSyllabus();
          renderRevisionQueue();
        });
      });
      grid.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }
    const TOPIC_TS_KEY = 'ews_topic_timestamps';
    function loadTopicTimestamps() {
      const raw = localStorage.getItem(TOPIC_TS_KEY);
      return raw ? JSON.parse(raw) : {};
    }
    function saveTopicTimestamps(data) { localStorage.setItem(TOPIC_TS_KEY, JSON.stringify(data)); }
    function renderRevisionQueue() {
      const state = loadSyllabus();
      const ts = loadTopicTimestamps();
      const now = Date.now();
      const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
      const revisionItems = [];
      SYLLABUS_DATA.forEach(subject => {
        const completed = state[subject.id] || [];
        subject.topics.forEach((topic, i) => {
          if (!completed[i]) return;
          const key = `${subject.id}::${topic}`;
          const lastTouch = ts[key];
          if (lastTouch && (now - lastTouch > SEVEN_DAYS)) {
            const daysAgo = Math.floor((now - lastTouch) / 86400000);
            revisionItems.push({ subject: subject.name, icon: subject.icon, topic, daysAgo, key });
          }
        });
      });
      const container = document.getElementById('revisionList');
      if (revisionItems.length === 0) {
        container.innerHTML = '<div class="revision-empty">All topics are up to date! Keep it up. 🎉</div>';
        return;
      }
      revisionItems.sort((a, b) => b.daysAgo - a.daysAgo);
      container.innerHTML = revisionItems.map(item =>
        `<div class="revision-item" data-key="${item.key}">
      <span>${item.icon}</span>
      <span>${item.topic}</span>
      <span class="revision-tag">⚠️ Needs Revision</span>
      <span class="revision-elapsed">${item.daysAgo}d ago</span>
    </div>`
      ).join('');
      container.querySelectorAll('.revision-item').forEach(item => {
        item.addEventListener('click', () => {
          const ts2 = loadTopicTimestamps();
          ts2[item.dataset.key] = Date.now();
          saveTopicTimestamps(ts2);
          renderRevisionQueue();
          renderSyllabus();
        });
      });
    }
    const MOCK_SCORES_KEY = 'ews_mock_scores';
    function loadMockScores() {
      const raw = localStorage.getItem(MOCK_SCORES_KEY);
      return raw ? JSON.parse(raw) : [62, 71, 58, 75, 80, 68, 84]; 
    }
    function saveMockScores(scores) { localStorage.setItem(MOCK_SCORES_KEY, JSON.stringify(scores)); }
    function drawMockChart() {
      const canvas = document.getElementById('mockChartCanvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      const W = rect.width, H = rect.height;
      ctx.clearRect(0, 0, W, H);
      const scores = loadMockScores().slice(-10);
      if (scores.length < 2) {
        ctx.fillStyle = '#8888aa';
        ctx.font = '14px DM Sans, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Add at least 2 mock scores to see your trend', W / 2, H / 2);
        return;
      }
      const padX = 30, padY = 24;
      const chartW = W - padX * 2, chartH = H - padY * 2;
      const maxScore = 100, minScore = 0;
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 4; i++) {
        const y = padY + (chartH / 4) * i;
        ctx.beginPath(); ctx.moveTo(padX, y); ctx.lineTo(W - padX, y); ctx.stroke();
        ctx.fillStyle = '#555';
        ctx.font = '10px DM Sans';
        ctx.textAlign = 'right';
        ctx.fillText(Math.round(maxScore - (maxScore / 4) * i), padX - 6, y + 4);
      }
      const pts = scores.map((s, i) => ({
        x: padX + (i / (scores.length - 1)) * chartW,
        y: padY + chartH - ((s - minScore) / (maxScore - minScore)) * chartH
      }));
      const gradient = ctx.createLinearGradient(0, padY, 0, H - padY);
      gradient.addColorStop(0, 'rgba(108,99,255,0.25)');
      gradient.addColorStop(1, 'rgba(108,99,255,0)');
      ctx.beginPath();
      ctx.moveTo(pts[0].x, H - padY);
      pts.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.lineTo(pts[pts.length - 1].x, H - padY);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        const cx = (pts[i - 1].x + pts[i].x) / 2;
        ctx.bezierCurveTo(cx, pts[i - 1].y, cx, pts[i].y, pts[i].x, pts[i].y);
      }
      ctx.strokeStyle = '#6c63ff';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      pts.forEach((p, i) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = i === pts.length - 1 ? '#43e8a0' : '#6c63ff';
        ctx.fill();
        ctx.strokeStyle = 'var(--card)';
        ctx.lineWidth = 2;
        ctx.stroke();
        if (i === pts.length - 1) {
          ctx.fillStyle = '#43e8a0';
          ctx.font = 'bold 12px Syne, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(scores[i], p.x, p.y - 12);
        }
      });
      ctx.fillStyle = '#666';
      ctx.font = '10px DM Sans';
      ctx.textAlign = 'center';
      pts.forEach((p, i) => {
        ctx.fillText(`#${i + 1}`, p.x, H - 6);
      });
      const avg = Math.round(scores.reduce((a, b) => a + b) / scores.length);
      const best = Math.max(...scores);
      const trend = scores[scores.length - 1] - scores[scores.length - 2];
      const trendIcon = trend >= 0 ? '📈' : '📉';
      document.getElementById('mockAvgStat').innerHTML =
        `<span>Average: <strong>${avg}%</strong></span>
     <span>Best: <strong>${best}%</strong></span>
     <span>Trend: <strong>${trendIcon} ${trend >= 0 ? '+' : ''}${trend}%</strong></span>
     <span>Tests: <strong>${scores.length}</strong></span>`;
    }
    document.getElementById('mockAddBtn').addEventListener('click', () => {
      const input = document.getElementById('mockScoreInput');
      const val = parseInt(input.value);
      if (isNaN(val) || val < 0 || val > 100) { input.style.borderColor = 'var(--accent2)'; return; }
      input.style.borderColor = '';
      const scores = loadMockScores();
      scores.push(val);
      saveMockScores(scores);
      input.value = '';
      drawMockChart();
      incrementStreakTask();
    });
    window.addEventListener('resize', drawMockChart);
    setTimeout(drawMockChart, 100);
    function initPeerWidget() {
      const dayHash = new Date().getDate() + new Date().getMonth() * 31;
      const basePct = 15 + (dayHash * 7 % 25); 
      const pct = basePct;
      const displayPct = 100 - pct; 
      document.getElementById('peerPct').textContent = `${pct}%`;
      document.getElementById('peerHighlight').textContent = `Top ${pct}% this week`;
      document.querySelector('.peer-rank-circle').style.setProperty('--peer-pct', displayPct + '%');
      document.getElementById('peerClose').addEventListener('click', () => {
        document.getElementById('peerWidget').style.display = 'none';
      });
    }
    initPeerWidget();
    const SIM_QUESTIONS = [
      { q: 'The Preamble of the Indian Constitution was amended by which Constitutional Amendment Act?', options: ['42nd Amendment', '44th Amendment', '52nd Amendment', '61st Amendment'], correct: 0 },
      { q: 'Which Article of the Constitution deals with the abolition of untouchability?', options: ['Article 14', 'Article 15', 'Article 17', 'Article 19'], correct: 2 },
      { q: 'If the speed of a boat in still water is 12 km/hr and the speed of stream is 4 km/hr, what is the speed upstream?', options: ['16 km/hr', '8 km/hr', '12 km/hr', '4 km/hr'], correct: 1 },
      { q: 'Who was the first Governor-General of independent India?', options: ['Lord Mountbatten', 'C. Rajagopalachari', 'Jawaharlal Nehru', 'Dr. Rajendra Prasad'], correct: 0 },
      { q: 'Which planet is known as the "Morning Star"?', options: ['Mars', 'Jupiter', 'Venus', 'Mercury'], correct: 2 },
      { q: 'The Quit India Movement was launched in which year?', options: ['1940', '1942', '1944', '1946'], correct: 1 },
      { q: 'A train 150m long passes a pole in 15 seconds. What is the speed of the train?', options: ['36 km/hr', '10 km/hr', '25 km/hr', '30 km/hr'], correct: 0 },
      { q: 'Which of the following is NOT a Fundamental Right?', options: ['Right to Equality', 'Right to Property', 'Right to Freedom', 'Right against Exploitation'], correct: 1 },
      { q: 'The chemical formula of Baking Soda is:', options: ['NaCl', 'NaHCO₃', 'Na₂CO₃', 'CaCO₃'], correct: 1 },
      { q: 'If a:b = 3:4 and b:c = 5:6, then a:b:c is:', options: ['15:20:24', '3:4:6', '9:12:16', '15:20:18'], correct: 0 },
    ];
    let simState = { active: false, currentQ: 0, answers: new Array(SIM_QUESTIONS.length).fill(-1), timeLeft: 3600, timerId: null };
    document.getElementById('simTrigger').addEventListener('click', startSimulator);
    document.getElementById('simExitBtn').addEventListener('click', exitSimulator);
    function startSimulator() {
      simState = { active: true, currentQ: 0, answers: new Array(SIM_QUESTIONS.length).fill(-1), timeLeft: 3600, timerId: null };
      document.getElementById('simOverlay').classList.add('active');
      document.body.style.overflow = 'hidden';
      renderSimQuestion();
      simState.timerId = setInterval(tickSimTimer, 1000);
    }
    function exitSimulator() {
      if (!confirm('⚠️ Are you sure you want to exit? Your progress will be lost.')) return;
      closeSimulator();
    }
    function closeSimulator() {
      simState.active = false;
      clearInterval(simState.timerId);
      document.getElementById('simOverlay').classList.remove('active');
      document.body.style.overflow = '';
    }
    function tickSimTimer() {
      simState.timeLeft--;
      if (simState.timeLeft <= 0) {
        closeSimulator();
        alert('⏰ Time\'s up! Exam ended.');
        return;
      }
      const m = Math.floor(simState.timeLeft / 60);
      const s = simState.timeLeft % 60;
      const timerEl = document.getElementById('simTimer');
      timerEl.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
      timerEl.classList.toggle('warning', simState.timeLeft <= 300);
    }
    function renderSimQuestion() {
      const q = SIM_QUESTIONS[simState.currentQ];
      const card = document.getElementById('simQuestionCard');
      card.innerHTML = `
    <div class="sim-q-num">Question ${simState.currentQ + 1} of ${SIM_QUESTIONS.length}</div>
    <div class="sim-q-text">${q.q}</div>
    <div class="sim-options">
      ${q.options.map((opt, i) => `
        <div class="sim-option ${simState.answers[simState.currentQ] === i ? 'selected' : ''}" data-opt="${i}">
          <div class="sim-option-marker">${String.fromCharCode(65 + i)}</div>
          <span>${opt}</span>
        </div>
      `).join('')}
    </div>
    <div class="sim-nav">
      <button class="sim-nav-btn" ${simState.currentQ === 0 ? 'disabled' : ''} id="simPrev">← Previous</button>
      <button class="sim-nav-btn" id="simNext">${simState.currentQ === SIM_QUESTIONS.length - 1 ? 'Submit Exam' : 'Next →'}</button>
    </div>
  `;
      document.getElementById('simProgress').innerHTML = SIM_QUESTIONS.map((_, i) =>
        `<div class="sim-progress-dot ${i === simState.currentQ ? 'active' : ''} ${simState.answers[i] >= 0 ? 'answered' : ''}"></div>`
      ).join('');
      card.querySelectorAll('.sim-option').forEach(opt => {
        opt.addEventListener('click', () => {
          simState.answers[simState.currentQ] = parseInt(opt.dataset.opt);
          renderSimQuestion();
        });
      });
      document.getElementById('simPrev')?.addEventListener('click', () => {
        if (simState.currentQ > 0) { simState.currentQ--; renderSimQuestion(); }
      });
      document.getElementById('simNext')?.addEventListener('click', () => {
        if (simState.currentQ < SIM_QUESTIONS.length - 1) {
          simState.currentQ++;
          renderSimQuestion();
        } else {
          clearInterval(simState.timerId);
          const correct = simState.answers.filter((a, i) => a === SIM_QUESTIONS[i].correct).length;
          const score = Math.round((correct / SIM_QUESTIONS.length) * 100);
          alert(`📊 Exam Complete!\n\nScore: ${score}% (${correct}/${SIM_QUESTIONS.length} correct)\nTime used: ${Math.floor((3600 - simState.timeLeft) / 60)} minutes`);
          const scores = loadMockScores();
          scores.push(score);
          saveMockScores(scores);
          drawMockChart();
          closeSimulator();
        }
      });
    }
    function checkFinalStretchMode() {
      const selected = selectedExams.map(id => EXAM_DATA.find(e => e.id === id)).filter(Boolean);
      const hasUrgent = selected.some(e => {
        const cd = getCountdown(e.date);
        return !cd.passed && cd.days <= 10;
      });
      const banner = document.getElementById('finalStretchBanner');
      if (hasUrgent) {
        banner.classList.add('active');
      } else {
        banner.classList.remove('active');
        document.body.classList.remove('final-stretch-mode');
      }
    }
    document.getElementById('finalStretchBanner')?.addEventListener('click', (e) => {
      if (e.target.id === 'bannerClose') return;
      document.body.classList.toggle('final-stretch-mode');
    });
    document.getElementById('bannerClose')?.addEventListener('click', () => {
      document.getElementById('finalStretchBanner').classList.remove('active');
      document.body.classList.remove('final-stretch-mode');
    });
    checkFinalStretchMode();
    document.querySelectorAll('.plan-tasks .task').forEach(task => {
      task.removeAttribute('onclick');
      task.addEventListener('click', () => {
        task.classList.toggle('done');
        if (task.classList.contains('done')) {
          incrementStreakTask();
        }
        const allTasks = document.querySelectorAll('.plan-tasks .task');
        const doneTasks = document.querySelectorAll('.plan-tasks .task.done');
        const pct = Math.round((doneTasks.length / allTasks.length) * 100);
        const taskCountEl = task.closest('.plan-visual').querySelector('[style*="font-size:13px"][style*="color:var(--muted)"]');
        if (taskCountEl) taskCountEl.textContent = `${doneTasks.length} of ${allTasks.length} tasks done today`;
        const pctEl = task.closest('.plan-visual').querySelector('[style*="color:var(--accent3)"]');
        if (pctEl) pctEl.textContent = `${pct}% complete`;
        const bar = task.closest('.plan-visual').querySelector('.progress-bar-fill');
        if (bar) bar.style.width = pct + '%';
      });
    });
    document.getElementById('resourcesTabs')?.addEventListener('click', (e) => {
      if (!e.target.classList.contains('resources-tab')) return;
      const filter = e.target.dataset.filter;
      document.querySelectorAll('.resources-tab').forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');
      document.querySelectorAll('.resource-card').forEach(card => {
        if (filter === 'all') {
          card.classList.remove('hidden');
        } else {
          const tags = card.dataset.tags || '';
          card.classList.toggle('hidden', !tags.includes(filter));
        }
      });
    });
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('visible'), i * 80);
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    renderSyllabus();
    renderRevisionQueue();
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    document.querySelectorAll('.exam-enroll').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        btn.textContent = '✓ Enrolled!';
        btn.style.background = 'var(--accent3)';
        btn.style.color = '#000';
      });
    });
    document.querySelectorAll('.tag').forEach(tag => {
      tag.addEventListener('click', () => {
        document.querySelector('.search-bar input').value = tag.textContent;
      });
    });
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
      const scroll = window.scrollY + 100;
      sections.forEach(sec => {
        if (scroll >= sec.offsetTop && scroll < sec.offsetTop + sec.offsetHeight) {
          document.querySelectorAll('.nav-links a').forEach(a => {
            a.style.color = a.getAttribute('href') === '#' + sec.id ? 'var(--text)' : '';
          });
        }
      });
    });
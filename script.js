// 已填入您的 Google Apps Script Web App 部署 URL
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbzlo0feZG57o8F7D2Jj7mPSIX77KG3pjO79PXPgE5ek6K5OBzwI6YaE4_gavdLp_gQosQ/exec';

const wordBank = [
 { eng: "athlete", ch: "運動員(n.)" },
   { eng: "tough", ch: "艱難的(adj.)" },
  { eng: "survive", ch: "生存(v.)" },
  { eng: "search", ch: "搜尋(v.)" },
  { eng: "loose", ch: "寬鬆、不嚴謹的(adj.)" },
  { eng: "distance", ch: "距離(n.)" },
  { eng: "estimate", ch: "估計(v.)" },
  { eng: "pattern", ch: "模式(n.)" },
  { eng: "flexible", ch: "有彈性的(adj.)" },
  { eng: "arrange", ch: "安排(v.)" },
  { eng: "appointment", ch: "會面、預約(n.)" },
  { eng: "patiently", ch: "有耐心地(adv.)" },
  { eng: "take place", ch: "發生" },
  { eng: "beat the clock", ch: "趕時間" },
  { eng: "leave A for B", ch: "離開A前往B" },
  { eng: "culture", ch: "文化(n.)" },
  { eng: "tradition", ch: "傳統(n.)" },
  { eng: "different", ch: "不同的(adj.)" },
  { eng: "certain", ch: "特定的、肯定的(adj.)" },
  { eng: "as long as", ch: "只要" },
  { eng: "instead of", ch: "與其、反而" },
  { eng: "extreme", ch: "極端的(adj.)" },
  { eng: "show up", ch: "現身、出現" },
  { eng: "past", ch: "過了(prep.)" },
  { eng: "appointed", ch: "指定的(adj.)" },
  { eng: "even", ch: "甚至(adv.)" },
  { eng: "avoid", ch: "避免(v.) +Ving" },
 { eng: "situation", ch: "情況(n.)" },
 { eng: "instead", ch: "反而(adv.)" },
 { eng: "emphasis", ch: "強調的重點(n.) +on" },
 { eng: "during", ch: "在...期間(prep.)" },
 { eng: "machinery", ch: "機器設備(n.)" },
 { eng: "demand", ch: "強烈要求(v.)" },
 { eng: "punch in", ch: "打卡上班" },
 { eng: "tight", ch: "緊湊的(adj.)" },
 { eng: "schedule", ch: "行程(n.)" },
  { eng: "adopted", ch: "移居的、領養的(adj.)" },
   { eng: "junior", ch: "資歷較淺的(adj.)" },
   { eng: "contact", ch: "聯絡(v., n.)" },
   { eng: "punish", ch: "懲罰(v.)" },
   { eng: "punishment", ch: "懲罰(n.)" },
   { eng: "severely", ch: "嚴厲地(adv.)" },
   { eng: "severe", ch: "嚴厲的(adj.)" },
   { eng: "furious", ch: "暴怒的(adj.)" },
   { eng: "quit", ch: "離開、放棄、退出、戒掉(v.)" },
   { eng: "altogether", ch: "徹底地(adv.)" },
   { eng: "concept", ch: "概念(n.)" },
   { eng: "barely", ch: "幾乎不(adv.)" },
   { eng: "lose track of...", ch: "忘記..." },
   { eng: "run deep", ch: "深植內心" },
 {eng: "pursue", ch: "追求(v.)"},
  {eng: "strike", ch: "處於某種狀態(v.)"},
  {eng: "dumb", ch: "說不出話的(adj.)"},
  {eng: "sacrifice", ch: "犧牲(v., n.)"},
  {eng: "surgery", ch: "手術(n.)"},
  {eng: "restrict", ch: "限制(v.)"},
  {eng: "fatal", ch: "致命的(adj.)"},
  {eng: "operation", ch: "手術、運作(n.)"},
  {eng: "drill", ch: "鑽(孔、洞) (v.)"},
  {eng: "metal", ch: "金屬(n.)"},
  {eng: "gap", ch: "裂口、缺口(n.)"},
  {eng: "guarantee", ch: "保證、承諾(v., n.)"},
  {eng: "waist", ch: "腰(n.)"},
  {eng: "internal", ch: "內部的(adj.)"},
  {eng: "organ", ch: "器官(n.)"},
  {eng: "permanently", ch: "永久地(adv.)"},
  {eng: "accident", ch: "意外(n.)"},
  {eng: "unappealing", ch: "不吸引人的(adj.)"},
  {eng: "pale", ch: "蒼白的(adj.)"},
  {eng: "unpleasant", ch: "令人不悅的(adj.)"},
  {eng: "strengthen", ch: "增強(v.)"},
  {eng: "cheerful", ch: "高興的(adj.)"},
   {eng: "advantage", ch: "優勢、好處(n.)"},
  {eng: "measure", ch: "措施、方法(n.)"},
  {eng: "multiple", ch: "多個(adj.)"},
  {eng: "proper", ch: "適當的(adj.)"},
  {eng: "be dying to do sth.", ch: "非常渴望做某事"},
  {eng: "go to extremes", ch: "採取極端手段"},
  {eng: "come first", ch: "擺在首位、最為重要"},
  {eng: "in brief", ch: "簡言之"},
  {eng: "stick to sth.", ch: "維持(原訂)計畫、堅持某事"},
  {eng: "what's the use of doing sth.", ch: "做某事沒意義"}
];

let currentQueue = [];
let activeEng = [null, null, null, null, null];
let activeCh = [null, null, null, null, null];
let selectedEngSlot = null;
let selectedChSlot = null;
let startTime = 0;
let timerInterval = null;
let completedCount = 0;

// 追蹤答錯相關數據
let wrongCount = 0;
let wrongWordsSet = new Set();

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function initGame() {
  clearInterval(timerInterval);
  completedCount = 0;
  wrongCount = 0;
  wrongWordsSet.clear();
  selectedEngSlot = null;
  selectedChSlot = null;

  document.getElementById('progress').textContent = `0 / ${wordBank.length}`;
  document.getElementById('timer').textContent = '00:00';
  document.getElementById('result-modal').classList.add('hidden');

  const indexedWords = wordBank.map((item, index) => ({ ...item, id: index }));
  currentQueue = shuffle(indexedWords);

  // 初始化前 5 個單字
  const initialItems = [];
  for (let i = 0; i < 5 && currentQueue.length > 0; i++) {
    initialItems.push(currentQueue.pop());
  }

  activeEng = [...initialItems];
  activeCh = shuffle([...initialItems]);

  // 開局初始化不執行 fade out 動畫，直接渲染
  updateSlotContentsSmoothly(-1, false);

  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 1000);
}

function updateSlotContentsSmoothly(replacedEngIndex = -1, animate = true) {
  const engSlots = document.querySelectorAll('#english-column .slot');
  const chSlots = document.querySelectorAll('#chinese-column .slot');

  // 定義要觸發 fade 動畫的文字元素 (Span)
  let fadingSpans = [];

  if (animate) {
    // 右側全部中文均套用淡入淡出
    chSlots.forEach(slot => {
      const span = slot.querySelector('.slot-text');
      if (span) fadingSpans.push(span);
    });

    // 左側英文只針對「新替補位置」的文字套用淡入淡出
    if (replacedEngIndex !== -1 && engSlots[replacedEngIndex]) {
      const span = engSlots[replacedEngIndex].querySelector('.slot-text');
      if (span) fadingSpans.push(span);
    }
  }

  const updateTexts = () => {
    // 1. 更新左側英文 (維持原位，僅替換指定 Index)
    engSlots.forEach((slot, i) => {
      const span = slot.querySelector('.slot-text');
      if (activeEng[i]) {
        span.textContent = activeEng[i].eng;
        slot.dataset.id = activeEng[i].id;
        slot.style.visibility = 'visible';
      } else {
        slot.style.visibility = 'hidden';
        slot.dataset.id = '';
      }
      slot.classList.remove('selected', 'wrong');
    });

    // 2. 更新右側中文 (全新打亂後的順序)
    chSlots.forEach((slot, i) => {
      const span = slot.querySelector('.slot-text');
      if (activeCh[i]) {
        span.textContent = activeCh[i].ch;
        slot.dataset.id = activeCh[i].id;
        slot.style.visibility = 'visible';
      } else {
        slot.style.visibility = 'hidden';
        slot.dataset.id = '';
      }
      slot.classList.remove('selected', 'wrong');
    });

    // 文字替換後，移除透明度遮罩觸發 Fade In
    fadingSpans.forEach(span => span.classList.remove('text-fade-out'));
  };

  if (animate && fadingSpans.length > 0) {
    // 觸發 Fade Out
    fadingSpans.forEach(span => span.classList.add('text-fade-out'));
    // 等待 Fade Out 完成後更換文字，再 Fade In
    setTimeout(updateTexts, 600);
  } else {
    updateTexts();
  }
}

function updateTimer() {
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const minutes = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const seconds = String(elapsed % 60).padStart(2, '0');
  document.getElementById('timer').textContent = `${minutes}:${seconds}`;
}

function handleEngClick(e) {
  const slot = e.currentTarget;
  if (!slot.dataset.id) return;

  document.querySelectorAll('#english-column .slot').forEach(s => s.classList.remove('selected', 'wrong'));
  slot.classList.add('selected');
  selectedEngSlot = slot;

  checkMatch();
}

function handleChClick(e) {
  const slot = e.currentTarget;
  if (!slot.dataset.id) return;

  document.querySelectorAll('#chinese-column .slot').forEach(s => s.classList.remove('selected', 'wrong'));
  slot.classList.add('selected');
  selectedChSlot = slot;

  checkMatch();
}

function checkMatch() {
  if (!selectedEngSlot || !selectedChSlot) return;

  const engId = selectedEngSlot.dataset.id;
  const chId = selectedChSlot.dataset.id;

  if (engId === chId) {
    completedCount++;
    document.getElementById('progress').textContent = `${completedCount} / ${wordBank.length}`;

    // 取得配對成功的英文索引
    const engIndex = activeEng.findIndex(item => item && String(item.id) === engId);

    // 抽出一組新單字
    const newItem = currentQueue.length > 0 ? currentQueue.pop() : null;

    // 1. 左側英文：只更新被消除的那格，其他 4 格不變
    activeEng[engIndex] = newItem;

    // 2. 右側中文：扣除舊單字、加入新單字並洗牌
    activeCh = activeCh.filter(item => item && String(item.id) !== chId);
    if (newItem) {
      activeCh.push(newItem);
    }
    activeCh = shuffle(activeCh);

    selectedEngSlot = null;
    selectedChSlot = null;

    // 若英文全數清空，宣告通關
    if (activeEng.every(item => item === null)) {
      setTimeout(showResult, 600);
    } else {
      // 傳入 engIndex，讓系統知道「只有該格英文需要 fade 效果」
      updateSlotContentsSmoothly(engIndex, true);
    }
  } else {
    // 答錯時：紀錄錯題數與錯過的英文單字
    wrongCount++;
    const wrongWordObj = wordBank[parseInt(engId, 10)];
    if (wrongWordObj) {
      wrongWordsSet.add(wrongWordObj.eng);
    }

    selectedEngSlot.classList.add('wrong');
    selectedChSlot.classList.add('wrong');

    const eSlot = selectedEngSlot;
    const cSlot = selectedChSlot;

    setTimeout(() => {
      eSlot.classList.remove('selected', 'wrong');
      cSlot.classList.remove('selected', 'wrong');
    }, 500);

    selectedEngSlot = null;
    selectedChSlot = null;
  }
}

// 發送詳細數據至 Google Sheets
function sendResultToGoogleSheet(timeSpent, correctCount, wrongCount, wrongWords) {
  if (!GOOGLE_SHEET_URL) return;

  const payload = {
    timestamp: new Date().toLocaleString('zh-TW'), // 學生做測驗的時間
    timeSpent: timeSpent,                          // 做了多久
    correctCount: correctCount,                    // 對了幾題
    wrongCount: wrongCount,                        // 錯了幾題
    wrongWords: wrongWords                         // 考錯的單字
  };

  fetch(GOOGLE_SHEET_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  }).catch(error => console.error('Error sending data to Google Sheet:', error));
}

function showResult() {
  clearInterval(timerInterval);
  const finalTime = document.getElementById('timer').textContent;
  document.getElementById('final-time').textContent = finalTime;
  document.getElementById('result-modal').classList.remove('hidden');

  // 對題數為總題數 (所有單字皆完成配對)
  const correctCount = wordBank.length;
  // 將錯字 Set 轉為以逗點分隔的字串
  const wrongWordsString = wrongWordsSet.size > 0 ? Array.from(wrongWordsSet).join(', ') : '無';

  // 通關時發送資料
  sendResultToGoogleSheet(finalTime, correctCount, wrongCount, wrongWordsString);
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('#english-column .slot').forEach(slot => {
    slot.addEventListener('click', handleEngClick);
  });

  document.querySelectorAll('#chinese-column .slot').forEach(slot => {
    slot.addEventListener('click', handleChClick);
  });

  document.getElementById('restart-btn').addEventListener('click', initGame);
  document.getElementById('modal-restart-btn').addEventListener('click', initGame);

  initGame();
});

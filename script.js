// App State
const state = {
    password: "911611", // الكلمة الافتراضية
    workbook: null,
    sheetNames: [],
    activeSheet: "",
    currentSheetData: [], // Array of objects for the active sheet
    columns: [],
    searchColumns: [],
    activeSearchColumn: "all",
    fileInfo: {
        name: "",
        date: ""
    },
    currentSearchResults: [],
    renderedCount: 0,
    currentQuery: ""
};

const PAGE_SIZE = 50;

// Database Configuration for Persistent Storage
const DB_NAME = "ExcelSearchDB";
const STORE_NAME = "AppState";
const DB_VERSION = 1;

// DOM Elements
const screens = {
    login: document.getElementById('login-screen'),
    settings: document.getElementById('settings-screen'),
    search: document.getElementById('search-screen')
};

// Login Elements
const passwordInput = document.getElementById('password-input');
const loginBtn = document.getElementById('login-btn');
const loginError = document.getElementById('login-error');

// Settings Elements
const dbSelector = document.getElementById('db-selector');
const loadDbBtn = document.getElementById('load-db-btn');
const fetchStatus = document.getElementById('fetch-status');
const sheetSelectionWrapper = document.getElementById('sheet-selection-wrapper');
const sheetSelectorSettings = document.getElementById('sheet-selector-settings');
const headerRowInput = document.getElementById('header-row-input');
const columnSelection = document.getElementById('column-selection');
const columnsContainer = document.getElementById('columns-container');
const startAppBtn = document.getElementById('start-app-btn');
const selectAllBtn = document.getElementById('select-all-btn');
const deselectAllBtn = document.getElementById('deselect-all-btn');
const restoredSessionMsg = document.getElementById('restored-session-msg');
const goToSearchBtn = document.getElementById('go-to-search-btn');

// Search Elements
const searchInput = document.getElementById('search-input');
const clearSearchBtn = document.getElementById('clear-search');
const resultsContainer = document.getElementById('results-container');
const welcomeMessage = document.getElementById('welcome-message');
const noResultsMessage = document.getElementById('no-results');
const backToSettingsBtn = document.getElementById('back-to-settings');
const goHomeBtn = document.getElementById('go-home-btn');
const exportExcelBtn = document.getElementById('export-excel-btn');
const resultCountEl = document.getElementById('result-count');
const fileInfoBadge = document.getElementById('file-info-badge');
const loadMoreContainer = document.getElementById('load-more-container');
const loadMoreBtn = document.getElementById('load-more-btn');
const loadMoreText = document.getElementById('load-more-text');

// --- Helper Functions ---
function getFormattedDateTime() {
    const now = new Date();
    return now.toLocaleString('ar-EG', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function escapeHtml(unsafe) {
    return String(unsafe)
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

function highlightText(text, query) {
    if (!query || query.trim() === "") return escapeHtml(text);
    const escapedText = escapeHtml(text);
    // Escape regex characters in query
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    return escapedText.replace(regex, '<mark>$1</mark>');
}

// --- Navigation Logic ---
function showScreen(screenName) {
    Object.values(screens).forEach(screen => screen.classList.remove('active'));
    screens[screenName].classList.add('active');
}

// --- IndexedDB Logic (Persistent Storage) ---
function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function saveStateToDB() {
    try {
        const db = await initDB();
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        const dataToSave = {
            currentSheetData: state.currentSheetData,
            columns: state.columns,
            searchColumns: state.searchColumns,
            fileInfo: state.fileInfo,
            activeSheet: state.activeSheet
        };
        store.put(dataToSave, "appData");
    } catch (e) {
        console.error("Failed to save state to IndexedDB", e);
    }
}

async function loadStateFromDB() {
    try {
        const db = await initDB();
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const request = store.get("appData");
        
        request.onsuccess = () => {
            if (request.result && request.result.currentSheetData.length > 0) {
                const data = request.result;
                state.currentSheetData = data.currentSheetData;
                state.columns = data.columns;
                state.searchColumns = data.searchColumns;
                state.fileInfo = data.fileInfo;
                state.activeSheet = data.activeSheet;
                
                // Show restore message
                restoredSessionMsg.classList.remove('hidden');
                
                // Set File Info Badge
                updateFileInfoBadge();

                state.activeSearchColumn = "all";
                renderSearchTabs();
            }
        };
    } catch (e) {
        console.error("Failed to load state from IndexedDB", e);
    }
}

function updateFileInfoBadge() {
    fileInfoBadge.innerHTML = `
        <div style="display:flex; align-items:center; gap:5px;">
            <i class="fa-solid fa-file-excel"></i> 
            <span style="max-width:140px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" dir="auto" title="${escapeHtml(state.fileInfo.name)}">${escapeHtml(state.fileInfo.name)}</span>
        </div>
        <div class="hide-on-mobile" style="opacity: 0.5;">|</div>
        <div style="display:flex; align-items:center; gap:5px;">
            <i class="fa-solid fa-table"></i> ورقة: ${escapeHtml(state.activeSheet)}
        </div>
        <div class="hide-on-mobile" style="opacity: 0.5;">|</div>
        <div class="hide-on-mobile" style="display:flex; align-items:center; gap:5px;">
            <i class="fa-regular fa-clock"></i> <span dir="ltr">${escapeHtml(state.fileInfo.date)}</span>
        </div>
    `;
    fileInfoBadge.classList.remove('hidden');
}


// --- 1. Login Logic ---
loginBtn.addEventListener('click', handleLogin);
passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleLogin();
});

function handleLogin() {
    const entered = passwordInput.value;
    if (entered === state.password) {
        loginError.textContent = '';
        showScreen('settings');
        loadDbConfig(); // Load available databases from config
        loadStateFromDB(); // Attempt to load saved session
    } else {
        loginError.textContent = 'كلمة المرور غير صحيحة!';
        passwordInput.value = '';
    }
}

goToSearchBtn.addEventListener('click', () => {
    showScreen('search');
});

// --- 2. Auto Fetch and Parsing Logic ---

// Load DB Config
async function loadDbConfig() {
    try {
        const response = await fetch('config.json?v=' + new Date().getTime());
        if (!response.ok) throw new Error('لا يمكن قراءة config.json');
        const config = await response.json();
        
        dbSelector.innerHTML = '';
        if (config.databases && config.databases.length > 0) {
            config.databases.forEach(db => {
                const option = document.createElement('option');
                option.value = db.file;
                option.textContent = db.name;
                if (db.fixedSheet) option.dataset.fixedSheet = db.fixedSheet;
                if (db.headerRow) option.dataset.headerRow = db.headerRow;
                dbSelector.appendChild(option);
            });
        } else {
            dbSelector.innerHTML = '<option value="">لا توجد قواعد بيانات</option>';
        }
    } catch (error) {
        console.error('Config Error:', error);
        dbSelector.innerHTML = '<option value="">خطأ في قراءة إعدادات قواعد البيانات</option>';
    }
}

// Fetch DB File
loadDbBtn.addEventListener('click', async () => {
    const fileUrl = dbSelector.value;
    const selectedOption = dbSelector.options[dbSelector.selectedIndex];
    const dbName = selectedOption ? selectedOption.text : '';
    const fixedSheet = selectedOption ? selectedOption.dataset.fixedSheet : null;
    const defaultHeaderRow = selectedOption ? selectedOption.dataset.headerRow : null;
    
    if (defaultHeaderRow) {
        headerRowInput.value = defaultHeaderRow;
    }
    
    if (!fileUrl) {
        alert('يرجى اختيار قاعدة بيانات.');
        return;
    }

    restoredSessionMsg.classList.add('hidden'); // Hide restore message if fetching new
    fetchStatus.textContent = "جاري تحميل البيانات، يرجى الانتظار...";
    fetchStatus.classList.remove('hidden');
    sheetSelectionWrapper.classList.add('hidden');
    columnSelection.classList.add('hidden');
    
    // Disable button to prevent multiple clicks
    loadDbBtn.disabled = true;

    try {
        const response = await fetch(fileUrl + '?v=' + new Date().getTime()); // Prevent cache
        if (!response.ok) throw new Error('فشل تحميل الملف');
        
        const arrayBuffer = await response.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        
        state.workbook = XLSX.read(data, {type: 'array'});
        state.sheetNames = state.workbook.SheetNames;
        
        if (state.sheetNames.length > 0) {
            state.fileInfo.name = dbName;
            state.fileInfo.date = getFormattedDateTime();
            
            sheetSelectorSettings.innerHTML = '';
            state.sheetNames.forEach(name => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                sheetSelectorSettings.appendChild(option);
            });
            
            if (fixedSheet && state.sheetNames.includes(fixedSheet)) {
                sheetSelectorSettings.value = fixedSheet;
                sheetSelectionWrapper.classList.add('hidden'); // إخفاء القائمة لتثبيت الورقة
                fetchStatus.innerHTML = `<span style="color: #10B981;"><i class="fa-solid fa-check"></i> تم جلب البيانات وتثبيت ورقة (${fixedSheet}) بنجاح.</span>`;
            } else {
                sheetSelectionWrapper.classList.remove('hidden');
                fetchStatus.innerHTML = `<span style="color: #10B981;"><i class="fa-solid fa-check"></i> تم جلب البيانات بنجاح (${state.sheetNames.length} ورقة).</span>`;
            }
            
            loadDataForSheet();
            columnSelection.classList.remove('hidden');
        } else {
            alert('الملف فارغ أو لم يتم العثور على أوراق عمل.');
            fetchStatus.textContent = "";
        }
    } catch (error) {
        console.error(error);
        alert('حدث خطأ أثناء جلب الملف. ربما المتصفح يمنع ذلك محلياً لدواعي أمنية أو الرابط غير صحيح.');
        fetchStatus.textContent = "حدث خطأ أثناء تحميل البيانات.";
    } finally {
        loadDbBtn.disabled = false;
    }
});

sheetSelectorSettings.addEventListener('change', loadDataForSheet);
headerRowInput.addEventListener('change', loadDataForSheet);

function loadDataForSheet() {
    if (!state.workbook) return;
    
    const sheetName = sheetSelectorSettings.value;
    state.activeSheet = sheetName;
    
    let headerRowIndex = parseInt(headerRowInput.value, 10);
    if (isNaN(headerRowIndex) || headerRowIndex < 1) headerRowIndex = 1;
    const skipRows = headerRowIndex - 1;
    
    const worksheet = state.workbook.Sheets[sheetName];
    
    state.currentSheetData = XLSX.utils.sheet_to_json(worksheet, { 
        defval: "", 
        blankrows: false,
        range: skipRows,
        raw: false
    });
    
    let allColumnsSet = new Set();
    if(state.currentSheetData.length > 0) {
        Object.keys(state.currentSheetData[0]).forEach(col => allColumnsSet.add(col));
    }
    
    state.columns = Array.from(allColumnsSet).filter(col => {
        return !col.toUpperCase().includes('EMPTY');
    });
    
    renderColumnSelection();
}

function renderColumnSelection() {
    columnsContainer.innerHTML = '';
    
    if (state.columns.length === 0) {
        columnsContainer.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: var(--text-muted);">لا توجد أعمدة صالحة. يرجى التأكد من رقم صف الجدول.</p>';
        return;
    }
    
    state.columns.forEach(col => {
        const label = document.createElement('label');
        label.className = 'checkbox-item';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = col;
        checkbox.checked = true;
        
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(col));
        
        columnsContainer.appendChild(label);
    });
}

selectAllBtn.addEventListener('click', () => {
    const checkboxes = columnsContainer.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = true);
});

deselectAllBtn.addEventListener('click', () => {
    const checkboxes = columnsContainer.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = false);
});

// --- 3. Start App Logic ---
startAppBtn.addEventListener('click', () => {
    const checkboxes = columnsContainer.querySelectorAll('input[type="checkbox"]:checked');
    state.searchColumns = Array.from(checkboxes).map(cb => cb.value);
    
    if (state.searchColumns.length === 0) {
        alert('يرجى تحديد عمود واحد على الأقل ليتم البحث فيه.');
        return;
    }
    
    updateFileInfoBadge();
    
    // Save state so it persists on refresh
    saveStateToDB();
    
    state.activeSearchColumn = "all";
    renderSearchTabs();
    
    searchInput.value = '';
    updateSearchUI();
    showScreen('search');
});

backToSettingsBtn.addEventListener('click', () => {
    showScreen('settings');
});

goHomeBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearSearchBtn.classList.add('hidden');
    updateSearchUI();
});

// --- Search Tabs Logic ---
function renderSearchTabs() {
    const tabsContainer = document.getElementById('search-tabs');
    if (!tabsContainer) return;
    tabsContainer.innerHTML = '';
    tabsContainer.classList.remove('hidden');

    const validColumns = state.searchColumns.filter(col => state.columns.includes(col));
    const allTab = document.createElement('button');
    allTab.className = 'search-tab' + (state.activeSearchColumn === 'all' ? ' active' : '');
    allTab.textContent = 'الكل';
    allTab.onclick = () => selectTab(allTab, 'all');
    tabsContainer.appendChild(allTab);

    validColumns.forEach(col => {
        const tab = document.createElement('button');
        tab.className = 'search-tab' + (state.activeSearchColumn === col ? ' active' : '');
        tab.textContent = col;
        tab.onclick = () => selectTab(tab, col);
        tabsContainer.appendChild(tab);
    });
}

function selectTab(clickedTab, colName) {
    document.querySelectorAll('.search-tab').forEach(tab => tab.classList.remove('active'));
    clickedTab.classList.add('active');
    state.activeSearchColumn = colName;
    updateSearchUI(searchInput.value.trim());
}

// --- 4. Search Logic ---
searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim();
    if (query.length > 0) {
        clearSearchBtn.classList.remove('hidden');
    } else {
        clearSearchBtn.classList.add('hidden');
    }
    updateSearchUI(query);
});

clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearSearchBtn.classList.add('hidden');
    updateSearchUI();
    searchInput.focus();
});

function updateSearchUI(query = "") {
    resultsContainer.innerHTML = '';
    resultCountEl.classList.add('hidden');
    loadMoreContainer.classList.add('hidden');
    state.currentQuery = query;
    state.renderedCount = 0;
    
    if (query === "") {
        state.currentSearchResults = [];
        welcomeMessage.classList.remove('hidden');
        noResultsMessage.classList.add('hidden');
        return;
    }
    
    welcomeMessage.classList.add('hidden');
    
    const results = performSearch(query);
    state.currentSearchResults = results;
    
    if (results.length === 0) {
        noResultsMessage.classList.remove('hidden');
    } else {
        noResultsMessage.classList.add('hidden');
        resultCountEl.classList.remove('hidden');
        resultCountEl.textContent = `تم العثور على ${results.length} سجل`;
        renderNextBatch();
    }
}

function renderNextBatch() {
    const total = state.currentSearchResults.length;
    const startIndex = state.renderedCount;
    const endIndex = Math.min(startIndex + PAGE_SIZE, total);
    
    if (startIndex >= total) {
        loadMoreContainer.classList.add('hidden');
        return;
    }
    
    renderResultsBatch(state.currentSearchResults, state.currentQuery, startIndex, endIndex);
    state.renderedCount = endIndex;
    
    if (state.renderedCount < total) {
        loadMoreContainer.classList.remove('hidden');
        const remaining = total - state.renderedCount;
        loadMoreText.textContent = `عرض المزيد (تم عرض ${state.renderedCount} من ${total} - متبقي ${remaining})`;
    } else {
        loadMoreContainer.classList.add('hidden');
    }
}

loadMoreBtn.addEventListener('click', () => {
    renderNextBatch();
});

function performSearch(query) {
    const lowerQuery = query.toLowerCase();
    
    return state.currentSheetData.filter(row => {
        const columnsToSearch = state.activeSearchColumn === 'all' 
            ? state.searchColumns 
            : [state.activeSearchColumn];

        return columnsToSearch.some(col => {
            if (row[col] === undefined || row[col] === null) return false;
            const cellValue = String(row[col]).toLowerCase();
            return cellValue.includes(lowerQuery);
        });
    });
}

function renderResultsBatch(results, query, startIndex, endIndex) {
    for (let i = startIndex; i < endIndex; i++) {
        const row = results[i];
        
        const card = document.createElement('div');
        card.className = 'result-card';
        card.style.animationDelay = `${(i - startIndex) * 0.02}s`;
        
        let contentHTML = `
            <div class="card-header-actions">
                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                    <input type="checkbox" class="card-checkbox" data-index="${i}" title="تحديد للتصدير">
                    <span style="font-size: 0.85rem; color: var(--primary); font-weight: 600;">تحديد</span>
                </label>
                <span class="card-index-badge">#${i + 1}</span>
            </div>
            <div class="result-card-content">
        `;
        state.columns.forEach(col => {
            if (state.searchColumns.includes(col) && row[col] !== undefined && row[col] !== "") {
                const cellValue = String(row[col]);
                const highlightedValue = highlightText(cellValue, query);
                
                contentHTML += `
                    <div class="data-row">
                        <div class="data-row-header">
                            <span class="data-label">${escapeHtml(col)}</span>
                            <button class="inline-copy-btn" onclick="copyField(this)" data-col="${escapeHtml(col)}" title="نسخ هذا البيان فقط">
                                <i class="fa-regular fa-copy"></i>
                            </button>
                        </div>
                        <span class="data-value">${highlightedValue}</span>
                    </div>
                `;
            }
        });
        contentHTML += '</div>';
        
        const actionsHTML = `
            <div class="action-bar">
                <button class="action-btn" onclick="copyRecord(this, ${i})" title="نسخ كل السجل">
                    <i class="fa-solid fa-clipboard-list"></i> نسخ السجل
                </button>
                <button class="action-btn" onclick="printRecord(${i})" title="طباعة">
                    <i class="fa-solid fa-print"></i>
                </button>
                <button class="action-btn" onclick="shareRecord(${i})" title="مشاركة">
                    <i class="fa-solid fa-share-nodes"></i>
                </button>
            </div>
        `;
        
        card.innerHTML = contentHTML + actionsHTML;
        card.dataset.index = i;
        card.dataset.record = JSON.stringify(row);
        
        resultsContainer.appendChild(card);
    }
}

// --- 5. Actions Logic ---

// Copy Individual Field
window.copyField = function(btn) {
    const card = btn.closest('.result-card');
    const col = btn.getAttribute('data-col');
    let textToCopy = "";
    
    if (card && card.dataset.record && col) {
        try {
            const record = JSON.parse(card.dataset.record);
            textToCopy = record[col] !== undefined ? String(record[col]) : "";
        } catch (e) {
            textToCopy = btn.closest('.data-row')?.querySelector('.data-value')?.textContent || "";
        }
    } else {
        textToCopy = btn.closest('.data-row')?.querySelector('.data-value')?.textContent || "";
    }

    navigator.clipboard.writeText(textToCopy).then(() => {
        const originalHtml = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check"></i>';
        btn.classList.add('success');
        setTimeout(() => {
            btn.innerHTML = originalHtml;
            btn.classList.remove('success');
        }, 1500);
    });
};

window.copyRecord = function(btn, index) {
    const card = document.querySelector(`.result-card[data-index="${index}"]`);
    const record = JSON.parse(card.dataset.record);
    
    let textToCopy = `تفاصيل السجل (من ورقة: ${state.activeSheet}):\n`;
    state.columns.forEach(col => {
        if (state.searchColumns.includes(col) && record[col] !== undefined && record[col] !== "") {
            textToCopy += `${col}: ${record[col]}\n`;
        }
    });
    
    navigator.clipboard.writeText(textToCopy).then(() => {
        const originalHtml = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check"></i> تم النسخ';
        btn.classList.add('success');
        setTimeout(() => {
            btn.innerHTML = originalHtml;
            btn.classList.remove('success');
        }, 2000);
    });
};

window.printRecord = function(index) {
    const card = document.querySelector(`.result-card[data-index="${index}"]`);
    const record = JSON.parse(card.dataset.record);
    
    let printContent = `
        <html lang="ar" dir="rtl">
        <head>
            <title>طباعة السجل - ${escapeHtml(state.fileInfo.name)}</title>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; color: #333; }
                h2 { border-bottom: 2px solid #4F46E5; padding-bottom: 10px; color: #1F2937; }
                .meta-info { display: inline-block; background: #E5E7EB; padding: 6px 12px; border-radius: 20px; font-size: 0.85em; color: #4B5563; margin-bottom: 20px; }
                .row { display: flex; border-bottom: 1px solid #eee; padding: 10px 0; }
                .label { font-weight: bold; width: 30%; color: #6B7280; font-size: 0.9em; }
                .value { flex: 1; font-weight: bold; color: #111827; }
                @media print {
                    body { -webkit-print-color-adjust: exact; }
                }
            </style>
        </head>
        <body>
            <h2>تفاصيل السجل</h2>
            <div class="meta-info">
                الورقة: ${escapeHtml(state.activeSheet)} | الملف: ${escapeHtml(state.fileInfo.name)} | التاريخ: ${escapeHtml(state.fileInfo.date)}
            </div>
    `;
    
    state.columns.forEach(col => {
        if (state.searchColumns.includes(col) && record[col] !== undefined && record[col] !== "") {
            printContent += `
                <div class="row">
                    <div class="label">${escapeHtml(col)}</div>
                    <div class="value">${escapeHtml(String(record[col]))}</div>
                </div>
            `;
        }
    });
    
    printContent += '</body></html>';
    
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 250);
};

window.shareRecord = function(index) {
    const card = document.querySelector(`.result-card[data-index="${index}"]`);
    const record = JSON.parse(card.dataset.record);
    
    let textToShare = `إليك تفاصيل السجل (من ورقة: ${state.activeSheet}):\n\n`;
    state.columns.forEach(col => {
        if (state.searchColumns.includes(col) && record[col] !== undefined && record[col] !== "") {
            textToShare += `▪️ *${col}*: ${record[col]}\n`;
        }
    });

    if (navigator.share) {
        navigator.share({
            title: 'تفاصيل السجل',
            text: textToShare
        }).catch(err => {
            console.log('Share canceled or failed:', err);
        });
    } else {
        alert("ميزة المشاركة المباشرة تعمل بشكل أفضل على الهواتف. تم نسخ النص لتقوم بلصقه ومشاركته.");
        navigator.clipboard.writeText(textToShare);
    }
};

// Export Search Results to Excel
exportExcelBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    const checkedBoxes = document.querySelectorAll('.card-checkbox:checked');
    let resultsToExport = [];

    if (checkedBoxes.length > 0) {
        checkedBoxes.forEach(box => {
            const index = box.getAttribute('data-index');
            const card = document.querySelector(`.result-card[data-index="${index}"]`);
            if(card) {
                resultsToExport.push(JSON.parse(card.dataset.record));
            }
        });
    } else {
        resultsToExport = query === "" ? state.currentSheetData : performSearch(query);
    }
    
    if (resultsToExport.length === 0) {
        alert('لا توجد بيانات لتصديرها.');
        return;
    }

    // Filter results to only include selected columns for neatness
    const filteredResults = resultsToExport.map(row => {
        const newRow = {};
        state.searchColumns.forEach(col => {
            if (row[col] !== undefined) {
                newRow[col] = row[col];
            }
        });
        return newRow;
    });

    try {
        const ws = XLSX.utils.json_to_sheet(filteredResults);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "نتائج البحث");
        
        // Generate file name
        const fileName = `نتائج_بحث_${query || 'الكل'}_${new Date().getTime()}.xlsx`;
        XLSX.writeFile(wb, fileName);
    } catch (error) {
        console.error("Export Error:", error);
        alert('حدث خطأ أثناء تصدير الملف.');
    }
});

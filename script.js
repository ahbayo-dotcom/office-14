:root {
    --primary: #4F46E5;
    --primary - hover: #4338CA;
    --bg - gradient: linear - gradient(135deg, #f5f7fa 0 %, #c3cfe2 100 %);
    --card - bg: rgba(255, 255, 255, 0.9);
    --card - border: rgba(255, 255, 255, 0.4);
    --text - main: #1F2937;
    --text - muted: #6B7280;
    --danger: #EF4444;
    --highlight - bg: #FDE047;
    --highlight - text: #854D0E;
}

* {
    box- sizing: border - box;
margin: 0;
padding: 0;
font - family: 'Cairo', sans - serif;
}

body {
    background: var(--bg - gradient);
    min - height: 100vh;
    color: var(--text - main);
    display: flex;
    justify - content: center;
    align - items: center;
}

#app {
    width: 100 %;
    height: 100vh;
    position: relative;
    overflow: hidden;
    background: transparent;
}

/* Adjust layout for larger screens */
@media(min - width: 768px) {
    #app {
        height: 90vh;
        max - width: 1200px;
        border - radius: 24px;
        box - shadow: 0 25px 50px - 12px rgba(0, 0, 0, 0.25);
        background: #ffffff;
    }
}

/* Screens Setup */
.screen {
    position: absolute;
    top: 0;
    left: 0;
    width: 100 %;
    height: 100 %;
    display: flex;
    flex - direction: column;
    padding: 20px;
    opacity: 0;
    pointer - events: none;
    transition: opacity 0.4s ease, transform 0.4s ease;
    transform: translateY(20px);
    overflow - y: auto;
    overflow - x: hidden;
}

.screen.active {
    opacity: 1;
    pointer - events: all;
    transform: translateY(0);
}

/* Glass Card styles for Login & Settings */
.glass - card {
    background: var(--card - bg);
    backdrop - filter: blur(12px);
    border: 1px solid var(--card - border);
    border - radius: 20px;
    padding: 35px 25px;
    text - align: center;
    box - shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
    margin: auto;
    width: 100 %;
    max - width: 500px;
}

.icon - container {
    font - size: 3.5rem;
    color: var(--primary);
    margin - bottom: 20px;
}

.glass - card h2 {
    font - size: 1.6rem;
    margin - bottom: 10px;
    font - weight: 700;
}

.glass - card p {
    color: var(--text - muted);
    font - size: 0.95rem;
    margin - bottom: 30px;
}

/* Global Inputs & Buttons */
input[type = "password"],
    input[type = "text"] {
    width: 100 %;
    padding: 14px 18px;
    border: 2px solid #E5E7EB;
    border - radius: 12px;
    font - size: 1rem;
    margin - bottom: 15px;
    transition: all 0.3s ease;
    outline: none;
    background: #F9FAFB;
}

input[type = "password"]: focus,
    input[type = "text"]:focus {
    border - color: var(--primary);
    box - shadow: 0 0 0 4px rgba(79, 70, 229, 0.15);
    background: #ffffff;
}

button {
    width: 100 %;
    padding: 14px;
    background: var(--primary);
    color: white;
    border: none;
    border - radius: 12px;
    font - size: 1.05rem;
    font - weight: 700;
    cursor: pointer;
    transition: background 0.3s ease, transform 0.2s ease;
    display: flex;
    justify - content: center;
    align - items: center;
    gap: 10px;
}

button:hover {
    background: var(--primary - hover);
    transform: translateY(-2px);
}

button:active {
    transform: translateY(0);
}

.text - btn {
    background: transparent;
    color: var(--primary);
    padding: 5px 10px;
    width: auto;
    font - size: 0.9rem;
    font - weight: 600;
}
.text - btn:hover {
    background: rgba(79, 70, 229, 0.1);
    transform: none;
}

.error - msg {
    color: var(--danger)!important;
    font - size: 0.9rem!important;
    margin - top: 15px;
    margin - bottom: 0!important;
    min - height: 20px;
}

/* File Upload UI */
.file - upload - wrapper {
    position: relative;
    margin - bottom: 25px;
}

input[type = "file"] {
    display: none;
}

.file - upload - label {
    display: flex;
    flex - direction: column;
    align - items: center;
    justify - content: center;
    padding: 35px;
    border: 2px dashed var(--primary);
    border - radius: 16px;
    cursor: pointer;
    background: rgba(79, 70, 229, 0.03);
    transition: all 0.3s ease;
    color: var(--primary);
    font - weight: 700;
}

.file - upload - label i {
    font - size: 2.8rem;
    margin - bottom: 15px;
}

.file - upload - label:hover {
    background: rgba(79, 70, 229, 0.08);
    border - color: var(--primary - hover);
}

.upload - time {
    font - size: 0.8rem;
    color: var(--text - muted);
    margin - top: 10px;
    background: white;
    padding: 4px 10px;
    border - radius: 20px;
    box - shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* Columns Checkboxes */
.selection - header {
    display: flex;
    justify - content: space - between;
    align - items: center;
    margin - bottom: 15px;
    flex - wrap: wrap;
    gap: 10px;
}

#column - selection h3 {
    font - size: 1.1rem;
    text - align: right;
    color: var(--text - main);
    margin: 0;
}

.selection - actions {
    display: flex;
    gap: 5px;
}

.checkbox - grid {
    display: grid;
    grid - template - columns: 1fr 1fr;
    gap: 12px;
    margin - bottom: 25px;
    text - align: right;
    max - height: 200px;
    overflow - y: auto;
    padding - left: 5px; /* for scrollbar */
}

.checkbox - item {
    display: flex;
    align - items: center;
    gap: 10px;
    font - size: 0.95rem;
    background: #F3F4F6;
    padding: 10px 14px;
    border - radius: 10px;
    cursor: pointer;
    transition: background 0.2s;
    user - select: none;
}

.checkbox - item:hover {
    background: #E5E7EB;
}

.hidden {
    display: none!important;
}

/* Search Screen Styles */
.app - header {
    display: flex;
    justify - content: space - between;
    align - items: flex - start;
    padding - bottom: 15px;
    border - bottom: 1px solid #E5E7EB;
    margin - bottom: 10px;
    padding - top: 10px;
}

.header - titles {
    display: flex;
    flex - direction: column;
    gap: 8px;
}

.app - header h2 {
    font - size: 1.4rem;
    display: flex;
    align - items: center;
    gap: 10px;
    color: var(--primary);
    margin: 0;
}

.file - info - badge {
    font - size: 0.75rem;
    color: var(--text - muted);
    background: #F3F4F6;
    padding: 6px 10px;
    border - radius: 8px;
    display: flex;
    flex - wrap: wrap;
    align - items: center;
    gap: 8px;
    font - weight: 600;
}

@media(max - width: 600px) {
    .hide - on - mobile {
        display: none!important;
    }
    .file - info - badge {
        flex - direction: column;
        align - items: flex - start;
        gap: 4px;
    }
}

.header - actions {
    display: flex;
    gap: 5px;
}

.icon - btn {
    width: 40px;
    height: 40px;
    padding: 0;
    background: transparent;
    color: var(--text - muted);
    font - size: 1.2rem;
    border - radius: 50 %;
}

.icon - btn:hover {
    color: var(--primary);
    background: #F3F4F6;
    transform: none;
}

.search - container {
    position: sticky;
    top: 0;
    background: #ffffff;
    z - index: 20;
    padding - bottom: 10px;
    padding - top: 5px;
    border - bottom: 1px solid #F3F4F6;
}

@media(max - width: 767px) {
    .search - container {
        background: #fdfdfd;
    }
}

.search - tabs {
    display: flex;
    flex - wrap: wrap;
    gap: 8px;
    padding - bottom: 8px;
    margin - bottom: 10px;
    -webkit - overflow - scrolling: touch;
}
.search - tab {
    flex - shrink: 0;
    padding: 6px 14px;
    background: #F3F4F6;
    color: var(--text - muted);
    border - radius: 20px;
    font - size: 0.85rem;
    font - weight: 600;
    white - space: nowrap;
    cursor: pointer;
    border: 1px solid transparent;
    transition: all 0.2s ease;
}
.search - tab:hover {
    background: #E5E7EB;
}
.search - tab.active {
    background: var(--primary);
    color: white;
    box - shadow: 0 4px 6px - 1px rgba(79, 70, 229, 0.2);
}

.search - box {
    position: relative;
    display: flex;
    align - items: center;
}

.search - icon {
    position: absolute;
    right: 18px;
    color: #9CA3AF;
    font - size: 1.1rem;
}

.search - box input {
    padding - right: 45px;
    padding - left: 45px;
    margin - bottom: 5px;
    box - shadow: 0 4px 6px - 1px rgba(0, 0, 0, 0.05);
}

#clear - search {
    position: absolute;
    left: 5px;
    background: transparent;
    color: var(--text - muted);
    width: 35px;
    height: 35px;
    border - radius: 50 %;
}

.result - count {
    text - align: right;
    font - size: 0.9rem;
    color: var(--primary);
    font - weight: 600;
    margin - bottom: 5px;
    padding - right: 5px;
}

/* State Messages */
.state - message {
    text - align: center;
    margin - top: 40px;
    animation: fadeIn 0.6s ease;
}

.state - message.icon - wrapper {
    font - size: 4.5rem;
    color: #D1D5DB;
    margin - bottom: 20px;
}

.state - message h3 {
    color: var(--text - main);
    margin - bottom: 10px;
    font - size: 1.3rem;
}

.state - message p {
    color: var(--text - muted);
    font - size: 1rem;
    line - height: 1.6;
}

/* Result Cards */
.results - grid {
    display: grid;
    grid - template - columns: 1fr;
    gap: 12px;
    padding - top: 15px;
    padding - bottom: 30px;
}

@media(min - width: 600px) {
    .results - grid {
        grid - template - columns: repeat(auto - fill, minmax(220px, 1fr));
    }
}

@media(min - width: 1024px) {
    .results - grid {
        grid - template - columns: repeat(auto - fill, minmax(250px, 1fr));
    }
}

.result - card {
    background: white;
    border: 1px solid #E5E7EB;
    border - radius: 12px;
    padding: 10px 12px;
    box - shadow: 0 4px 10px - 3px rgba(0, 0, 0, 0.05);
    animation: slideUp 0.4s ease forwards;
    opacity: 0;
    transform: translateY(15px);
    display: flex;
    flex - direction: column;
    justify - content: space - between;
}

.result - card - content {
    margin - bottom: 15px;
}

.data - row {
    display: flex;
    align - items: flex - start;
    padding: 4px 0;
    border - bottom: 1px dashed #E5E7EB;
}

.data - row: last - child {
    border - bottom: none;
}

.data - row - header {
    width: 95px;
    flex - shrink: 0;
    display: flex;
    align - items: center;
    justify - content: space - between;
    gap: 4px;
    margin - bottom: 0;
    padding - left: 8px; /* space between label and value */
}

.data - label {
    font - weight: 700;
    color: var(--text - muted);
    font - size: 0.7rem;
    line - height: 1.2;
}

/* Card Selection Checkbox */
.card - header - actions {
    display: flex;
    justify - content: space - between;
    align - items: center;
    margin - bottom: 8px;
    border - bottom: 1px solid #E5E7EB;
    padding - bottom: 6px;
}
.card - checkbox {
    width: 14px;
    height: 14px;
    cursor: pointer;
    accent - color: var(--primary);
}
.card - index - badge {
    font - size: 0.7rem;
    color: var(--text - muted);
    font - weight: bold;
    background: #F3F4F6;
    padding: 2px 6px;
    border - radius: 8px;
}

/* Inline Copy Button for individual fields */
.inline - copy - btn {
    background: transparent;
    border: none;
    color: #9CA3AF;
    padding: 2px;
    width: auto;
    font - size: 0.75rem;
    border - radius: 4px;
    transition: all 0.2s;
    cursor: pointer;
}
.inline - copy - btn:hover {
    color: var(--primary);
    background: #EEF2FF;
    transform: none;
}
.inline - copy - btn.success {
    color: #10B981;
}

.data - value {
    font - weight: 700;
    color: var(--text - main);
    font - size: 0.85rem;
    word -break: break-word;
    text - align: right;
    flex - grow: 1;
    margin - right: 0;
    line - height: 1.3;
}

/* Highlighting styles */
mark {
    background - color: var(--highlight - bg);
    color: var(--highlight - text);
    padding: 0 2px;
    border - radius: 3px;
    font - weight: bold;
}

/* Action Bar */
.action - bar {
    display: flex;
    justify - content: flex - end;
    gap: 8px;
    border - top: 1px solid #F3F4F6;
    padding - top: 12px;
    margin - top: auto;
}

.action - btn {
    background: #F3F4F6;
    color: var(--text - main);
    border: none;
    border - radius: 8px;
    padding: 6px 10px;
    font - size: 0.85rem;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align - items: center;
    gap: 5px;
    width: auto;
    font - weight: 600;
}

.action - btn:hover {
    background: #E5E7EB;
    color: var(--primary);
    transform: none;
}

.action - btn.success {
    background: #DEF7EC;
    color: #03543F;
}

/* Animations */
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes slideUp {
    from { opacity: 0; transform: translateY(15px); }
    to { opacity: 1; transform: translateY(0); }
}

/* Custom Scrollbar */
:: -webkit - scrollbar {
    width: 6px;
    height: 6px;
}
:: -webkit - scrollbar - track {
    background: transparent;
}
:: -webkit - scrollbar - thumb {
    background: #CBD5E1;
    border - radius: 10px;
}

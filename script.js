        const EntryContent = document.getElementById('EntryContent');
        const EntryTitle = document.getElementById('EntryTitle');
        const EntryList = document.getElementById('EntryList');
        const EntryMenu = document.getElementById('EntryMenu');
        const toggleMenuBtn = document.getElementById('toggleMenuBtn');
        const toggleMenuBtnClose = document.getElementById('toggleMenuBtnClose');
        const saveEntryBtn = document.getElementById('saveEntryBtn');
        const deleteAllBtn = document.getElementById('deleteAllBtn');
        const newEntryBtn = document.getElementById('newEntryBtn');
        
        // Settings Elements
        const toggleWordWrap = document.getElementById('toggleWordWrap');
        const fontSizeInput = document.getElementById('fontSize');
        const lineSpacingInput = document.getElementById('lineSpacing');
        const charSpacingInput = document.getElementById('charSpacing');
        
        let currentEntryId = null;

        function loadSettings() {
            // Load settings from localStorage
            const settings = JSON.parse(localStorage.getItem('editorSettings')) || {
                wordWrap: true,
                fontSize: 14,
                lineSpacing: 1.5,
                charSpacing: 1.2
            };
            
            // Apply settings
            applySettings(settings);
            
            // Update settings controls
            toggleWordWrap.textContent = settings.wordWrap ? 'ON' : 'OFF';
            fontSizeInput.value = settings.fontSize;
            lineSpacingInput.value = settings.lineSpacing;
            charSpacingInput.value = settings.charSpacing;
        }

        function saveSettings() {
            // Save the settings to localStorage
            const settings = {
                wordWrap: toggleWordWrap.textContent === 'ON',
                fontSize: parseFloat(fontSizeInput.value),
                lineSpacing: parseFloat(lineSpacingInput.value),
                charSpacing: parseFloat(charSpacingInput.value)
            };
            localStorage.setItem('editorSettings', JSON.stringify(settings));
            
            // Apply settings to content area
            applySettings(settings);
        }

        function applySettings(settings) {
            EntryContent.style.whiteSpace = settings.wordWrap ? 'pre-wrap' : 'pre';
            EntryContent.style.fontSize = settings.fontSize + 'px';
            EntryContent.style.lineHeight = settings.lineSpacing;
            EntryContent.style.letterSpacing = settings.charSpacing + 'px';
        }

        function loadEntrys() {
    EntryList.innerHTML = '';
    let entries = [];

    // Collect all entries from localStorage
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('Entry_')) {
            const entry = JSON.parse(localStorage.getItem(key));
            entries.push({ ...entry, id: key });
        }
    }

    // Sort entries by date (most recent first)
    entries.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Display the sorted entries
    entries.forEach((entry) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'menu-item';
        itemDiv.innerHTML = `
            <span>${entry.title}</span>
            <button class="delete-individual" onclick="deleteEntry('${entry.id}')">
                <span class="material-symbols-outlined">delete</span>
            </button>
        `;
        itemDiv.onclick = (e) => {
            if (!e.target.closest('.delete-individual')) openEntry(entry.id);
        };
        EntryList.appendChild(itemDiv);
    });
}


const backgroundOverlay = document.getElementById('backgroundOverlay');

// Function to open the menu and show the overlay
toggleMenuBtn.addEventListener('click', () => {
    EntryMenu.classList.add('open');
    backgroundOverlay.style.display = 'block'; // Show overlay
});

// Function to close the menu and hide the overlay
function closeMenu() {
    EntryMenu.classList.remove('open');
    backgroundOverlay.style.display = 'none'; // Hide overlay
}

// Close menu when clicking the close button
toggleMenuBtnClose.addEventListener('click', closeMenu);

// Close menu when clicking on the overlay
backgroundOverlay.addEventListener('click', closeMenu);



        function saveEntry() {
            if (!EntryTitle.value) {
                alert('Please enter a title for the Entry.');
                return;
            }

            const content = EntryContent.value;
            const title = EntryTitle.value;

            const Entry = {
                title: title,
                content: content,
                date: new Date().toISOString()
            };

            if (!currentEntryId) {
                currentEntryId = `Entry_${Date.now()}`;
            }

            localStorage.setItem(currentEntryId, JSON.stringify(Entry));
            loadEntrys();
        }

        function deleteAllEntrys() {
            for (let i = localStorage.length - 1; i >= 0; i--) {
                const key = localStorage.key(i);
                if (key.startsWith('Entry_')) {
                    localStorage.removeItem(key);
                }
            }
            loadEntrys();
        }

        function deleteEntry(id) {
            if (confirm('Are you sure you want to delete this Entry?')) {
                localStorage.removeItem(id);
                loadEntrys();
            }
        }

        function openEntry(id) {
            const Entry = JSON.parse(localStorage.getItem(id));
            if (Entry) {
                currentEntryId = id;
                EntryTitle.value = Entry.title;
                EntryContent.value = Entry.content;
            }
        }

        newEntryBtn.addEventListener('click', () => {
            currentEntryId = null;
            EntryTitle.value = '';
            EntryContent.value = '';
        });

        saveEntryBtn.addEventListener('click', saveEntry);
        deleteAllBtn.addEventListener('click', deleteAllEntrys);

        toggleMenuBtn.addEventListener('click', () => {
    EntryMenu.classList.add('open');
});

toggleMenuBtnClose.addEventListener('click', () => {
    EntryMenu.classList.remove('open');
});


        toggleWordWrap.addEventListener('click', () => {
            toggleWordWrap.textContent = toggleWordWrap.textContent === 'ON' ? 'OFF' : 'ON';
            saveSettings();
        });

        fontSizeInput.addEventListener('change', saveSettings);
        lineSpacingInput.addEventListener('change', saveSettings);
        charSpacingInput.addEventListener('change', saveSettings);

        // Initialize
        loadEntrys();
        loadSettings();

const summarySelect = document.getElementById('summarySelect');
const newSummaryInput = document.getElementById('newSummaryInput');
const addSummaryBtn = document.getElementById('addSummaryBtn');
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const listsArea = document.getElementById('listsArea');

// 概要ごとのリスト管理
const lists = {};

// 初期選択肢
let defaultSummaries = ['プレイヤー', 'エネミー', 'ステージ'];
defaultSummaries.forEach(s => addSummaryOption(s));

function addSummaryOption(summaryText) {
    if ([...summarySelect.options].some(opt => opt.value === summaryText)) return;
    const option = document.createElement('option');
    option.value = summaryText;
    option.textContent = summaryText;
    summarySelect.appendChild(option);
    saveToStorage();
}

addSummaryBtn.addEventListener('click', function() {
    const newSummary = newSummaryInput.value.trim();
    if (newSummary === '') {
        alert('概要が入力されていません。');
        return;
    }
    addSummaryOption(newSummary);
    newSummaryInput.value = '';
    summarySelect.value = newSummary;
    saveToStorage();
});

addTaskBtn.addEventListener('click', addTask);

taskInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter' || event.keyCode === 13) {
        addTask();
    }
});
    const summaryText = summarySelect.value;


function addTask() {
    // 完了リストのプルダウンUI更新関数
    function updateCompletedDropdown(completedUl, dropdownBtn, completedListWrapper) {
        if (!completedUl || !dropdownBtn || !completedListWrapper) return;
        if (completedUl.children.length >= 4) {
            dropdownBtn.style.display = '';
            completedUl.style.display = 'none';
            dropdownBtn.textContent = '▼ 完了リストを表示';
        } else {
            dropdownBtn.style.display = 'none';
            completedUl.style.display = '';
        }
    }
    const summaryText = summarySelect.value;
    const taskText = taskInput.value.trim();

    if (!summaryText) {
        alert("概要が選択されていません。");
        return;
    }
    if (taskText === '') {
        alert("タスクが入力されていません。");
        return;
    }

    // 概要ごとのリストがなければ作成
    if (!lists[summaryText]) {
        // 概要タイトル
        const summaryDiv = document.createElement('div');
        summaryDiv.className = 'summary-block';
        const title = document.createElement('h2');
        title.textContent = summaryText;
        summaryDiv.appendChild(title);

        // タスク一覧
        const taskUl = document.createElement('ul');
        taskUl.className = 'task-list';
        summaryDiv.appendChild(taskUl);

        // 完了リスト
        const completedTitle = document.createElement('h3');
        completedTitle.textContent = '完了リスト';
        summaryDiv.appendChild(completedTitle);

        // プルダウンUIラッパー
        const completedListWrapper = document.createElement('div');
        completedListWrapper.className = 'completed-list-wrapper';
        // プルダウンボタン
        const dropdownBtn = document.createElement('button');
        dropdownBtn.textContent = '▼ 完了リストを表示';
        dropdownBtn.className = 'dropdown-btn';
        dropdownBtn.style.display = 'none';
        dropdownBtn.style.marginBottom = '8px';
        completedListWrapper.appendChild(dropdownBtn);

        // 完了リスト
        const completedUl = document.createElement('ul');
        completedUl.className = 'completed-list';
        completedListWrapper.appendChild(completedUl);
        summaryDiv.appendChild(completedListWrapper);

        listsArea.appendChild(summaryDiv);
        lists[summaryText] = { taskUl, completedUl, dropdownBtn, completedListWrapper };

        // プルダウンボタンの挙動
        dropdownBtn.addEventListener('click', function() {
            if (completedUl.style.display === 'none') {
                completedUl.style.display = '';
                dropdownBtn.textContent = '▲ 完了リストを閉じる';
            } else {
                completedUl.style.display = 'none';
                dropdownBtn.textContent = '▼ 完了リストを表示';
            }
        });
    }

    // タスク追加
    const { taskUl, completedUl, dropdownBtn, completedListWrapper } = lists[summaryText];
    const li = document.createElement('li');
    li.textContent = taskText;

    // 完了ボタン
    const completeBtn = document.createElement('button');
    completeBtn.textContent = '完了';
    completeBtn.className = 'complete-btn';
    completeBtn.style.marginLeft = '10px';
    completeBtn.addEventListener('click', function() {
        taskUl.removeChild(li);
        const completedLi = document.createElement('li');
        completedLi.textContent = taskText;

        // 完了リストの削除ボタン
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '削除';
        deleteBtn.className = 'delete-btn';
        deleteBtn.style.marginLeft = '10px';
        deleteBtn.addEventListener('click', function() {
            if (window.confirm('本当に削除しますか？')) {
                completedUl.removeChild(completedLi);
                // 両方空なら概要ブロック削除
                if (taskUl.children.length === 0 && completedUl.children.length === 0) {
                    const summaryDiv = completedUl.parentElement.parentElement;
                    listsArea.removeChild(summaryDiv);
                    delete lists[summaryText];
                }
                // 完了リストのプルダウンUI更新
                updateCompletedDropdown(completedUl, dropdownBtn, completedListWrapper);
            }
        });

        // 完了リストのボタンラッパー
        const btnWrapper = document.createElement('div');
        btnWrapper.style.display = 'flex';
        btnWrapper.style.justifyContent = 'flex-end';
        btnWrapper.style.gap = '10px';
        btnWrapper.appendChild(deleteBtn);
        completedLi.appendChild(btnWrapper);
        completedUl.appendChild(completedLi);
        // 完了リストのプルダウンUI更新
        updateCompletedDropdown(completedUl, dropdownBtn, completedListWrapper);
    });

    // 未完了リストの削除ボタン
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '削除';
    deleteBtn.className = 'delete-btn';
    deleteBtn.style.marginLeft = '10px';
    deleteBtn.addEventListener('click', function() {
        if (window.confirm('本当に削除しますか？')) {
            taskUl.removeChild(li);
            // 両方空なら概要ブロック削除
            if (taskUl.children.length === 0 && completedUl.children.length === 0) {
                const summaryDiv = taskUl.parentElement.parentElement;
                listsArea.removeChild(summaryDiv);
                delete lists[summaryText];
            }
        }
    });

    // 未完了リストのボタンラッパー
    const btnWrapper = document.createElement('div');
    btnWrapper.style.display = 'flex';
    btnWrapper.style.justifyContent = 'flex-end';
    btnWrapper.style.gap = '10px';
    btnWrapper.appendChild(completeBtn);
    btnWrapper.appendChild(deleteBtn);
    li.appendChild(btnWrapper);
    taskUl.appendChild(li);
    taskInput.value = '';
    // 完了リストのプルダウンUI更新
    updateCompletedDropdown(completedUl, dropdownBtn, completedListWrapper);
}
// 完了リストのプルダウンUI更新関数（グローバル化）
function updateCompletedDropdown(completedUl, dropdownBtn, completedListWrapper) {
    if (!completedUl || !dropdownBtn || !completedListWrapper) return;
    if (completedUl.children.length >= 4) {
        dropdownBtn.style.display = '';
        completedUl.style.display = 'none';
        dropdownBtn.textContent = '▼ 完了リストを表示';
    } else {
        dropdownBtn.style.display = 'none';
        completedUl.style.display = '';
    }
}

// 保存処理
function saveToStorage() {
    const summaries = [...summarySelect.options].map(opt => opt.value);
    const listsData = {};
    for (const summaryText of summaries) {
        if (!lists[summaryText]) continue;
        const { taskUl, completedUl } = lists[summaryText];
        listsData[summaryText] = {
            tasks: [...taskUl.children].map(li => li.firstChild.textContent),
            completed: [...completedUl.children].map(li => li.firstChild.textContent)
        };
    }
    localStorage.setItem('todoAppData', JSON.stringify({ summaries, lists: listsData }));
}

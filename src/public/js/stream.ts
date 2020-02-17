const fileListContainer: HTMLElement | null = document.querySelector('.file-list');
const btnFilterHiddenFile = document.querySelector('#filter-hidden-btn');
const btnNewFolder = document.querySelector('#new-folder-btn')
const streamSpinner = document.querySelector('#stream-spinner');
let path: string | undefined;
let back: string | undefined;
let newFolderRow: HTMLElement | null;
let backRow: HTMLElement | null;
let confirmNew: HTMLElement | null;
let dismissNew: HTMLElement | null;
let inputNewFolderName: HTMLInputElement | null;

interface IFileItem {
    name: string;
    size: string;
    breadcrumb: string;
    birth: number;
    lastAccess: number;
    modified: number;
    isFolder: boolean;
}

function createTableRow(file: IFileItem): void {

    if (!fileListContainer) { return; }

    const div = document.createElement('div');
    div.classList.add('row-file', 'files');
    div.setAttribute('data-fname', file.name);
    div.innerHTML = `
        <span class="type cell">
            <i class="${file.isFolder ? 'far fa-folder' : 'far fa-file'}"></i>
        </span>
        <span class="name cell">
            <p>${file.name}</p>
        </span>
        <span class="birth cell">${file.birth ? new Date(file.birth)?.toLocaleDateString() : '-'}</span>
        <span class="modified cell">${file.modified ? new Date(file.modified)?.toLocaleDateString() : '-'}</span>
        <span class="access cell">${file.lastAccess ? new Date(file.lastAccess)?.toLocaleDateString() : '-'}</span>
        <span class="size cell">${file.size}</span>
        <span class="actions cell">
            ${file.isFolder ? `<a href="./${file.breadcrumb}"><i class="fas fa-long-arrow-alt-right"></i></a>` : ''}
        </span>
    `;
    fileListContainer.appendChild(div);
}

function generateFileTableHeader(): void {
    if (!fileListContainer) { return; }

    const div = document.createElement('div');
    div.innerHTML = `
        <div class="row-file">
            <span class="type header"></span>
            <span class="name header">Name</span>
            <span class="birth header">Created</span>
            <span class="modified header">Last Modified</span>
            <span class="access header">Last Access</span> 
            <span class="size header">Size</span>
            <span class="actions header">Actions</span>
        </div>
    `;
    fileListContainer.appendChild(div);
}

function generateFileTableBackRow(backPath: string | undefined): void {
    if (!fileListContainer) { return; }

    const div = document.createElement('div');
    div.setAttribute('id', 'back-row')
    div.classList.add('row-file', 'files');
    div.innerHTML = `
            <span class="type cell">
                <i class="far fa-folder"></i>
            </span>
            <span class="name cell">...</span>
            <span class="birth cell"></span>
            <span class="modified cell"></span>
            <span class="access cell"></span> 
            <span class="size cell"></span>
            <span class="actions cell">
                <a href="${backPath || '/'}"><i class="fas fa-long-arrow-alt-left"></i></a> 
            </span>
    `;
    fileListContainer.appendChild(div);
}

function generateFileTableNew(): void {
    if (!fileListContainer) { return; }

    const div = document.createElement('div');
    div.setAttribute('id', 'new-folder-row')
    div.classList.add('row-file', 'files', 'closed', 'new');
    div.innerHTML = `
            <span class="type cell">
                <i class="far fa-folder-open"></i>
            </span>
            <span class="name cell">
                <input placeholder="Name New Folder" type="text / class="name-new-folder" id="new-folder-input">
            </span>
            <span class="birth cell"></span>
            <span class="modified cell"></span>
            <span class="access cell"></span> 
            <span class="size cell"></span>
            <span class="actions cell">
                <i class="fas fa-check" id="confirm-new"></i>
                <i class="fas fa-times" id="dismiss-new"></i>
            </span>
    `;
    fileListContainer.appendChild(div);

    inputNewFolderName = inputNewFolderName || document.querySelector('#new-folder-input');

    confirmNew = confirmNew || document.querySelector('#confirm-new');
    confirmNew?.addEventListener('click', handleConfirmNewFolder);

    dismissNew = dismissNew || document.querySelector('#dismiss-new');
    dismissNew?.addEventListener('click', handleDismissNewFolder);

}

function staggeringAnimation(rows: NodeListOf<Element>): void {

    function getToggleItemFiltered( i: number ) {
        var item = rows[i];
        return function() {
          const toggled = item.classList.toggle('closed');
          item.addEventListener('transitionend', () => item.setAttribute('style', `height: ${toggled ? '0' : 'auto'}`))
        }
      }

    for (let i = 0; i < rows.length; i++) {

        const fname = rows[i].getAttribute('data-fname');

        if (fname?.startsWith('.')) {
            const toggleItemFiltered = getToggleItemFiltered(i);
            setTimeout( toggleItemFiltered, i * 150 );
        }
    }
}

function changeIcon(el: Element | null | undefined, newClass: string, oldClass: string): void {
    console.log(el);

    if (el?.classList.contains(oldClass)) { el.classList.remove(oldClass); el.classList.add(newClass); }
    else { el?.classList.add(oldClass); el?.classList.remove(newClass); }

}

function toggleVisibilityRow(el: Element | null): void {
    if (!el) { return; }
    el.classList.toggle('closed');
}


function handleFilterHiddenFile(ev: Event): void {
    const filterIcon = btnFilterHiddenFile?.querySelector('i');
    changeIcon(filterIcon, 'fa-eye-slash', 'fa-eye')

    const rows = document.querySelectorAll('div[data-fname]')
    staggeringAnimation(rows);
}

function handleAllFileDownloaded(): void {
    streamSpinner?.classList.remove('fas', 'fa-spinner');
    streamSpinner?.classList.add('far', 'fa-folder-open');
}

function handleNewFolder(): void {
    newFolderRow = !newFolderRow ? document.querySelector('#new-folder-row') : newFolderRow;
    backRow = !backRow ? document.querySelector('#back-row') : backRow;

    btnNewFolder?.classList.toggle('hidden');

    toggleVisibilityRow(backRow);
    toggleVisibilityRow(newFolderRow);
    inputNewFolderName?.focus();
}

async function handleConfirmNewFolder(): Promise<void> {
    const fname: string | undefined = inputNewFolderName?.value;

    if (!fname) { return; }

    try {
        const response = await fetch(`/folder/create?path=${path}&fname=${fname}`)
        const row = await response.json();

        toggleVisibilityRow(newFolderRow);
        toggleVisibilityRow(backRow);
        btnNewFolder?.classList.toggle('hidden');
        if (inputNewFolderName) inputNewFolderName.value = '';

        setTimeout(() => createTableRow(row), 500)

    } catch(e) {
        console.log(e);
    }

}

function handleDismissNewFolder(): void {
    toggleVisibilityRow(newFolderRow);
    toggleVisibilityRow(backRow);
    btnNewFolder?.classList.toggle('hidden');
    if (inputNewFolderName) inputNewFolderName.value = '';
}

async function handleLoaded() {

    if (!fileListContainer) { return; }

   const dataset = (fileListContainer as HTMLElement).dataset;
   path = dataset.path;
   back = dataset.back;


    generateFileTableHeader();
    if (path !== 'home') generateFileTableBackRow(back);
    generateFileTableNew();
    

    fetch(`/stream?path=${path}`)
        .then(response => response.body)
        .then(body => {

            if (!body) {return;}

            const reader = body.getReader();
            
            return new ReadableStream({
                async start(controller) {
                    while(true) {

                        try {
                            const { done, value } = await reader.read();
                            if (done) { break; }

                            controller.enqueue(value);

                            // we split for new line because of JSONStream.stringify(false)
                            const chunkString = new TextDecoder().decode(value).trim().split('\n');

                            chunkString.forEach(string => {
                                const {chunk, streamLength} = JSON.parse(string);
                                
                                chunk.forEach(createTableRow)
                            })
                        } catch(e) {
                            console.log(e)
                            break;
                        }

                    }

                    btnFilterHiddenFile?.addEventListener('click', handleFilterHiddenFile);
                    btnNewFolder?.addEventListener('click', handleNewFolder);
                    handleAllFileDownloaded();

                    controller.close();
                    reader.releaseLock();
                }
            })
        })

}

window.onload = function() {
    this.handleLoaded();
};
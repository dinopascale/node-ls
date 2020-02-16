const fileListContainer: HTMLElement | null = document.querySelector('.file-list');
const btnFilterHiddenFile = document.querySelector('#filter-hidden');
const streamSpinner = document.querySelector('#stream-spinner');

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

function staggeringAnimation(rows: NodeListOf<Element>): void {

    function getToggleItemFiltered( i: number ) {
        var item = rows[i];
        return function() {
          const toggled = item.classList.toggle('filtered');
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

// function createSpinner(parentElement: Element | null | undefined): Element {
//     const loadingRow = document.createElement('div');
//     loadingRow.classList.add('loading-row');
//     const spinner = document.createElement('div');
//     spinner.setAttribute('id', 'loading');

//     loadingRow.appendChild(spinner);
//     parentElement?.appendChild(loadingRow);

//     return loadingRow;
// }

// function removeSpinner(parentElement: Element | null | undefined, loadingRow: Element): void {
//     parentElement?.removeChild(loadingRow);
// }

class Counter {

    private total: number = 0;
    private count: number = 0;

    constructor(private domEl: Element) {}

    setTotal(n: number) {
        if (!this.total) {
            this.total = n;
            this.domEl.textContent = `files analyzed: 0/${n}`;
        }
    }

    updateCounter(n: number) {
        this.count+=n;
        this.domEl.textContent = `files analyzed: ${this.count}/${this.total}`;
    }
}

async function handleLoaded() {

    if (!fileListContainer) { return; }

    const path = (fileListContainer as HTMLElement).dataset.path;
    generateFileTableHeader();


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
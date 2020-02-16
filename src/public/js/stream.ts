const fileListContainer = document.querySelector('.file-list');

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
    div.innerHTML = `
        <div class="row-file elevation">
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
                <a href=${file.breadcrumb}>
                    <i class="fas fa-long-arrow-alt-right"></i>            
                </a>    
            </span>
        </div>
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


async function handleLoaded() {

    if (!fileListContainer) { return; }

    const path = fileListContainer['dataset'].path;
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
                                console.log(string);
                                const json = JSON.parse(string);
                                json.forEach(createTableRow)
                            })
                        } catch(e) {
                            console.log(e)
                            break;
                        }

                    }

                    controller.close();
                    reader.releaseLock();
                }
            })
        })

}

window.onload = handleLoaded;
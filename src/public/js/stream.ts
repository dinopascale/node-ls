const fileListContainer = document.querySelector('.file-list');

function createTableRow(file: {name: string, size: string, breadcrumb: string}): void {

    if (!fileListContainer) { return; }

    const div = document.createElement('div');
    div.innerHTML = `
        <a href=${file.breadcrumb}>
            <span>${file.name}</span>
            <span>(${file.size})</span>
        </a>
    `;
    fileListContainer.appendChild(div);
}

async function handleLoaded() {

    fetch('/stream/home')
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
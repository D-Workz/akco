function loadContent(file, cat) {
    let displayArea;
    if(cat==="dim"){
        file = "resources/content/dimensions/"+file;
        displayArea = document.getElementById('content-area-dim');
    }else if (cat==="tec"){
        file = "resources/content/techniques/"+file;
        displayArea = document.getElementById('content-area-tec');
    } else if (cat==="bgk"){
        file = "resources/content/backgroundKnowledge/"+file;
        displayArea = document.getElementById('content-area-bgk');
    }
    fetch(file)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load ${file}`);
            }
            return response.text();
        })
        .then(html => {
            displayArea.innerHTML = html;
            MathJax.typesetPromise([displayArea]);

        })
        .catch(error => {
            document.getElementById('content-area').innerHTML = `<p>Error loading content: ${error.message}</p>`;
        });
}

const representations = {
    approaches: `<h5 class="question-heading">How can I represent everything important about a cleaning approach?</h5>
                    <div id="approach-container" >Loading...</div>`,
    errors: `<h5 class="question-heading">How can I represent different errors?</h5>
                    <div id="error-container" >Loading...</div>`,
    knowledgeGraph: `<h5 class="question-heading">How can I represent relevant features of my knowledge graph?</h5>
                    <div id="kg-container" >Loading...</div>`
};

function showContent(key) {
    document.getElementById('contentBox').innerHTML = representations[key];
    let annotations = {};

    if (key==="errors") {
        fetch('resources/content/error_annotations.json')
            .then(res => res.json())
            .then(data => {
                data.forEach(entry => {
                    annotations[entry.id] = entry.annotation;
                });
            });
        fetch('error_representation.html?nocache=' + new Date().getTime())
            .then(res => res.text())
            .then(html => {
                document.getElementById('error-container').innerHTML = html;

                const rows = document.querySelectorAll('#error-container tr');
                const output = document.getElementById('annotation-output');

                rows.forEach(row => {
                    const id = row.getAttribute('data-id');
                    row.addEventListener('mouseenter', () => {
                        output.textContent = annotations[id] || '// No annotation';
                    });
                    row.addEventListener('mouseleave', () => {
                        output.textContent = '// Hover over a row to see annotation here';
                    });
                });
            });
    } else if(key==="approaches"){
        fetch('approach_representation.html?nocache=' + new Date().getTime())
            .then(res => res.text())
            .then(html => {
                document.getElementById('approach-container').innerHTML = html;
            });
    } else if (key==="knowledgeGraph"){
        fetch('kg_representation.html?nocache=' + new Date().getTime())
            .then(res => res.text())
            .then(html => {
                document.getElementById('kg-container').innerHTML = html;
            });
    }
}

const visualizations = {
    chowlk: `                <div class="column_one">
                   <p>Visualization of the ontology, following the notation of the <a href="https://chowlk.linkeddata.es/notation.html" target="_blank">Chowlk Visual Notation </a> <a href="#ref_chavez">(Chávez-Feria, et al., 2021)</a>.</p>
                   <p>The classes and properties that are from external ontologies, are highlighted with different colors.</p>
                </div>
                <div align="center" id="visBox" class="column_two">
                    <div id="visImage"></div>
                </div>`,
    webvowl: `<iframe src="../webvowl/index.html"></iframe>`
};

function showContentVisualization(key) {
    document.getElementById('visualizationBox').innerHTML = visualizations[key];
}


// Formating

const visButtons = document.querySelector('.visBtnGrp');
const repBtnGrp = document.querySelector('.repBtnGrp');

visButtons.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        visButtons.querySelectorAll('button').forEach(btn => btn.classList.remove('activeB'));
        e.target.classList.add('activeB');
    }
});
repBtnGrp.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        repBtnGrp.querySelectorAll('button').forEach(btn => btn.classList.remove('activeB'));
        e.target.classList.add('activeB');
    }
});



const tagItemsDim = document.querySelectorAll('.tag-list-dim li');
tagItemsDim.forEach(item => {
    item.addEventListener('click', () => {
        tagItemsDim.forEach(i => i.classList.remove('activeLi'));
        item.classList.add('activeLi');
    });
});

const tagItemsKG = document.querySelectorAll('.tag-list-kg li');
tagItemsKG.forEach(item => {
    item.addEventListener('click', () => {
        tagItemsKG.forEach(i => i.classList.remove('activeLi'));
        item.classList.add('activeLi');
    });
});

const tagItems = document.querySelectorAll('.tag-list-bgk li');
tagItems.forEach(item => {
    item.addEventListener('click', () => {
        tagItems.forEach(i => i.classList.remove('activeLi'));
        item.classList.add('activeLi');
    });
});

window.addEventListener('load', () => {
    loadContent('example_kg.html', 'tec');
    loadContent('dim_internalExternal.html', 'dim');
    loadContent('bgk_contextualGraphs.html', 'bgk');
    showContent('errors');
});

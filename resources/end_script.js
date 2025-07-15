function loadContent(file, cat, callback) {
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
            if (callback) {
                callback(); // run the scroll after content is loaded
            }
        })
        .catch(error => {
            document.getElementById('content-area').innerHTML = `<p>Error loading content: ${error.message}</p>`;
        });
}

function jumpToExampleKnowledgeGraph() {
    const menuItem = document.getElementById('menu_exampleKG');
    if (!menuItem) return;

    // Deselect others
    document.querySelectorAll('.tag-list-kg li').forEach(el => el.classList.remove('activeLi'));
    menuItem.classList.add('activeLi');

    loadContent('example_kg.html', 'tec', function () {
        menuItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
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

function toggleMenu() {
    const wrapper = document.getElementById('menuWrapper');
    const button = document.getElementById('menuToggle');

    wrapper.classList.toggle('menu-hidden');

    if (wrapper.classList.contains('menu-hidden')) {
        button.textContent = '☰'; // menu closed
    } else {
        button.textContent = '← Hide menu'; // menu open
    }
}

function showOverview (){
    fetch('overview.html?nocache=' + new Date().getTime())
        .then(res => res.text())
        .then(html => {
            document.getElementById('overviewBox').innerHTML = html;
        });
}

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



function showContentVisualization(key) {
    // Hide all visualizations
    const allVisuals = document.querySelectorAll('#visualizationBox .visualization');
    allVisuals.forEach(div => {
        div.style.display = 'none';

        // 🧹 Optional: Clean up lingering iframes (like stale WebVOWL views)
        const iframe = div.querySelector('iframe');
        if (iframe) iframe.remove();
    });

    // Show the selected one
    const selected = document.getElementById(key);
    if (selected) {
        selected.style.display = 'block';

        // ♻️ Reinject WebVOWL iframe only if needed
        if (key === 'webvowl') {
            const container = selected.querySelector('#webvowl-container');
            if (container) {
                // Clean up container again to be safe
                container.innerHTML = '';
                const iframe = document.createElement('iframe');
                iframe.src = `webvowl/index.html?url=../versions/${window.ontologyVersion}/ontology.json&ts=${Date.now()}`;
                iframe.width = '100%';
                iframe.height = '600';
                iframe.loading = 'lazy';
                iframe.style.border = 'none';
                container.appendChild(iframe);
            }
        }
    }
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

function loadChangelog(version) {
    const changelogPath = `versions/${version}/changelog.html`;
    fetch(changelogPath)
        .then(res => {
            if (!res.ok) throw new Error("No changelog");
            return res.text();
        })
        .then(html => {
            document.getElementById('changelog-content').innerHTML = html;
            document.getElementById('changelogBox').style.display = 'block';
            document.getElementById('changelog-content').style.display = 'none'; // ensure collapsed by default
            document.getElementById('changelog-toggle').textContent = '▶';       // reset icon
        })
        .catch(() => {
            document.getElementById('changelogBox').style.display = 'none';
        });
}

function toggleChangelog() {
    const content = document.getElementById('changelog-content');
    const toggleIcon = document.getElementById('changelog-toggle');
    const isVisible = content.style.display === 'block';

    content.style.display = isVisible ? 'none' : 'block';
    toggleIcon.textContent = isVisible ? '▶' : '▼';
}

window.addEventListener('load', () => {
    loadContent('example_kg.html', 'tec');
    loadContent('dim_internalExternal.html', 'dim');
    loadContent('bgk_contextualGraphs.html', 'bgk');
    showContent('errors');
    showOverview();
});
document.addEventListener('DOMContentLoaded', () => {
    const selector = document.getElementById('versionSelector');
    const defaultVersion = window.ontologyVersion || selector?.value || '1.0.0';
    window.ontologyVersion = defaultVersion;

    function updateVersionedContent(version) {
        window.ontologyVersion = version;

        const webvowlContainer = document.getElementById('webvowl-container');
        webvowlContainer.innerHTML = '';
        loadChangelog(version);
        const loadingMsg = document.createElement('p');
        loadingMsg.textContent = `Loading WebVOWL visualization for version ${version}...`;
        loadingMsg.style.color = 'gray';
        webvowlContainer.appendChild(loadingMsg);

        fetch(`versions/${version}/ontology.json`)
            .then(res => {
                if (!res.ok) throw new Error("ontology.json not found or invalid");

                webvowlContainer.innerHTML = '';

                const iframe = document.createElement('iframe');
                iframe.src = `webvowl/index.html?url=../versions/${version}/ontology.json&ts=${Date.now()}`;
                iframe.width = '100%';
                iframe.height = '600';
                iframe.loading = 'lazy';
                iframe.style.border = 'none';

                webvowlContainer.appendChild(iframe);
            })
            .catch(err => {
                console.error("WebVOWL loading failed:", err);
                webvowlContainer.innerHTML = `<p style="color:red;">Failed to load WebVOWL for version ${version}</p>`;
            });

        // ✅ Reload metadata script block
        loadVersionedContent('script[type="application/ld+json"]', 'schema-metadata');

        // ✅ Reload metadata list block and rewrite links
        loadVersionedContent('.container .head dl', 'versioned-info', {
            transform: (content) => {
                content.querySelectorAll('a[href]').forEach(link => {
                    const href = link.getAttribute('href');
                    if (href?.match(/^ontology\.(jsonld|owl|nt|ttl)$/)) {
                        link.setAttribute('href', `versions/${version}/${href}`);
                    } else if (href?.includes('webvowl/index.html')) {
                        link.setAttribute('href', `webvowl/index.html?url=../versions/${version}/ontology.json`);
                    }
                });
                return content;
            }
        });

        // ✅ Reload other versioned content
        loadVersionedContent('#namespacedeclarations table', 'namespace-overview');
        loadVersionedContent('#crossref', 'crossref-box');
        loadVersionedContent('.container .head h2', 'releaseBox');
        loadVersionedContent('#overview', 'overviewBox', {
            transform: (content) => {
                // Remove rogue iframe if it exists
                const rogueIframe = content.querySelector('iframe');
                if (rogueIframe) rogueIframe.remove();
                return content;
            }
        });
    }


    // Initial load
    updateVersionedContent(window.ontologyVersion);

    // Version change listener
    if (selector) {
        selector.value = window.ontologyVersion;
        selector.addEventListener('change', (e) => {
            updateVersionedContent(e.target.value);
        });
    }
});



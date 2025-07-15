const ontologyVersion = window.ontologyVersion;
/**
 * Loads selected content from a versioned HTML file into the current page.
 *
 * @param {string} selector - CSS selector to extract from versioned file
 * @param {string} targetId - ID of element in current document to insert into
 * @param {object} options - { mode: "replace" | "append" | "prepend", transform?: (element: HTMLElement) => void }
 */
async function loadVersionedContent(selector, targetId, options = { mode: "replace" }) {
    try {
        const res = await fetch(`versions/${window.ontologyVersion}/index-en.html`);
        const html = await res.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const fragment = doc.querySelector(selector);
        const target = document.getElementById(targetId);
        if (fragment && target) {
            const content = fragment.cloneNode(true);

            // Optional transformation logic
            if (typeof options.transform === 'function') {
                options.transform(content);
            }

            switch (options.mode) {
                case "append":
                    target.appendChild(content);
                    break;
                case "prepend":
                    target.prepend(content);
                    break;
                case "replace":
                default:
                    target.innerHTML = "";
                    target.appendChild(content);
            }
        } else {
            console.warn(`Element not found: ${selector} or target #${targetId}`);
            target.innerHTML="";
        }
    } catch (err) {
        console.error(`Failed to load versioned content (${selector}):`, err);
    }
}

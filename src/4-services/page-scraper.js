import { helper } from "../2-utils/helper.js";

class PageScraper {

    // Function to find an element by matching text within attributes or content
    async findElementByText(page, text) {

        for (let i = 1; i <= 20; i++) { // Try multiple times.

            const handle = await page.evaluateHandle(text => {
                const elements = document.querySelectorAll('input, div, span'); // Query relevant elements
                for (const el of elements) {
                    const ariaLabel = el.getAttribute('aria-label')?.toLowerCase() || '';
                    const placeholder = el.getAttribute('placeholder')?.toLowerCase() || '';
                    const innerText = el.textContent?.toLowerCase() || '';
                    if (ariaLabel.includes(text) || placeholder.includes(text) || innerText.includes(text)) return el;
                }
                return null; // Return null if no match is found
            }, text.toLowerCase());

            if (handle?.asElement()) return handle.asElement();

            await helper.delay(1000);
        }

        return null;
    }

}

export const pageScraper = new PageScraper();

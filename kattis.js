const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const BASE = "https://open.kattis.com";
const baseURL = new URL(BASE);

const PAGE_NUMBER_START = 0;
const PAGE_NUMBER_END = 6;
const pageNumberInterval = PAGE_NUMBER_END - PAGE_NUMBER_START;

const pageToFetch = new URL("problems", baseURL);
const pageToFetchParams = new URLSearchParams(
    {
        page: Math.floor(Math.random() * (pageNumberInterval + 1)) + PAGE_NUMBER_START,
        order: "+difficulty_category"
    }
);

fetch(`${pageToFetch}?${pageToFetchParams}`).
    then(resp => resp.text()).
    then(htmlString => {
        const selectedProblem = selectProblem(htmlString);
        console.log(`${new URL(selectedProblem.link, BASE).toString()} (${selectedProblem.difficulty})`);
    });

function selectProblem(htmlString) {
    const dom = new JSDOM(htmlString);
    const problemRows = dom.window.document.querySelectorAll("body > main.l-offset_main > div.l-report_grid > article table.table2 > tbody > tr");

    const problems = [];
    for (const row of problemRows) {
        const problemLink = row.querySelector("td > a");
        const problemDifficulty = row.querySelector("td > span.difficulty_number");

        problems.push({
            link: problemLink.getAttribute("href"),
            difficulty: problemDifficulty.textContent
        });
    }

    return problems[Math.floor(Math.random() * problems.length)];
}
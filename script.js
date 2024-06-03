function displayContent(title, placeholderStrings, secondPlaceholderStrings) {

    var placeholderOptions = {
        strings: placeholderStrings,
        typeSpeed: 50,
        backSpeed: 50,
        loop: true,
        attr: 'placeholder'
    };

    var secondPlaceholderOptions = structuredClone(placeholderOptions);
    secondPlaceholderOptions.strings = secondPlaceholderStrings;

    var titleOptions = {
        strings: [title],
        typeSpeed: 50,
        showCursor: false,
        onComplete: function () {
            document.getElementById('show-after-animation').style.display = 'block';
            new Typed("input:first-of-type", placeholderOptions);
            if (secondPlaceholderStrings != [])
                new Typed("input:nth-of-type(2)", secondPlaceholderOptions);
        }
    };

    new Typed("#title", titleOptions);
}

async function checkIfPageAlreadyExist(page, platform) {
    const url = `https://raw.githubusercontent.com/tldr-pages/tldr/main/pages/${platform}/${page}.md`;
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch (error) {
        console.error('Error checking page existence:', error);
        return false;
    }
}

async function getPagePlatformsList(page) {
    const platforms = ["common", "linux", "netbsd", "openbsd", "freebsd", "windows", "osx"];
    const existingPlatforms = [];

    for (const platform of platforms) {
        if (await checkIfPageAlreadyExist(page, platform)) {
            existingPlatforms.push(platform);
        }
    }

    return existingPlatforms;
}

function savePlatformsToLocalStorage(list) {
    localStorage.setItem('platforms', JSON.stringify(list));
}

function alreadyExistWarning() {
    const warningElement = document.querySelector('h1.warning');
    const warningContainerElement = document.querySelector('.warning-container');
    const hideWhenFinished = document.getElementById("hide-when-finished");

    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('title');
    const skipWarning = urlParams.get('warning') == 'false';

    if (skipWarning) {
        window.location.href = 'platform';
    }

    getPagePlatformsList(page).then(platformsWithPage => {
        savePlatformsToLocalStorage(platformsWithPage);

        if (platformsWithPage.length > 0) {
            hideWhenFinished.style.display = 'none';
            const alreadyExist = `This command already exists in: ${platformsWithPage.join(', ')}. Are you sure you have to create a new page?`;

            warningContainerElement.style.display = 'flex';
            new Typed('h1.warning', {
                strings: [alreadyExist],
                typeSpeed: 50,
                showCursor: false,
            });
        }
        else {
            window.location.href = 'platform';
        }
    });
}

function saveURLParamsToLocalStorage() {
    const urlParams = new URLSearchParams(window.location.search);

    urlParams.forEach((value, key) => {
        localStorage.setItem(key, value);
    });
}

function loadPlatformsFromLocalStorage() {
    const platforms = localStorage.getItem('platforms');
    return JSON.parse(platforms) || [];
}

function hidePlatformRadioButtons() {
    const loadedList = loadPlatformsFromLocalStorage();

    loadedList.forEach(item => {
        const label = document.querySelector(`label[for="${item}"]`);
        label.style.display = 'none';
    });
}